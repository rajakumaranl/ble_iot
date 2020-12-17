import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BLEDashboardComponent } from './bledashboard/bledashboard.component';
import { ViewMapComponent } from './view-map/view-map.component';

const routes: Routes = [
                          {
                            path: '',
                            component: BLEDashboardComponent,
                            data: {
                                title: 'View Devices in office'
                            }
                          }, 
                          {
                            path: 'view-devices',
                            component: BLEDashboardComponent,
                            data: {
                                title: 'View Devices in office'
                            }
                          }, 
                          {
                            path: 'view-map',
                            component: ViewMapComponent,
                            data: {
                                title: 'View Map in office'
                            }
                          },  
                        ];
  
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
