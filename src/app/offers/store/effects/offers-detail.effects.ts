import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as ofertasActions from '../actions';
import { mergeMap, map, catchError, filter } from 'rxjs/operators';
import { OffersService } from '../../services/offers.service';
import { of } from 'rxjs';

@Injectable()
export class OffersEffectsDetails {
  constructor(
    private actions$: Actions,
    private offertasService: OffersService
  ) {}

  cargarOfertasDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ofertasActions.loadOffersDetail),
      mergeMap((action) =>
        this.offertasService.getDetails().pipe(
          filter((ofertas) => ofertas.id == action.id),
          map((oferta) => ofertasActions.loadOffersDetailSuccess({ oferta })),
          catchError((err) =>
            of(ofertasActions.loadOffersError({ payload: err }))
          )
        )
      )
    )
  );
}
