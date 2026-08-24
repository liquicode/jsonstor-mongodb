'use strict';

const jsonstor = require( '@liquicode/jsonstor' )();
jsonstor.LoadPlugin( require( '../src/jsonstor-mongodb.js' ) );

const run_inventory = require( '@liquicode/jsonstor-docs' );

const Storage = jsonstor.GetStorage( 'jsonstor-mongodb', {
	ConnectionString: 'mongodb://localhost',
	DatabaseName: 'jsonstor-mongodb',
	CollectionName: 'unit-tests',
} );


describe( 'jsonstor-mongodb Tests', () =>
{
	run_inventory( Storage );
} );

