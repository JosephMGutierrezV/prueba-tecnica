import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OffersModule } from './offers/offers.module';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes), OffersModule],
  exports: [RouterModule],
})
export class AppRoutingModule {}
