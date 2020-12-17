import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BLEDasboardService } from './bledashboard.service';

@Component({
  selector: 'app-bledashboard',
  templateUrl: './bledashboard.component.html',
  styleUrls: ['./bledashboard.component.scss']
})
export class BLEDashboardComponent implements OnInit {

  allDevices: any[] = [];
  editForm: FormGroup;
  showAddDevice: boolean;
  constructor(private bleDashboardService: BLEDasboardService,
              private formBuilder: FormBuilder, 
              private router: Router, 
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getAllAvailableDevices();
    this.editForm = this.formBuilder.group({
      device_name: ['', Validators.required],
      uuid: ['', Validators.required],
      location: ['', Validators.required],
      device_address: ['', Validators.required],
      xcoordinate: ['', Validators.required],
      ycoordinate: ['', Validators.required],
    });
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

  gotoUserStatus(){
    this.router.navigate(['/view-map']);
  }

  onSubmit(){
    // let device = this.editForm.value();
    console.log("Device to add : ",this.editForm.value);
    this.showAddDevice = false;
    let device: Device = new Device();
    device.device_name = "";
    device.device_uuid = "";
    device.device_location="";
    device.description="";
    this.bleDashboardService.addDevice(this.editForm.value).subscribe(
      (data: any) => {
        console.log("response for adding device : ",data);
      });
  }

  addDevices(){
    this.showAddDevice = true;
  }
}

export class Device {
  device_name: string;
  device_uuid: string;
  device_location: string;
  description:string;
}
