import { combineReducers, configureStore } from '@reduxjs/toolkit'
import  useReducer  from './User/userSlice.js'; //userSlice.reducer going to be used as useReducer.
import storage from 'redux-persist/lib/storage';
import {persistReducer, persistStore} from 'redux-persist';
// redux-persist is used to store the user data in localstorage.

const rootReducer = combineReducers({user:useReducer})

const persistConfig = {
  key : 'root',     //root is the key in the local storage
  storage,
  version: 1,
}

const persistedReducer = persistReducer(persistConfig,rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware : (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck:false,
  }),
});

export const persistor = persistStore(store);