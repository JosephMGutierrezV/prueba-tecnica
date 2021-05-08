import { Action, createReducer, on } from '@ngrx/store';
import {
  loadOffersDetail,
  loadOffersDetailSuccess,
  loadOffersDetailError,
} from '../actions';
import { Offers } from '../../interfaces/offers.interfaces';

export interface offersDetailState {
  id: string;
  oferta: Offers;
  loaded: boolean;
  loading: boolean;
  error: any;
}

export const initialDetailState: offersDetailState = {
  id: '',
  oferta: { versions: [], id: '', href: '' },
  loaded: false,
  loading: false,
  error: null,
};

const _offersDetailReducer = createReducer(
  initialDetailState,
  on(loadOffersDetail, (state, { id }) => ({ ...state, loading: true, id })),
  on(loadOffersDetailSuccess, (state, { oferta }) => ({
    ...state,
    loading: false,
    loaded: true,
    oferta: { ...oferta },
    error: null,
  })),
  on(loadOffersDetailError, (state, { payload }) => ({
    ...state,
    loading: false,
    loaded: false,
    error: payload,
  }))
);

export function offersDetailReducer(state: any, action: Action) {
  return _offersDetailReducer(state, action);
}
