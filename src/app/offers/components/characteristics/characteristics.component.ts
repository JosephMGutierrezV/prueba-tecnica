import { Component, OnInit } from '@angular/core';
import { AppState } from '../../store/app.reducers';
import { Store } from '@ngrx/store';
import { Characteristic } from '../../interfaces/offers.interfaces';

@Component({
  selector: 'app-characteristics',
  templateUrl: './characteristics.component.html',
  styleUrls: ['./characteristics.component.css'],
})
export class CharacteristicsComponent implements OnInit {
  caracteristicas: Characteristic[] = [];
  constructor(private store: Store<AppState>) {
    this.store.select('oferta').subscribe(({ oferta }) => {
      if (oferta.versions.length != 0) {
        this.caracteristicas = oferta.versions[0].characteristics;
      }
    });
  }

  ngOnInit(): void {}
}
