import { Component, OnInit } from '@angular/core';

import { FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Offers } from '../../interfaces/offers.interfaces';
import { AppState } from '../../store/app.reducers';
import { loadOffers } from '../../store/actions/offers.actions';
import { loadOffersDetail } from '../../store/actions/offers-details.actions';

@Component({
  selector: 'app-offer',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.css'],
})
export class OfferComponent implements OnInit {
  offersControl = new FormControl('', Validators.required);
  selectFormControl = new FormControl('', Validators.required);

  offers: Offers[] = [];

  selected: String = '';

  id: String = '';

  nombre: String = '';

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.store.dispatch(loadOffers());
    this.store.select('ofertas').subscribe(({ offer }) => {
      this.offers = offer;
    });
  }

  select({ id }: any) {
    if (id != '' && id != null && id != undefined) {
      console.log(id);
      this.store.dispatch(loadOffersDetail({ id }));
      this.store.select('oferta').subscribe(({ oferta }) => {
        if (oferta.versions.length != 0) {
          this.id = oferta.versions[0].id;
          this.nombre = oferta.versions[0].name;
        }
      });
    }
  }
}
