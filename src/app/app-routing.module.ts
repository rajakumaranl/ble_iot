import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BLEDashboardComponent } from './bledashboard/bledashboard.component';

const routes: Routes = [
                          {
                            path: 'view-devices',
                            component: BLEDashboardComponent,
                            data: {
                                title: 'View Devices in office'
                            }
                          },  
                        ];
  
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
