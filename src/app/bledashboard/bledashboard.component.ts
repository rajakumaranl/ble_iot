import { Component, OnInit } from '@angular/core';
import { BLEDasboardService } from './bledashboard.service';

@Component({
  selector: 'app-bledashboard',
  templateUrl: './bledashboard.component.html',
  styleUrls: ['./bledashboard.component.scss']
})
export class BLEDashboardComponent implements OnInit {

  allDevices: any[] = [];
  constructor(private bleDashboardService: BLEDasboardService) { }

  ngOnInit(): void {
    this.getAllAvailableDevices();
  }

  getAllAvailableDevices(){
      this.bleDashboardService.getDevices().subscribe((data: any[]) => {
          console.log("data : ",data);
          this.allDevices = data;
      }, error => {
          console.log('Error while fetching devices : ',error);
      }
      );
  }

  getDeviceStatus(device){
      if(device.status){
        return 'Online';
      } else {
        return 'Offline';
      }
  }
}
