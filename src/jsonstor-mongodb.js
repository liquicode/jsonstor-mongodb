'use strict';

const jsongin = require( '@liquicode/jsongin' );
const MongoDB = require( 'mongodb' );


module.exports = {

	AdapterName: 'jsonstor-mongodb',
	AdapterDescription: 'Documents are stored on a MongoDB server.',

	GetAdapter: function ( jsonstor, Settings )
	{


		//=====================================================================
		/*
			Settings = {
				ConnectionString: '',
				DatabaseName: '',
				CollectionName: '',
			}
		*/
		if ( jsongin.ShortType( Settings ) !== 'o' ) { throw new Error( `This adapter requires a Settings parameter.` ); }
		if ( jsongin.ShortType( Settings.ConnectionString ) !== 's' ) { throw new Error( `This adapter requires a Settings.ConnectionString string parameter.` ); }
		if ( jsongin.ShortType( Settings.DatabaseName ) !== 's' ) { throw new Error( `This adapter requires a Settings.DatabaseName string parameter.` ); }
		if ( jsongin.ShortType( Settings.CollectionName ) !== 's' ) { throw new Error( `This adapter requires a Settings.CollectionName string parameter.` ); }


		//=====================================================================
		// let Storage = jsonstore.StorageInterface( this, Settings );
		let Storage = jsonstor.StorageInterface();
		Storage.Settings = jsongin.SafeClone( Settings );


		//=====================================================================
		async function WithStorage( Handler )
		{
			return new Promise(
				async function ( resolve, reject )
				{
					let database = null;
					let client = null;
					try
					{
						// Connect to the server.
						client = await MongoDB.MongoClient.connect(
							Settings.ConnectionString,
							{
								// keepAlive: 1,
								keepAlive: true,
								useUnifiedTopology: true,
								useNewUrlParser: true,
							}
						);
						if ( !client ) { throw new Error( `Unable to establish a connection to the mongodb database server.` ); }
						// Get the database.
						database = client.db( Settings.DatabaseName );
						// Get the collection.
						let collection = database.collection( Settings.CollectionName );
						// Do the stuff.
						// ***The database is handed over too***, because StorageInfo asks the
						// server a question about itself rather than about a collection. Every
						// other handler takes the first argument and ignores this one.
						let result = await Handler( collection, database );
						resolve( result );
					}
					catch ( error )
					{
						reject( error );
					}
					finally
					{
						if ( client )
						{
							client.close();
						}
					}
					return;
				} );
			return; // Inaccessible code.
		};



		//=====================================================================
		// ***The criteria the driver is actually given.***
		//
		// This adapter used to hand Criteria straight to the driver, which is right for every
		// criteria MongoDB can read and wrong for the four jsongin extensions it cannot:
		// $eqx, $nex, $exprx and $noop came back as `unknown operator`, not as an empty
		// result. MangoExpression is what tells the two apart.
		//
		// ***When the translation is exact, this is the pushdown and nothing else happens.***
		// That is the ordinary case - twenty seven of jsongin's thirty one query operators are
		// MongoDB's own - and it is the behavior this adapter has always had, minus the
		// assumption. One pure function call, no extra round trip, and the server still
		// decides, sorts, limits and mutates.
		//
		// ***When it is not exact, the matching _ids are resolved first.*** The pushdown is a
		// broadening, so what it returns is a superset; jsongin decides which of those the
		// criteria actually admits, and the driver is then given `{ _id: { $in: [ ... ] } }`,
		// which is exact by construction.
		//
		// ***Resolving to _ids rather than filtering in place is what makes the mutations
		// correct too.*** updateMany and deleteMany hand a criteria to the server and never see
		// a document, so there is no later pass where a residual could be applied - the only
		// place to be careful is before the statement goes out. It costs one extra round trip
		// on a path which used to raise an error, which is not a trade worth splitting into
		// two mechanisms.
		// Options carries the statistics collector for this one call. See
		// jsonstor/src/jsonstor/Statistics.js.
		async function resolve_criteria( Collection, Criteria, Options )
		{
			let translation = jsonstor.MangoExpression.Translate( { Criteria: Criteria } );
			if ( translation.Residual === null )
			{
				// ***The exact branch, where the server does all of it.*** The row counts are not
				// known here - the caller has not run the query yet - so report_rows completes
				// this from what came back.
				jsonstor.ReportStatistics( Options, {
					Translator: 'MangoExpression',
					Pushdown: translation.Pushdown,
					Residual: null,
				} );
				return translation.Pushdown;
			}
			// ***A malformed criteria is refused before anything is read.*** jsongin refuses a
			// criteria which is not an object, or which names an operator that does not exist,
			// and putting it one empty document is the cheapest way to ask. Waiting for the
			// loop below would make the refusal depend on the collection holding something -
			// so `FindMany( { $nope: 1 } )` would throw against a full collection and answer
			// [] against an empty one, which is the ambiguity the contract forbids.
			jsongin.Query( {}, translation.Residual );
			// The whole document is read rather than a projection of it: the residual may test
			// any field, and a projection would hide the ones it asks about.
			let db_cursor = await Collection.find( translation.Pushdown );
			if ( !db_cursor ) { throw new Error( `Unable to obtain a cursor on the collection while resolving a criteria.` ); }
			let documents = await db_cursor.toArray();
			let ids = [];
			for ( let index = 0; index < documents.length; index++ )
			{
				if ( jsongin.Query( documents[ index ], translation.Residual ) ) { ids.push( documents[ index ]._id ); }
			}
			// ***The broadening branch, where both numbers are known.*** documents came back from
			// the pushdown and ids are the ones jsongin kept, which is the two stage model with
			// the split visible.
			jsonstor.ReportStatistics( Options, {
				Translator: 'MangoExpression',
				Pushdown: translation.Pushdown,
				PushdownRows: documents.length,
				Residual: translation.Residual,
				ResidualRows: ids.length,
			} );
			return { _id: { $in: ids } };
		}

		//=====================================================================
		// Completes the measurement for the branch which could not finish it.
		//
		// ***resolve_criteria knows the row counts only when it broadens.*** On that branch
		// it reads the documents itself, so it reports both numbers and this leaves them
		// alone. On the exact branch the server answers the criteria directly and nothing
		// has counted anything yet - what came back is then both the rows which travelled
		// and the rows which matched, because there was no second stage to remove any.
		//=====================================================================


		function report_rows( Options, Returned )
		{
			let reported = jsonstor.ReadStatistics( Options );
			if ( !reported ) { return; }
			if ( reported.Residual !== null ) { return; }
			jsonstor.ReportStatistics( Options, { PushdownRows: Returned, ResidualRows: Returned } );
			return;
		}


		//=====================================================================
		// DropStorage
		//=====================================================================


		// ***What this storage is actually talking to.*** The host and port live inside the
		// connection string here rather than in settings of their own, so that string is the
		// honest endpoint.
		Storage.StorageInfo = async function ( Options )
		{
			return await WithStorage(
				async function ( collection, database )
				{
					let build = await database.admin().buildInfo();
					return jsonstor.BuildStorageInfo( Storage, {
						Product: 'MongoDB',
						Version: build.version || '',
						Endpoint: Storage.Settings.ConnectionString || '',
					} );
				} );
		};


		//=====================================================================
		// What the identity settings resolved to.
		//
		// ***MongoDB is the one adapter with nothing to resolve.*** The identifier is `_id` by
		// the server's own rule, it is minted by the driver when a document arrives without one,
		// and the server refuses a change to it - which is the behavior the rest of the family
		// has just been brought round to. There is no IdField here and there never was.
		Storage.PrimaryKeyInfo = {
			Fields: [ '_id' ],
			// The medium holds the true type: an ObjectId, a string, or a number, as written.
			Types: [],
			Mutable: false,
			Generated: true,
			IndexHostedBy: 'database',
		};


		//=====================================================================
		// RefreshIndex
		//=====================================================================


		// ***A no-op which answers 0, and means it.*** The index is the collection's own `_id`
		// index and the server maintains it; there is nothing here which could go stale. It is
		// implemented rather than left to the interface stub because the stub throws, and an
		// adapter with no index to refresh is not an adapter which forgot to write this.
		Storage.RefreshIndex = async function ( Options )
		{
			return 0;
		};


		Storage.DropStorage = async function ( Options ) 
		{
			return await WithStorage(
				async function ( Collection )
				{
					return new Promise(
						async function ( resolve, reject )
						{
							try
							{
								let result = await Collection.drop();
								resolve( true );
								return;
							}
							catch ( error )
							{
								if ( error.message === 'ns not found' )
								{
									// resolve( false );
									resolve( true );
								}
								else
								{
									reject( error );
								}
								return;
							}
							return;
						} );
					return;
				} );
		};


		//=====================================================================
		// FlushStorage
		//=====================================================================


		Storage.FlushStorage = async function ( Options ) 
		{
			return new Promise(
				async function ( resolve, reject )
				{
					try
					{
						resolve( true );
						return;
					}
					catch ( error )
					{
						reject( error );
						return;
					}
					return;
				} );
		};


		//=====================================================================
		// Count
		//=====================================================================


		Storage.Count = async function ( Criteria, Options ) 
		{
			return await WithStorage(
				async function ( Collection )
				{
					return new Promise(
						async function ( resolve, reject )
						{
							try
							{
								if ( jsongin.ShortType( Options ) !== 'o' ) { Options = {}; }
								Criteria = await resolve_criteria( Collection, Criteria, Options );
								let count = await Collection.countDocuments( Criteria );
								report_rows( Options, count );
								resolve( count );
							}
							catch ( error )
							{
								reject( error );
							}
							return;
						} );
					return;
				} );
		};


		//=====================================================================
		// InsertOne
		//=====================================================================


		Storage.InsertOne = async function ( Document, Options ) 
		{
			return await WithStorage(
				async function ( Collection )
				{
					return new Promise(
						async function ( resolve, reject )
						{
							try
							{
								if ( jsongin.ShortType( Options ) !== 'o' ) { Options = {}; }
								let db_response = await Collection.insertOne( Document );
								if ( !db_response.acknowledged ) { throw new Error( 'The MongoDB Server did not acknowledge the insertion.' ); }
								let document = null;
								if ( Options.ReturnDocuments )
								{
									document = await Collection.findOne( { _id: db_response.insertedId } );
								}
								if ( Options.ReturnDocuments )
								{
									resolve( document );
								}
								else
								{
									resolve( 1 );
								}
							}
							catch ( error )
							{
								reject( error );
							}
							return;
						} );
					return;
				} );
		};


		//=====================================================================
		// InsertMany
		//=====================================================================


		Storage.InsertMany = async function ( Documents, Options ) 
		{
			return await WithStorage(
				async function ( Collection )
				{
					return new Promise(
						async function ( resolve, reject )
						{
							try
							{
								if ( jsongin.ShortType( Options ) !== 'o' ) { Options = {}; }
								// ***An empty insert is nothing to do, not something to refuse.***
								// The driver rejects an empty array outright, where every other
								// adapter in the family answers 0 - so this is the one engine which
								// turned InsertMany( [] ) into an error. Answered here rather than
								// sent, because there is nothing to send.
								if ( Documents.length === 0 )
								{
									resolve( Options.ReturnDocuments ? [] : 0 );
									return;
								}
								let db_response = await Collection.insertMany( Documents );
								if ( !db_response.acknowledged ) { throw new Error( 'The MongoDB Server did not acknowledge the insertion.' ); }
								let modified_count = db_response.insertedCount;
								let modified = [];
								if ( Options.ReturnDocuments )
								{
									let modified_ids = [];
									for ( let key in db_response.insertedIds )
									{
										modified_ids.push( db_response.insertedIds[ key ] );
									}
									let db_cursor = await Collection.find( { _id: { $in: modified_ids } } );
									if ( !db_cursor ) { throw new Error( `Unable to obtain a cursor on the collection during InsertMany.` ); }
									modified = await db_cursor.toArray();
								}
								if ( Options.ReturnDocuments )
								{
									resolve( modified );
								}
								else
								{
									resolve( modified_count );
								}
							}
							catch ( error )
							{
								reject( error );
							}
							return;
						} );
					return;
				} );
		};


		//=====================================================================
		// FindOne
		//=====================================================================


		Storage.FindOne = async function FindOne( Criteria, Projection, Options ) 
		{
			return await WithStorage(
				async function ( Collection )
				{
					return new Promise(
						async function ( resolve, reject )
						{
							try
							{
								if ( jsongin.ShortType( Options ) !== 'o' ) { Options = {}; }
								Criteria = await resolve_criteria( Collection, Criteria, Options );
								let document = await Collection.findOne( Criteria, Projection );
								report_rows( Options, document ? 1 : 0 );
								// let document = await Collection.findOne( Criteria ).project( Projection );
								resolve( document );
							}
							catch ( error )
							{
								reject( error );
							}
							return;
						} );
					return;
				} );
		};


		//=====================================================================
		// FindMany
		//=====================================================================


		Storage.FindMany = async function FindMany( Criteria, Projection, Options ) 
		{
			return await WithStorage(
				async function ( Collection )
				{
					return new Promise(
						async function ( resolve, reject )
						{
							try
							{
								if ( jsongin.ShortType( Options ) !== 'o' ) { Options = {}; }
								Criteria = await resolve_criteria( Collection, Criteria, Options );
								let db_cursor = await Collection.find( Criteria ).project( Projection );
								if ( !db_cursor ) { throw new Error( `Unable to obtain a cursor on the collection during FindMany.` ); }
								let documents = await db_cursor.toArray();
								report_rows( Options, documents.length );
								resolve( documents );
							}
							catch ( error )
							{
								reject( error );
							}
							return;
						} );
					return;
				} );
		};


		//=====================================================================
		// FindMany2
		//=====================================================================


		Storage.FindMany2 = async function FindMany2( Criteria, Projection, Sort, MaxCount, Options ) 
		{
			return await WithStorage(
				async function ( Collection )
				{
					return new Promise(
						async function ( resolve, reject )
						{
							try
							{
								if ( jsongin.ShortType( Options ) !== 'o' ) { Options = {}; }
								Criteria = await resolve_criteria( Collection, Criteria, Options );
								let db_cursor = await Collection.find( Criteria ).project( Projection );
								if ( db_cursor && Sort ) { db_cursor = await db_cursor.sort( Sort ); };
								if ( db_cursor && MaxCount && ( MaxCount > 0 ) ) { db_cursor = await db_cursor.limit( MaxCount ); };
								if ( !db_cursor ) { throw new Error( `Unable to obtain a cursor on the collection during FindMany.` ); }
								let documents = await db_cursor.toArray();
								report_rows( Options, documents.length );
								resolve( documents );
							}
							catch ( error )
							{
								reject( error );
							}
							return;
						} );
					return;
				} );
		};


		//=====================================================================
		// UpdateOne
		//=====================================================================


		Storage.UpdateOne = async function UpdateOne( Criteria, Update, Options ) 
		{
			return await WithStorage(
				async function ( Collection )
				{
					return new Promise(
						async function ( resolve, reject )
						{
							try
							{
								if ( jsongin.ShortType( Options ) !== 'o' ) { Options = {}; }
								Criteria = await resolve_criteria( Collection, Criteria, Options );
								let modified_id = null;
								if ( Options.ReturnDocuments )
								{
									modified_id = await Collection.findOne( Criteria, { _id: 1 } );
									// modified_id = await Collection.findOne( Criteria ).project( { _id: 1 } );
									if ( modified_id ) { modified_id = modified_id._id; }
								}
								let db_response = await Collection.updateOne( Criteria, Update );
								if ( !db_response.acknowledged ) { throw new Error( `Database did not acknowledge the update.` ); }
								let modified_count = db_response.modifiedCount;
								let modified = null;
								if ( modified_id )
								{
									modified = await Collection.findOne( { _id: modified_id } );
								}
								// if ( !modified && db_response.upsertedId )
								// {
								// 	modified = await Collection.findOne( { _id: db_response.upsertedId } );
								// }
								if ( Options.ReturnDocuments )
								{
									resolve( modified );
								}
								else
								{
									resolve( modified_count );
								}
							}
							catch ( error )
							{
								reject( error );
							}
							return;
						} );
					return;
				} );
		};


		//=====================================================================
		// UpdateMany
		//=====================================================================


		Storage.UpdateMany = async function UpdateMany( Criteria, Update, Options ) 
		{
			return await WithStorage(
				async function ( Collection )
				{
					return new Promise(
						async function ( resolve, reject )
						{
							try
							{
								if ( jsongin.ShortType( Options ) !== 'o' ) { Options = {}; }
								Criteria = await resolve_criteria( Collection, Criteria, Options );
								let modified_ids = [];
								if ( Options.ReturnDocuments )
								{
									let db_cursor = await Collection.find( Criteria ).project( { _id: 1 } );
									if ( !db_cursor ) { throw new Error( `Unable to obtain a cursor on the collection during UpdateMany.` ); }
									modified_ids = await db_cursor.toArray();
									modified_ids = modified_ids.map( function ( Element ) { return Element._id; } );
								}
								let db_response = await Collection.updateMany( Criteria, Update );
								if ( !db_response.acknowledged ) { throw new Error( `Database did not acknowledge the update.` ); }
								let modified_count = db_response.modifiedCount;
								let modified = [];
								if ( Options.ReturnDocuments && modified_ids.length )
								{
									let db_cursor = await Collection.find( { _id: { $in: modified_ids } } );
									if ( !db_cursor ) { throw new Error( `Unable to obtain a cursor on the collection during UpdateMany.` ); }
									modified = await db_cursor.toArray();
								}
								// ***The cross check only means anything when the documents were fetched.***
								// Without ReturnDocuments nothing populates `modified`, so an empty array
								// was being compared against a real modified count and every UpdateMany
								// which changed a document threw. ReplaceOne guards the same check the
								// same way, ten lines further down, and is what this was measured against.
								// Found on 2026-08-28: no test had ever called UpdateMany without asking
								// for the documents back.
								if ( Options.ReturnDocuments )
								{
									if ( modified.length !== modified_count ) { throw new Error( `Internal modified count mismatch during UpdateMany.` ); }
								}
								if ( Options.ReturnDocuments )
								{
									resolve( modified );
								}
								else
								{
									resolve( modified_count );
								}
							}
							catch ( error )
							{
								reject( error );
							}
							return;
						} );
					return;
				} );
		};


		//=====================================================================
		// ReplaceOne
		//=====================================================================


		Storage.ReplaceOne = async function ReplaceOne( Criteria, Document, Options ) 
		{
			return await WithStorage(
				async function ( Collection )
				{
					return new Promise(
						async function ( resolve, reject )
						{
							try
							{
								if ( jsongin.ShortType( Options ) !== 'o' ) { Options = {}; }
								Criteria = await resolve_criteria( Collection, Criteria, Options );
								let modified_id = null;
								if ( Options.ReturnDocuments )
								{
									modified_id = await Collection.findOne( Criteria, { _id: 1 } );
									// modified_id = await Collection.findOne( Criteria ).project( { _id: 1 } );
									if ( modified_id ) { modified_id = modified_id._id; }
								}
								let db_response = await Collection.replaceOne( Criteria, Document );
								if ( !db_response.acknowledged ) { throw new Error( `Database did not acknowledge the replacement.` ); }
								let modified_count = db_response.modifiedCount;
								let modified = [];
								if ( Options.ReturnDocuments && modified_id )
								{
									modified = await Collection.findOne( { _id: modified_id } );
								}
								if ( Options.ReturnDocuments )
								{
									if ( ( modified_id && !modified ) || ( !modified_id && modified ) ) { throw new Error( `Internal modified count mismatch during ReplaceOne.` ); }
									resolve( modified );
								}
								else
								{
									resolve( modified_count );
								}
							}
							catch ( error )
							{
								reject( error );
							}
							return;
						} );
					return;
				} );
		};


		//=====================================================================
		// DeleteOne
		//=====================================================================


		Storage.DeleteOne = async function DeleteOne( Criteria, Options ) 
		{
			return await WithStorage(
				async function ( Collection )
				{
					return new Promise(
						async function ( resolve, reject )
						{
							try
							{
								if ( jsongin.ShortType( Options ) !== 'o' ) { Options = {}; }
								Criteria = await resolve_criteria( Collection, Criteria, Options );
								let modified = null;
								if ( Options.ReturnDocuments )
								{
									modified = await Collection.findOne( Criteria );
								}
								let db_response = await Collection.deleteOne( Criteria );
								if ( !db_response.acknowledged ) { throw new Error( `Database did not acknowledge the deletion.` ); }
								let modified_count = db_response.deletedCount;
								if ( Options.ReturnDocuments )
								{
									resolve( modified );
								}
								else
								{
									resolve( modified_count );
								}
							}
							catch ( error )
							{
								reject( error );
							}
							return;
						} );
					return;
				} );
		};


		//=====================================================================
		// DeleteMany
		//=====================================================================


		Storage.DeleteMany = async function DeleteMany( Criteria, Options ) 
		{
			return await WithStorage(
				async function ( Collection )
				{
					return new Promise(
						async function ( resolve, reject )
						{
							try
							{
								if ( jsongin.ShortType( Options ) !== 'o' ) { Options = {}; }
								Criteria = await resolve_criteria( Collection, Criteria, Options );
								let modified = [];
								if ( Options.ReturnDocuments )
								{
									let db_cursor = await Collection.find( Criteria );
									if ( !db_cursor ) { throw new Error( `Unable to obtain a cursor on the collection during DeleteMany.` ); }
									modified = await db_cursor.toArray();
								}
								let db_response = await Collection.deleteMany( Criteria );
								if ( !db_response.acknowledged ) { throw new Error( `Database did not acknowledge the deletion.` ); }
								let modified_count = db_response.deletedCount;
								if ( Options.ReturnDocuments )
								{
									resolve( modified );
								}
								else
								{
									resolve( modified_count );
								}
							}
							catch ( error )
							{
								reject( error );
							}
							return;
						} );
					return;
				} );
		};



		//=====================================================================
		// MangoTranslation
		//
		// ***What a Mango-translating adapter advertises beyond the Storage interface.***
		// Its presence is the capability declaration, the same way Storage.SqlTranslation is in
		// the two SQL adapters: a suite asks the constructed Storage rather than consulting a
		// list somewhere which could disagree with it. Constructing a Storage opens no
		// connection, so the question is answerable while the server is down.
		//
		// ***There is no Dialect() here because this adapter narrows nothing.*** MongoDB is the
		// vocabulary MangoExpression was measured against, so its ceiling is this adapter's
		// vocabulary exactly. A narrower Mango speaker - CouchDB, PouchDB - would declare
		// OperatorFidelities here and get the same translator, which is the point of the
		// option existing.
		//=====================================================================

		Storage.MangoTranslation = {
			TranslatorName: 'MangoExpression',

			// The options this adapter translates with. A copy, so a caller cannot alter them.
			Options: function () { return {}; },

			// ***Whether a criteria is decided by the server alone.*** A caller which wants to
			// know before it asks - a suite measuring absorption, a caller choosing between a
			// server-side mutation and reading the documents back - asks here rather than
			// reaching for the translator itself and guessing at the options.
			Absorbs: function ( Criteria )
			{
				return ( jsonstor.MangoExpression.Translate( { Criteria: Criteria } ).Residual === null );
			},

			// The query the driver would be given for a criteria this adapter absorbs entirely.
			// Pure: it opens no connection and reads no document.
			Pushdown: function ( Criteria )
			{
				return jsonstor.MangoExpression.Translate( { Criteria: Criteria } ).Pushdown;
			},
		};

		//=====================================================================
		return Storage;
	},

};


