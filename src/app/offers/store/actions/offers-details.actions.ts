import { createAction, props } from '@ngrx/store';
import { Offers } from '../../interfaces/offers.interfaces';

export const loadOffersDetail = createAction(
  '[OFFERSDETAIL] Cargar detalle ofertas',
  props<{ id: string }>()
);

export const loadOffersDetailSuccess = createAction(
  '[OFFERSDETAIL] Cargar ofertas detalle Success',
  props<{ oferta: Offers }>()
);

export const loadOffersDetailError = createAction(
  '[OFFERSDETAIL] Cargar ofertas detalle Error',
  props<{ payload: any }>()
);
