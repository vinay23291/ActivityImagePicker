import React from 'react';
import { Image, Text, } from 'react-native';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from './icomoon/selection.json';

const allowedIcons = icoMoonConfig.icons.reduce(
	( allIconNames, icon ) => allIconNames.concat( icon.properties.name.split( ', ' ) ), [ 'more' ]
);
const IcoMoonSet = createIconSetFromIcoMoon( icoMoonConfig, 'fah-core', 'fah-core.ttf' );

const images = {
	application: require( './pngs/application.png' ),
	custom: require( './pngs/custom.png' ),
	harvest: require( './pngs/harvest.png' ),
	irrigation: require( './pngs/irrigation.png' ),
	observation: require( './pngs/observation.png' ),
	planting: require( './pngs/planting.png' ),
	spraying: require( './pngs/spraying.png' ),
	swathing: require( './pngs/swathing.png' ),
	tillage: require( './pngs/tillage.png' ),
};

export const ActivityIcon = ( { name, size=40 } ) => {
	return <Image
		resizeMode='contain'
		style={ { width: size, height: size } }
		source={ images[name] }
	/>;
};

export const NavIcon = ( { name } ) => <IcoMoonSet name={ name } size={ 40 } />;

export const Icon = ( { name, size=40, ...props } ) => {
	const iconName = name + ( allowedIcons.indexOf( name + '-small' ) > -1 && size < 30 ? '-small' : '' );

	return name in images ? (
		<ActivityIcon name={ name } size={ size } { ...props } />
	) : props.onPress
		? <IcoMoonSet.Button
			name={ iconName }
			size={ size }
			underlayColor='transparent'
			backgroundColor='transparent'
			style={ { margin: 0, padding: 0 } }
			iconStyle={ { marginRight: 8, padding: 0, justifyContent: 'flex-start' } }
			{ ...props }
		/>
		: <Text><IcoMoonSet name={ iconName } size={ size } { ...props } /></Text>;
};

export default Icon;
