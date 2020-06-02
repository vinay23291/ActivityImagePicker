import 'react-native-get-random-values';
import moment from 'moment';
import { nanoid } from 'nanoid';
import { findWhere, sortBy, } from 'underscore';
import { cropPlanCurrentYear, } from '../includes/common-static-values';
import { getUiFormatDate, SERVER_DATE_FORMAT, FORM_DATE_FORMAT } from './Utility';
import { valueLabel } from '../includes/planting';

export const getInternetReachabilityStatus = state => state.Client.isInternetReachable;
export const getUserLoginStatus = state => !! getToken( state );

export const getToken = state => state.AuthReducer.data.access_token;

export const getActivityFromState = ( state, local_id, isPlannedActivity ) => findWhere(
	state.ActivitiesReducer[ isPlannedActivity
		? 'plannedActivityData'
		: 'activityData'
	],
	{ local_id, }
);

export const getFieldFromState = ( state, local_id ) => {
	return findWhere(
		state.FieldsReducer.fieldsData,
		{ local_id, }
	);
};

export const getSelectedFarmId = state => state.FieldsReducer.selectedFarmId;

export const getSelectedFarm = state => {
	return findWhere(
		state.FieldsReducer.farmsData,
		{ id: getSelectedFarmId( state ), }
	);
};

export const getFieldsForSelectedFarm = state => {
	return state.FieldsReducer.fieldsData
	.filter( field => field.farm_id === state.FieldsReducer.selectedFarmId );
};

const getActivities = state => state.ActivitiesReducer.activityData;

export const getLocalOnlyHarvestsRelatedToPlanting = ( state, plantingLocalId ) => getActivities( state )
.filter( activity => {
	const isAHarvest = 'harvest' === activity.type;
	const isLocalOnly = ! activity.planting_id;
	const isRelatedToThisPlanting = plantingLocalId === activity.planting_local_id;

	return isAHarvest && isLocalOnly && isRelatedToThisPlanting;
} );

export const getFieldActivities = ( state, fieldLocalId ) => getActivities( state )
.filter( activity => activity.field_local_id === fieldLocalId );

export const getFieldPlannedActivities = ( state, fieldLocalId ) => state.ActivitiesReducer
.plannedActivityData.filter( activity => activity.field_local_id === fieldLocalId );

export const getCropStatus = ( state, fieldLocalId, fieldArea, selectedCropYear ) => {
	const activities = getFieldActivities( state, fieldLocalId );

	function calculatePercentCompletion( activityType, jobOutputField ) {
		const total = activities.filter( activity => activity.type === activityType )
		.filter( activity => Number( activity.crop_year ) === Number( selectedCropYear ) )
		.reduce( ( total, activity ) => total + activity[ jobOutputField ], 0 );

		return Math.round( ( total / fieldArea ) * 100 );
	}

	function latestDateOf( type ) {
		const activity = sortBy(
			activities.filter( activity => activity.type === type && activity.crop_year == selectedCropYear ),
			activity => -( new Date( activity.date ) )
		)[ 0 ];

		return moment( activity.date, SERVER_DATE_FORMAT ).format( FORM_DATE_FORMAT );
	}

	const plantingCompletion = calculatePercentCompletion( 'planting', 'seeded_area' );
	const harvestCompletion = calculatePercentCompletion( 'harvest', 'harvest_area' );

	if ( harvestCompletion > 0 ) {
		return `Harvested (${harvestCompletion}%) on ${latestDateOf( 'harvest' )}`;
	} else if ( plantingCompletion > 0 ) {
		return `Seeded (${plantingCompletion}%) on ${latestDateOf( 'planting' )}`;
	} else if (
		getFieldPlannedActivities( state, fieldLocalId )
		.filter( activity => activity.crop_year == selectedCropYear )
		.length > 0
	) {
		return 'Planned';
	} else {
		return 'No Crop Plan';
	}
};

export const getFieldOptions = state => {
	return getFieldsForSelectedFarm( state )
	.sort( ( a, b ) => a.name.localeCompare( b.name ) )
	.map( field => ( {
		label: field.name,
		value: field.local_id,
	} ) );
};

const getCommoditiesForSelectedFarm = state => {
	const selectedFarm = getSelectedFarm( state );

	return state.FieldsReducer.commodities
	.filter( commodity => commodity.farm_id === selectedFarm.id );
};

export const getCommodityOptions = state => {
	const selectedFarmCommodities = getCommoditiesForSelectedFarm( state );

	return [ {
		value: '',
		label: 'Please select',
	} ].concat(
		selectedFarmCommodities
		.filter( commodity => commodity.should_be_shown )
		.map( commodity => ( {
			value: commodity.id,
			label: commodity.name,
		} ) )
	);
};

export const getNewField = state => {
	const selectedFarm = getSelectedFarm( state );

	return {
		farm_id: selectedFarm.id,
		local_id: nanoid(),
		name: '',
		location: '',
		area: '',
		ownership: '',
		cropshare_percentage: '',
		area_unit: selectedFarm.land_area_unit,
	};
};

const optionsWithLandAreaUnit = (
	state,
	options,
) => {
	const selectedFarm = getSelectedFarm( state );

	return valueLabel( options.map(
		option => option + '/' + selectedFarm.land_area_unit
	) );
};

export const getYieldUnitOptions = state => optionsWithLandAreaUnit( state, [
	'bu',
	'lb',
	'mt',
] );

export const getSeedRateUnitOptions = state => optionsWithLandAreaUnit( state, [
	'lb',
	'kg',
	'bags',
	'1,000 seeds',
	'10,000 seeds',
] );

export const getChemicalRateUnitOptions = state => {
	const selectedFarm = getSelectedFarm( state );

	return optionsWithLandAreaUnit( state, [
		'l',
		'gal',
		'g',
		'ml',
		'lb',
		'oz',
		'floz',
		'qt',
		'kg',
	] )
	.concat( valueLabel(
		[ 'case', 'jug', ]
		.map( unit => selectedFarm.land_area_unit + '/' + unit )
	) );
};

export const getFertilizerProductApplicationRateUnitOptions = state => optionsWithLandAreaUnit( state, [
	'lb',
	'kg',
	'mt',
	'l',
	'gal',
	'us ton',
] );

export const getSprayingWaterRateUnitOptions = state => optionsWithLandAreaUnit( state, [
	'gal',
	'l',
	'g',
	'ml',
	'lb',
] );

export const getCostUnitOptions = state => {
	const selectedFarm = getSelectedFarm( state );

	return valueLabel( [
		selectedFarm.currency + '/' + selectedFarm.land_area_unit,
		'total',
	] );
};

export const getNewActivity = ( state, type, field, plannedActivity ) => {
	const defaultActivity = getDefaultActivity( field, type, plannedActivity );

	switch( type ) {
		case 'application':
			return {
				...defaultActivity,
				application_products: plannedActivity ? plannedActivity.application_products : [],
				application_area: /*plannedActivity ? plannedActivity.application_area :*/ field.area,
				fertilizer_plan_id: plannedActivity ? plannedActivity.fertilizer_plan_id : null,
			};
		case 'custom':
			return {
				...defaultActivity,
				name: '',
			};
		case 'harvest':
			return {
				...defaultActivity,
				yield: '',
				yield_unit: getYieldUnitOptions( state )[0].value,
				concave: '',
				swathing_notes: ' ',
				disease: '',
				green: '',
				moisture: '',
				protein: '',
				fan_speed: '',
				upper_sieve: '',
				lower_sieve: '',
				rotor_speed: '',
				harvest_area: field.area,
			};
		case 'irrigation':
			return {
				...defaultActivity,
			};
		case 'observation':
			return {
				...defaultActivity,
				observation_type: '',
			};
		case 'planting':
			return {
				...defaultActivity,
				seed_plan_id: plannedActivity ? plannedActivity.seed_plan_id : null,
				variety: plannedActivity ? plannedActivity.variety : '',
				treatment: plannedActivity ? plannedActivity.treatment : '',
				seed_rate: plannedActivity ? plannedActivity.seed_rate : '',
				seed_rate_unit: plannedActivity ? plannedActivity.seed_rate_unit : getSeedRateUnitOptions( state )[ 0 ].value,
				seeded_area: plannedActivity ? plannedActivity.seeded_area : field.area,
				seed_cost: plannedActivity ? plannedActivity.seed_cost : '',
				seed_cost_unit: plannedActivity ? plannedActivity.seed_cost_unit : getCostUnitOptions( state )[ 0 ].value,
				treatment_cost: '',
				treatment_cost_unit: getCostUnitOptions( state )[ 0 ].value,
				soil_condition: '',
				application: getNewActivity( state, 'application', field ),
				commodity_id: plannedActivity ? plannedActivity.commodity_id : null,
			};
		case 'spraying':
			return {
				...defaultActivity,
				crop_protection_plan_id: plannedActivity ? plannedActivity.crop_protection_plan_id : null,
				application_rate: plannedActivity ? plannedActivity.application_rate : '',
				application_rate_unit: plannedActivity ? plannedActivity.application_rate_unit : 'gal/ac',
				sprayed_area: field.area,
				time: plannedActivity ? plannedActivity.timing : '',
				nozzle_type: '',
				weather_conditions: '',
				chemicals: plannedActivity ? plannedActivity.chemicals : [],
			};
		case 'swathing':
			return {
				...defaultActivity,
				swathed_area: field.area,
			};
	}
};

export const getFertilizerTypeName = ( state, id ) => {
	if ( ! id ) {
		return '';
	}

	return findWhere( state.Config.fertilizerTypes, { id, } ).name;
};

export const getFertilizerTypeOptions = state => [ {
	value: '',
	label: 'Please Select',
} ].concat(
	state.Config.fertilizerTypes
	.map( fertilizerType => ( {
		label: fertilizerType.name,
		value: fertilizerType.id,
	} ) )
);

const getDefaultActivity = ( field, type, plannedActivity ) => {
	const today = new Date();
	const formattedDate = getUiFormatDate( SERVER_DATE_FORMAT, today );

	return {
		local_id: nanoid(),
		date: formattedDate,
		crop_year: plannedActivity
			? plannedActivity.crop_year
			: cropPlanCurrentYear,
		field_local_id: field.local_id,
		type,
		notes: plannedActivity
			? plannedActivity.notes
			: '',
		field_id: field.id,
	};
};

export const getNewSprayingChemical = state => ( {
	local_id: nanoid(),
	chemical: '',
	rate: '',
	total: '',
	type: '',
	rate_unit: getChemicalRateUnitOptions( state )[ 0 ].value,
	group: '',
	product_cost: '',
	product_cost_unit: getCostUnitOptions( state )[ 0 ].value,
} );

export const getNewFertilizerProduct = state => ( {
	local_id: nanoid(),
	product_name: '',
	application_rate: '',
	application_rate_unit: getFertilizerProductApplicationRateUnitOptions( state )[ 0 ].value,
	total: '',
	fertilizer_type_id: '',
	nitrogen_content: '',
	phosphorus_content: '',
	potassium_content: '',
	sulphur_content: '',
	product_cost: '',
	product_cost_unit: getCostUnitOptions( state )[ 0 ].value,
} );

const getCommodity = ( state, commodityId ) => {
	const selectedFarmCommodities = getCommoditiesForSelectedFarm( state );

	return findWhere( selectedFarmCommodities, { id: commodityId, } );
};

const getPlantingsForHarvest = ( state, harvest ) => {
	return getActivities( state )
	.filter( activity => {
		const isForSameField = activity.field_local_id === harvest.field_local_id;

		const isAPlanting = 'planting' === activity.type;

		return isAPlanting && isForSameField;
	} );
};

export const getPlantingIds = ( state, harvest ) => {
	return getPlantingsForHarvest( state, harvest )
	.reduce( ( plantingIds, plantingForSameField ) => {
		plantingIds[ plantingForSameField.local_id ] = plantingForSameField.id;

		return plantingIds;
	}, {} );
};

export const getPlantingOptions = ( state, harvest ) => {
	return [ {
		value: '',
		label: 'Please select',
	} ]
	.concat(
		getPlantingsForHarvest( state, harvest )
		.map( plantingForSameField => ( {
			value: plantingForSameField.local_id,
			label: getCommodity( state, plantingForSameField.commodity_id ).name + ( plantingForSameField.variety ? ' - ' + plantingForSameField.variety : '' ),
		} ) )
	);
};

export const getPermissionsOnSelectedFarm = state => {
	const selectedFarm = getSelectedFarm( state );

	return selectedFarm
		? findWhere( selectedFarm.roles, {
			user_id: state.AuthReducer.data.user_id,
		} )
		: null;
};
