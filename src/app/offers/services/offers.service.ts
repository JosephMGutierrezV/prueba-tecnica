import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class OffersService {
  constructor(private http: HttpClient) {
    this.getJSON().subscribe((data) => {
      console.log(data);
    });
  }

  public getJSON(): Observable<any> {
    return this.http.get('./assets/ofertas.json');
  }

  public getDetails(): Observable<any> {
    return this.http
      .get('./assets/ofertas.json')
      .pipe(switchMap((data: any) => from(data)));
  }
}
