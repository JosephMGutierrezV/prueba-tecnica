import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as ofertasActions from '../actions';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { OffersService } from '../../services/offers.service';
import { of } from 'rxjs';

@Injectable()
export class OffersEffects {
  constructor(
    private actions$: Actions,
    private offertasService: OffersService
  ) {}

  cargarOfertas$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ofertasActions.loadOffers),
      mergeMap(() =>
        this.offertasService.getJSON().pipe(
          map((data) => ofertasActions.loadOffersSuccess({ ofertas: data })),
          catchError((err) =>
            of(ofertasActions.loadOffersError({ payload: err }))
          )
        )
      )
    )
  );
}
