import { createAction, props } from '@ngrx/store';
import { Offers } from '../../interfaces/offers.interfaces';

export const loadOffers = createAction('[OFFERS] Cargar ofertas');

export const loadOffersSuccess = createAction(
  '[OFFERS] Cargar ofertas Success',
  props<{ ofertas: Offers[] }>()
);

export const loadOffersError = createAction(
  '[OFFERS] Cargar ofertas Error',
  props<{ payload: any }>()
);
