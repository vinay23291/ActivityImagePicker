/*global context*/
import NetInfo from '@react-native-community/netinfo';
import { isOnline } from '../Utility';

describe( 'isOnline', () => {
	context( 'when there is a network', () => {
		beforeEach( () => {
			NetInfo.fetch.mockResolvedValue( { isInternetReachable: true } );
		} );

		it( 'should resolve true', () => {
			return expect( isOnline() ).resolves.toBe( true );
		} );
	} );

	context( 'when there is not a network', () => {
		beforeEach( () => {
			NetInfo.fetch.mockResolvedValue( { isInternetReachable: false } );
		} );

		it( 'should resolve false', () => {
			return expect( isOnline() ).resolves.toBe( false );
		} );
	} );
} );
