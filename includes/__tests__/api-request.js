import { request, authenticatedRequest, } from '../api-request';
import axios from 'axios';
import { BASEURL, } from 'react-native-dotenv';
import { appVersion, } from '../common-static-values';

describe( 'request( path, data, method, headers )', () => {
	axios.mockReturnValueOnce( 'axios return value' );

	const returnValue = request(
		'/blue',
		{ some: 'data', },
		'put',
		{ some: 'headers', },
	);

	it( 'should send a request to the server', () => {
		expect( axios ).toHaveBeenCalled();
	} );

	describe( 'request sent to server', () => {
		const { url, data, method, headers } = axios.mock.calls[ 0 ][ 0 ];

		it( 'should be sent to the URL defined by taking the API base url and tacking the provided path to the end', () => {
			expect( url ).toEqual( BASEURL + '/blue' );
		} );

		it( 'should contain the provided data', () => {
			expect( data ).toEqual( { some: 'data', } );
		} );

		it( 'should use the provided request method', () => {
			expect( method ).toEqual( 'put' );
		} );

		it( 'should use the provided headers', () => {
			expect( headers ).toEqual( { some: 'headers', } );
		} );
	} );

	describe( 'return value', () => {
		it( 'should simply be the return value of the call to axios', () => {
			expect( returnValue ).toEqual( 'axios return value' );
		} );
	} );
} );

describe( 'authenticatedRequest( token, path, data, method )', () => {
	axios.mockReturnValueOnce( 'just the axios return value' );

	const returnValue = authenticatedRequest(
		'sometoken',
		'/red',
		{ some: 'otherdata', },
		'delete',
	);

	it( 'should send a request to the server', () => {
		expect( axios ).toHaveBeenCalled();
	} );

	describe( 'request sent to server', () => {
		const { url, data, method, headers } = axios.mock.calls[ 1 ][ 0 ];

		it( 'should be sent to the URL defined by taking the API base url and tacking the provided path to the end', () => {
			expect( url ).toEqual( BASEURL + '/red' );
		} );

		it( 'should contain the provided data', () => {
			expect( data ).toEqual( { some: 'otherdata', } );
		} );

		it( 'should use the provided request method', () => {
			expect( method ).toEqual( 'delete' );
		} );

		it( 'should compose headers to contain provided token and the app version number', () => {
			expect( headers ).toEqual( {
				Authorization: 'Bearer sometoken',
				'Content-Type': 'application/json',
				'X-Android-Version': appVersion,
			} );
		} );
	} );

	describe( 'return value', () => {
		it( 'should simply be the return value of the call to axios', () => {
			expect( returnValue ).toEqual( 'just the axios return value' );
		} );
	} );
} );
