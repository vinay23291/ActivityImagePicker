/*global __DEV__*/
import axios from 'axios';
import { BASEURL, } from 'react-native-dotenv';
import { appVersion, } from './common-static-values';

export const request = (
	path, data, method, headers={},
) => {
	if ( __DEV__ ) {
		console.log( path, method, data );
	}

	return axios( {
		url: `${ BASEURL }${ path }`,
		data,
		method,
		headers,
	} );
};

export const authenticatedRequest = (
	token,
	path, data, method,
) => request(
	path, data, method,
	{
		Authorization: 'Bearer ' + token,
		'Content-Type': 'application/json',
		'X-Android-Version': appVersion,
	},
);
