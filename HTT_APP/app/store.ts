import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';

import RootReducer from './redux/rootReducer'
import Reactotron from '../ReactotronConfig'

const reduxEnhancer = Reactotron.createEnhancer!()

export const store = configureStore({
  reducer: RootReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware(),
  enhancers: [reduxEnhancer],
})

// export default configureStore({
//   reducer: RootReducer,
//   middleware: getDefaultMiddleware => getDefaultMiddleware(),
//   enhancers: [reduxEnhancer],
// })
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export type RootState = ReturnType<typeof store.getState>;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;