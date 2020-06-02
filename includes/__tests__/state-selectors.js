import {
	getChemicalRateUnitOptions,
	getCostUnitOptions,
	getNewSprayingChemical,
	getNewFertilizerProduct,
	getSprayingWaterRateUnitOptions,
	getFertilizerProductApplicationRateUnitOptions,
	getSeedRateUnitOptions,
	getYieldUnitOptions,
	getNewField,
	getCommodityOptions,
	getFieldOptions,
	getSelectedFarm,
	getFieldFromState,
	getActivityFromState,
} from '../state-selectors';
import { valueLabel } from '../planting';

describe( 'getActivityFromState( state, local_id )', function() {
	const activity = getActivityFromState(
		{
			ActivitiesReducer: {
				activityData: [ {
					local_id: 'anid',
					type: 'spraying',
				}, {
					local_id: 'otherid',
					type: 'planting',
				} ],
			},
		},
		'anid'
	);

	it( 'should return the field with requested local_id', function() {
		expect( activity.type ).toEqual( 'spraying' );
	} );
} );

describe( 'getFieldFromState( state, local_id )', function() {
	const field = getFieldFromState(
		{
			FieldsReducer: {
				fieldsData: [ {
					local_id: 'anid',
					name: 'Requested Field',
				}, {
					local_id: 'otherid',
					name: 'Other Field',
				} ],
			},
		},
		'anid'
	);

	it( 'should return the field with requested local_id', function() {
		expect( field.name ).toEqual( 'Requested Field' );
	} );
} );

describe( 'getSelectedFarm( state )', function() {
	const selectedFarm = getSelectedFarm( {
		FieldsReducer: {
			selectedFarmId: 'anid',
			farmsData: [ {
				id: 'anid',
				name: 'Selected Farm',
			}, {
				id: 'otherid',
				name: 'Not Selected Farm',
			} ],
		},
	} );

	it( 'should return the currently selected farm', function() {
		expect( selectedFarm.name ).toEqual( 'Selected Farm' );
	} );
} );

const getStateWithSelectedFarm = farmData => ( {
	FieldsReducer: {
		selectedFarmId: 2,
		farmsData: [ {
			id: 2,
			...farmData,
		} ],
	},
} );

describe( 'getYieldUnitOptions( state )', () => {
	const yieldUnitOptions = getYieldUnitOptions( getStateWithSelectedFarm( {
		land_area_unit: 'ha',
	} ) );

	it( 'should return unit options ending with farm land area unit', () => {
		expect(
			yieldUnitOptions
		).toEqual( expect.arrayContaining( valueLabel( [
			'bu/ha',
			'lb/ha',
			'mt/ha',
		] ) ) );
	} );
} );

describe( 'getSeedRateUnitOptions( state )', () => {
	const seedRateUnitOptions = getSeedRateUnitOptions( getStateWithSelectedFarm( {
		land_area_unit: 'ha',
	} ) );

	it( 'should return unit options ending with farm land area unit', () => {
		expect(
			seedRateUnitOptions
		).toEqual( expect.arrayContaining( valueLabel( [
			'lb/ha',
			'kg/ha',
			'bags/ha',
			'1,000 seeds/ha',
			'10,000 seeds/ha',
		] ) ) );
	} );

} );

describe( 'getFertilizerProductApplicationRateUnitOptions( state )', () => {
	const fertilizerProductApplicationRateUnitOptions = getFertilizerProductApplicationRateUnitOptions( getStateWithSelectedFarm( {
		land_area_unit: 'ha',
	} ) );

	it( 'should return unit options ending with farm land area unit', () => {
		expect(
			fertilizerProductApplicationRateUnitOptions
		).toEqual( expect.arrayContaining( valueLabel( [
			'lb/ha',
			'kg/ha',
			'mt/ha',
			'l/ha',
			'gal/ha',
			'us ton/ha',
		] ) ) );
	} );

} );

describe( 'getSprayingWaterRateUnitOptions( state )', () => {
	const sprayingWaterRateUnitOptions = getSprayingWaterRateUnitOptions( getStateWithSelectedFarm( {
		land_area_unit: 'ha',
	} ) );

	it( 'should return unit options ending with farm land area unit', () => {
		expect(
			sprayingWaterRateUnitOptions
		).toEqual( expect.arrayContaining( valueLabel( [
			'gal/ha',
			'l/ha',
			'g/ha',
			'ml/ha',
			'lb/ha',
		] ) ) );
	} );

} );

describe( 'getChemicalRateUnitOptions( state )', () => {
	const stateWithHectareFarm = getStateWithSelectedFarm( { land_area_unit: 'ha', } );
	const chemicalRateUnitOptions = getChemicalRateUnitOptions( stateWithHectareFarm );

	it( 'should return unit options ending with farm land area unit', () => {
		expect(
			chemicalRateUnitOptions
		).toEqual( expect.arrayContaining( valueLabel( [
			'l/ha',
			'gal/ha',
			'ml/ha',
			'lb/ha',
			'oz/ha',
			'floz/ha',
			'qt/ha',
			'kg/ha',
		] ) ) );
	} );

	it( 'should include the two "flipped" units that start with the land area unit', () => {
		expect(
			chemicalRateUnitOptions
		).toEqual( expect.arrayContaining( [
			{ label: 'ha/case', value: 'ha/case', },
			{ label: 'ha/jug', value: 'ha/jug', },
		] ) );
	} );
} );

describe( 'getCostUnitOptions( state )', () => {
	const returnedOptions = getCostUnitOptions( getStateWithSelectedFarm( {
		currency: 'AUD',
		land_area_unit: 'ha',
	} ) );

	it( 'should return 2 options', () => {
		expect( returnedOptions.length ).toEqual( 2 );
	} );

	describe( 'first returned option', () => {
		it( 'should be based on the currency and land area unit of the farm', () => {
			expect( returnedOptions[ 0 ] ).toEqual( { label: 'AUD/ha', value: 'AUD/ha', } );
		} );
	} );

	describe( 'second returned option', () => {
		it( 'should be "total"', () => {
			expect( returnedOptions[ 1 ] ).toEqual( { label: 'total', value: 'total', } );
		} );
	} );
} );

describe( 'record returned by getNewSprayingChemical( state )', () => {
	const record = getNewSprayingChemical( getStateWithSelectedFarm( {
		currency: 'AUD',
		land_area_unit: 'ha',
	} ) );

	it( 'should have a local_id', () => {
		expect( record.local_id.length > 0 ).toBe( true );
	} );

	it( 'should have rate_unit set to "l" / land area unit', () => {
		expect( record.rate_unit ).toEqual( 'l/ha' );
	} );

	it( 'should have product_cost_unit set to farm currency / land area unit', () => {
		expect( record.product_cost_unit ).toEqual( 'AUD/ha' );
	} );

	it( 'should have a bunch of empty other fields', () => {
		[
			'chemical',
			'rate',
			'total',
			'type',
			'group',
			'product_cost',
		].forEach( fieldName => {
			expect( record[ fieldName ] ).toEqual( '' );
		} );
	} );
} );

describe( 'record returned by getNewFertilizerProduct( state )', () => {
	const record = getNewFertilizerProduct( getStateWithSelectedFarm( {
		currency: 'AUD',
		land_area_unit: 'ha',
	} ) );

	it( 'should have a local_id', () => {
		expect( record.local_id.length > 0 ).toBe( true );
	} );

	it( 'should have rate_unit set to "lb" / land area unit', () => {
		expect( record.application_rate_unit ).toEqual( 'lb/ha' );
	} );

	it( 'should have product_cost_unit set to farm currency / land area unit', () => {
		expect( record.product_cost_unit ).toEqual( 'AUD/ha' );
	} );

	it( 'should have a bunch of empty other fields', () => {
		[
			'product_name',
			'application_rate',
			'total',
			'fertilizer_type_id',
			'nitrogen_content',
			'phosphorus_content',
			'potassium_content',
			'sulphur_content',
			'product_cost',
		].forEach( fieldName => {
			expect( record[ fieldName ] ).toEqual( '' );
		} );
	} );
} );

describe( 'set returned by getFieldOptions( state )', () => {
	const fieldOptions = getFieldOptions( {
		FieldsReducer: {
			fieldsData: [ {
				name: 'Field B',
				local_id: 'field-b-local-id',
			}, {
				name: 'Field A',
				local_id: 'field-a-local-id',
			} ],
		},
	} );

	it.skip( 'should only include fields for the currently selected farm', () => {
	} );

	it.skip( 'should not include deleted fields', () => {
	} );

	it( 'should use field name for the label', function() {
		expect( fieldOptions[ 0 ].label ).toEqual( 'Field A' );
	} );

	it( 'should use the local_id for the value', function() {
		expect( fieldOptions[ 0 ].value ).toEqual( 'field-a-local-id' );
	} );

	it( 'should be sorted alphabetically', () => {
		expect( fieldOptions[ 0 ].label ).toEqual( 'Field A' );

		expect( fieldOptions[ 1 ].label ).toEqual( 'Field B' );
	} );
} );

describe( 'set returned by getCommodityOptions( state )', () => {
	const commodityOptions = getCommodityOptions( getStateWithSelectedFarm( {
		commodities: [ {
			id: 'bid',
			name: 'B, Commodity',
			should_be_shown: true,
		}, {
			id: 'excludeid',
			name: 'Excluded, Commodity',
			should_be_shown: false,
		}, {
			id: 'aid',
			name: 'A, Commodity',
			should_be_shown: true,
		} ],
	} ) );

	it( 'should contain a blank option', () => {
		expect( commodityOptions ).toContainEqual( {
			value: '',
			label: 'Please select',
		} );
	} );

	it( 'should exclude commodities set to not show by the user', () => {
		expect( commodityOptions ).not.toContainEqual( {
			value: 'excludeid',
			label: 'Excluded, Commodity',
		} );
	} );

	it( 'should be sorted alphabetically', () => {
		expect( commodityOptions[ 1 ] ).toEqual( {
			value: 'aid',
			label: 'A, Commodity',
		} );

		expect( commodityOptions[ 2 ] ).toEqual( {
			value: 'bid',
			label: 'B, Commodity',
		} );
	} );
} );

describe( 'record returned by getNewField( state )', () => {
	const record = getNewField( {
		FieldsReducer: {
			selectedFarmId: 'someid',
			farmsData: [ {
				id: 'someid',
				land_area_unit: 'ha',
			} ],
		},
	} );

	it( 'should have a local_id', () => {
		expect( record.local_id.length > 0 ).toBe( true );
	} );

	it( 'should have farm_id set to farm id', () => {
		expect( record.farm_id ).toEqual( 'someid' );
	} );

	it( 'should have area_unit set farm land area unit', () => {
		expect( record.area_unit ).toEqual( 'ha' );
	} );

	it( 'should have a bunch of empty other fields', () => {
		[
			'name',
			'location',
			'area',
			'ownership',
			'cropshare_percentage',
		].forEach( fieldName => {
			expect( record[ fieldName ] ).toEqual( '' );
		} );
	} );
} );
