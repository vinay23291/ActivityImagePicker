import { valueLabel, } from './planting';

export const getPesticideTypes = () => valueLabel( [
	'Select',
	'Fungicide',
	'Herbicide',
	'Insecticide',
	'Inoculants',
	'Adjuvant',
	'Other',
] );

export const getCropTiming = () => valueLabel( [
	'Please Select',
	'Pre-Seed',
	'In-Crop',
	'Pre-Harvest',
	'Post-Harvest',
	'Other',
] );
