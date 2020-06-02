import { useEffect, useRef, } from 'react';
import capitalize from 'underscore.string/capitalize';
import { showAlert, isEmpty, } from './Utility';

export const goBackAfterSaving = (
	recordType, isFetching, success,
	goBack, failure, error, updateType,
) => {
	const initialRender = useRef( true );

	useEffect( () => {
		if ( initialRender.current ) {
			// this is needed because otherwise the form closes immediately upon opening.
			// This effectively makes the effect not run upon initial render but only on subsequent prop changes
			initialRender.current = false;
			return;
		}

		if ( ! isFetching && ( success || failure ) ) {
			if ( success ) {
				goBack();
			} else if ( failure ) {
				showAlert(
					capitalize( updateType ) + ' Error',
					! isEmpty( error ) && ! isEmpty( error.message )
						? error.message
						: `Unable to ${ updateType } this ${ recordType } now please try again after some time.`,
					[ {
						title: 'ok',
						onPress: () => {},
					}, ]
				);
			}
		}
	}, [ isFetching ] );
};
