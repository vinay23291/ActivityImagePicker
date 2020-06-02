export const isPlannedActivity = activity => 'planned_by' in activity;

const elementNames = [ 'nitrogen', 'phosphorus', 'potassium', 'sulphur', ];
export const npksString = item => elementNames.some( elementName => !! item[ `${ elementName }_content` ] )
	? `(${ elementNames.map( elementName => item[ `${ elementName }_content` ] || '0' ).join( '-' ) }) `
	: '';
