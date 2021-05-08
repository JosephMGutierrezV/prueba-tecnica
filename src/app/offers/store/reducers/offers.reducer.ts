import { Action, createReducer, on } from '@ngrx/store';
import { loadOffers, loadOffersSuccess, loadOffersError } from '../actions';
import { Offers } from '../../interfaces/offers.interfaces';

export interface offersState {
  offer: Offers[];
  loaded: boolean;
  loading: boolean;
  error: any;
}

export const initialState: offersState = {
  offer: [],
  loaded: false,
  loading: false,
  error: null,
};

const _offersReducer = createReducer(
  initialState,
  on(loadOffers, (state) => ({ ...state, loading: true })),
  on(loadOffersSuccess, (state, { ofertas }) => ({
    ...state,
    loading: false,
    loaded: true,
    offer: [...state.offer, ...ofertas],
    error: null,
  })),
  on(loadOffersError, (state, { payload }) => ({
    ...state,
    loading: false,
    loaded: false,
    error: payload,
  }))
);

export function offersReducer(state: any, action: Action) {
  return _offersReducer(state, action);
}
