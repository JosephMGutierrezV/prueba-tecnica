import { Component, OnInit } from '@angular/core';
import { AppState } from '../../store/app.reducers';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-principal-page',
  templateUrl: './principal-page.component.html',
  styleUrls: ['./principal-page.component.css'],
})
export class PrincipalPageComponent implements OnInit {
  state: boolean = false;
  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.store.select('oferta').subscribe(({ oferta }) => {
      if (oferta.versions.length != 0) {
        this.state = true;
      }
    });
  }
}
