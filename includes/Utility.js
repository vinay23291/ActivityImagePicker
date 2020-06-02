import { PermissionsAndroid, Alert, } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

export const DEFAULT_DATE_FORMAT = 'MM/DD/YYYY';
export const FORM_DATE_FORMAT = 'MMM DD, YYYY';
export const WINDOW_DATE_FORMAT = 'MMM DD';
export const SERVER_DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ss.SSS\\Z';
import { cropPlanCurrentYear, firstPickableCropYear, } from './common-static-values';
import moment from 'moment';
import { ME, FARMS, FIELDS, COMMODITIES, } from './NetworkConst';
import { valueLabel, } from './planting';

export const getFarmsPath = `${ME}${FARMS}`;
export const getFieldsPath = farmId => `${FARMS}/${ farmId }${FIELDS}`;
export const getCommoditiesPath = farmId => `${FARMS}/${ farmId }${COMMODITIES}`;
export const getFieldPath = field => !! field.id
	? `${FIELDS}/${field.id}`
	: `${FARMS}/${field.farm_id}${FIELDS}`;
export const getActivityPath = activity => !! activity.id
	? `/${ activity.type }s/${activity.id}`
	: `${FIELDS}/${ activity.field_id }/${ activity.type }s`;

export const requestLocationPermission = () => {
	return PermissionsAndroid.request(
		PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
		{
			title: 'Farm At Hand wants to use your location.',
			message: 'We use your location to orient the map when you add a field, and to get weather data.',
			buttonNeutral: 'Ask Me Later',
			buttonNegative: 'Cancel',
			buttonPositive: 'OK',
		},
	)
	.then( result => result === PermissionsAndroid.RESULTS.GRANTED );
};

export const isEmpty = ( text ) => {
	if ( Object.prototype.toString.call( text ) === '[object Array]' ) {
		if ( text.length > 0 ) return false;
		else return true;
	} else if ( text !== null && typeof text === 'object' ) {
		if ( Object.keys( text ).length === 0 ) return true;
		else return false;
	} else {
		if ( text != null && text != undefined && text != '' ) return false;
		else return true;
	}
};

export const getUiFormatDate = (
	format = DEFAULT_DATE_FORMAT,
	date
) => {
	moment.locale( 'en' );

	return moment( date ).utc().format( format ); //basically you can do all sorts of the formatting and others
};

export const getCropYearOptions = () => {
	const cropYearOptions = [];
	const maxYear = Number( cropPlanCurrentYear ) + 10;

	for (
		let index = maxYear;
		index > Number( firstPickableCropYear );
		index--
	) {
		cropYearOptions.push( String( index ) );
	}

	return valueLabel( cropYearOptions );
};

export const showAlert = ( title, message, buttonOptions = [] ) => Alert.alert(
	title,
	message,
	buttonOptions,
	{ cancelable: false }
);

export const deleteAfterConfirming = ( title, message, handleDelete, ) => showAlert(
	title,
	message,
	[ {
		text: 'Cancel',
		onPress: () => {
			// handle cancel here
		},
		style: 'cancel',
	}, {
		text: 'Confirm',
		onPress: handleDelete,
	}, ],
);

export const isOnline = () => NetInfo.fetch()
.then( state => state.isInternetReachable );

export const roundOff = value => Number( value ).toFixed( 2 );

export const getTotalUnit = rate_unit => rate_unit.split( '/' )[0];
