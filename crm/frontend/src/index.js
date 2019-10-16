import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { persistStore, persistReducer } from "redux-persist";
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { PersistGate } from 'redux-persist/integration/react'
import rootReducer from './reducers'
import App from './components'
import './index.css'
import moment from "moment";
moment.tz.setDefault("Asia/Calcutta");
const persistConfig = {
    key: 'root',
    storage: storage,
    whitelist: ['auth', 'myProfile']
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(persistedReducer, applyMiddleware(thunk, logger));
export const persistor = persistStore(store);

//render  app
ReactDOM.render(
    <Provider store={store}>
        <PersistGate persistor={persistor}>
            <App />
        </PersistGate>
    </Provider>,
    document.getElementById('root')
);  