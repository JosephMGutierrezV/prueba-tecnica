import { ActionReducerMap } from '@ngrx/store';
import * as reducer from './reducers';

export interface AppState {
  ofertas: reducer.offersState;
  oferta: reducer.offersDetailState;
}

export const appReducers: ActionReducerMap<AppState> = {
  ofertas: reducer.offersReducer,
  oferta: reducer.offersDetailReducer,
};
