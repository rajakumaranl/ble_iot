import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
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
  displayedColumns = ['device_name', 'uuid', 'mac', 'location', 'status', 'action'];
  dataSource : MatTableDataSource<any> = new MatTableDataSource();
  hasData: boolean;
  constructor(private bleDashboardService: BLEDasboardService,
              private formBuilder: FormBuilder, 
              private router: Router, 
              private route: ActivatedRoute,
              public dialog: MatDialog) { }

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

  editDevice(element, i){
    console.log("Element : ",element);
    this.showAddDevice = true;
    const dialogRef = this.dialog.open(AddDeviceDialog, {
      width: '250px',
      data: element
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed : ',result);
      //  = result;
    });
  }

  getAllAvailableDevices(){
      this.bleDashboardService.getDevices().subscribe((data: any[]) => {
          console.log("data : ",data);
          this.allDevices = data;
          this.dataSource = new MatTableDataSource(data);
          this.hasData = data.length > 0;
      }, error => {
          console.log('Error while fetching devices : ',error);
      }
      );
  }

  getDeviceStatus(device){
      if(device){
        return 'Offline'
      }
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
    this.bleDashboardService.addDevice(this.editForm.value).subscribe(
      (data: any) => {
        console.log("response for adding device : ",data);
      });
  }

  addDevices(){
    this.showAddDevice = true;
    const dialogRef = this.dialog.open(AddDeviceDialog, {
      width: '250px',
      data: new Device()
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed : ',result);
      //  = result;
    });
  }
}

@Component({
  selector: 'add-device-dialog',
  templateUrl: 'add-device-dialog.html',
})
export class AddDeviceDialog {

  editForm: FormGroup;
  isEdit: boolean = false;
  constructor(private bleDashboardService: BLEDasboardService,
    public dialogRef: MatDialogRef<AddDeviceDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder, 
    private router: Router, 
    private route: ActivatedRoute) {}

  ngOnInit(){
    console.log("Device : ",this.data);
    let editDevice = this.data;
    if(editDevice.device_UUID){
      this.isEdit = true;
    } else {
      this.isEdit = false;
    }
    this.editForm = this.formBuilder.group({
      device_name: [editDevice.device_name, Validators.required],
      uuid: [editDevice.device_UUID, Validators.required],
      location: [editDevice.location, Validators.required],
      device_address: [editDevice.device_Address, Validators.required],
      xcoordinate: [editDevice.xcoordinate, Validators.required],
      ycoordinate: [editDevice.ycoordinate, Validators.required],
    });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  onSubmit(){
    // let device = this.editForm.value();
    console.log("Device to add : ",this.editForm.value);
    let deviceData = this.editForm.value;
    if(deviceData.uuid == ''){
      return;
    }
    if(this.isEdit){
      this.bleDashboardService.updateDevice(this.editForm.value).subscribe(
        (data: any) => {
          console.log("response for adding device : ",data);
          this.dialogRef.close();
        });
        this.closeDialog();
    }
     else {
        this.bleDashboardService.addDevice(this.editForm.value).subscribe(
          (data: any) => {
            console.log("response for adding device : ",data);
            this.dialogRef.close();
          });
          this.closeDialog();
      }
    }
    

}

export class Device {
    device_name: string;
    uuid: string;
    location: string;
    device_address: string;
    xcoordinate: string;
    ycoordinate: string;
}
