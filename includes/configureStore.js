import rootSaga from '../sagas';
import * as reducers from '../reducers';
import { persistStore, persistReducer } from 'redux-persist';
import FilesystemStorage from 'redux-persist-filesystem-storage';
import saga from 'redux-saga';
import { createStore, applyMiddleware, combineReducers } from 'redux';

const reducer = persistReducer( 
	{
		key: 'root',
		storage: FilesystemStorage,
	},
	combineReducers( reducers )
);
const sagaMiddleware = saga();
const store = createStore( reducer, applyMiddleware( sagaMiddleware ) );
const persistor = persistStore( store );
sagaMiddleware.run( rootSaga );

export { store, persistor, };
