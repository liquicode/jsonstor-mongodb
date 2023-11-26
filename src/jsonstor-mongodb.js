'use strict';

const jsongin = require( '@liquicode/jsongin' )();
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
		async function WithStorage( api_callback )
		{
			return new Promise(
				async ( resolve, reject ) =>
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
						let result = await api_callback( collection );
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
			return;
		};


		//=====================================================================
		// DropStorage
		//=====================================================================


		Storage.DropStorage = async function ( Options ) 
		{
			return await WithStorage(
				async function ( Collection )
				{
					return new Promise(
						async ( resolve, reject ) =>
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
									resolve( false );
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
				async ( resolve, reject ) =>
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
						async ( resolve, reject ) =>
						{
							try
							{
								if ( jsongin.ShortType( Options ) !== 'o' ) { Options = {}; }
								let count = await Collection.countDocuments( Criteria );
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
						async ( resolve, reject ) =>
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
						async ( resolve, reject ) =>
						{
							try
							{
								if ( jsongin.ShortType( Options ) !== 'o' ) { Options = {}; }
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
						async ( resolve, reject ) =>
						{
							try
							{
								if ( jsongin.ShortType( Options ) !== 'o' ) { Options = {}; }
								let document = await Collection.findOne( Criteria, Projection );
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
						async ( resolve, reject ) =>
						{
							try
							{
								if ( jsongin.ShortType( Options ) !== 'o' ) { Options = {}; }
								let db_cursor = await Collection.find( Criteria ).project( Projection );
								if ( !db_cursor ) { throw new Error( `Unable to obtain a cursor on the collection during FindMany.` ); }
								let documents = await db_cursor.toArray();
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
						async ( resolve, reject ) =>
						{
							try
							{
								if ( jsongin.ShortType( Options ) !== 'o' ) { Options = {}; }
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
						async ( resolve, reject ) =>
						{
							try
							{
								if ( jsongin.ShortType( Options ) !== 'o' ) { Options = {}; }
								let modified_ids = [];
								if ( Options.ReturnDocuments )
								{
									let db_cursor = await Collection.find( Criteria ).project( { _id: 1 } );
									if ( !db_cursor ) { throw new Error( `Unable to obtain a cursor on the collection during UpdateMany.` ); }
									modified_ids = await db_cursor.toArray();
									modified_ids = modified_ids.map( element => element._id );
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
								if ( modified.length !== modified_count ) { throw new Error( `Internal modified count mismatch during UpdateMany.` ); }
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
						async ( resolve, reject ) =>
						{
							try
							{
								if ( jsongin.ShortType( Options ) !== 'o' ) { Options = {}; }
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
						async ( resolve, reject ) =>
						{
							try
							{
								if ( jsongin.ShortType( Options ) !== 'o' ) { Options = {}; }
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
						async ( resolve, reject ) =>
						{
							try
							{
								if ( jsongin.ShortType( Options ) !== 'o' ) { Options = {}; }
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
		return Storage;
	},

};


