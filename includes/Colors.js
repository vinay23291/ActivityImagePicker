import bc from 'baseconvert';

class Color {
	constructor( red, green, blue, alpha=1 ) {
		this.red = red;
		this.green = green;
		this.blue = blue;
		this.alpha = alpha;
	}

	makeAlphaVariant( alpha ) {
		return new Color( this.red, this.green, this.blue, alpha );
	}

	getHexString() {
		return `#${ bc.dec2hex( this.red ) }${ bc.dec2hex( this.green ) }${ bc.dec2hex( this.blue, ) }`;
	}

	toString() {
		return `rgba(${ this.red }, ${ this.green }, ${ this.blue }, ${ this.alpha })`;
	}
}

export const radRed = new Color( 247, 84, 69 );
export const fahRed = radRed;

export const uiRed = new Color( 227, 62, 54 );

export const srsRed = new Color( 213, 41, 25 );

export const drawerBrown = new Color( 103, 96, 94 );

const _darkOlive = new Color( 26, 46, 53 );
const _lightOlive = _darkOlive.makeAlphaVariant( 0.4 );
const _lighterOlive = _darkOlive.makeAlphaVariant( 0.3 );
const _dodgerBlue = new Color( 41, 111, 218 );
const _white = new Color( 255, 255, 255 );
const greyMix3 = _darkOlive.makeAlphaVariant( 0.15 );
const greyMix4 = _darkOlive.makeAlphaVariant( 0.05 );
const greyMix5 = _darkOlive.makeAlphaVariant( 0.03 );

// Name colors by function
export const brandColor = String( radRed );
export const text = String( _darkOlive );
export const textSecondary = String( _lightOlive );
export const textBright = String( radRed );

export const borderBright = String( srsRed );
export const borderSecondary = String( _lighterOlive );
export const borderLight = String( greyMix3 );
export const border = '#1a2e35';

export const action = String( _dodgerBlue );
export const activecolor = action;
export const inactivecolor = text;
export const backgroundSecondary = String( greyMix4 );
export const backgroundWhite = 'rgba(255,255,255,0.96)';
export const backgroundDropdown = String( greyMix5 );


export const paperColor = String( _white );
export const warning = String( srsRed );
export const statusBarColor = '#aa000e';
export const dropDownColor = 'rgb(57,113,211)';
export const mapThumbnailColor = '#1e1ed9';
