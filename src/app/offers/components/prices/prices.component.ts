import { Component, OnInit } from '@angular/core';
import { ProductOfferingPrice } from '../../interfaces/offers.interfaces';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.reducers';

@Component({
  selector: 'app-prices',
  templateUrl: './prices.component.html',
  styleUrls: ['./prices.component.css'],
})
export class PricesComponent implements OnInit {
  preciosProductos: ProductOfferingPrice[] = [];

  constructor(private store: Store<AppState>) {
    this.store.select('oferta').subscribe(({ oferta }) => {
      if (oferta.versions.length != 0) {
        this.preciosProductos = oferta.versions[0].productOfferingPrices!;
      }
    });
  }

  ngOnInit(): void {}
}
