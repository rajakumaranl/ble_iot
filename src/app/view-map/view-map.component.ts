import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { ViewMapService } from './view-map.service';

@Component({
  selector: 'app-view-map',
  templateUrl: './view-map.component.html',
  styleUrls: ['./view-map.component.scss']
})
export class ViewMapComponent implements OnInit {

  @ViewChild("canvas") canvas;

  /** Template reference to the canvas element */
  @ViewChild('myCanvas') myCanvas: ElementRef;
  @ViewChild('manCanvas') manCanvas: ElementRef;
  
  /** Template reference to the canvas element */
  @ViewChild('manimg') man_img: ElementRef
  
  /** Canvas 2d context */
  private context: CanvasRenderingContext2D;
  
    /** Canvas 2d context */
  private context1: CanvasRenderingContext2D;
  
      /** Canvas 2d context */
  private context2: CanvasRenderingContext2D;
  
  /** Canvas 2d context */
  private context3: CanvasRenderingContext2D;

  /** Canvas 2d context */
  private context4: CanvasRenderingContext2D;

  /** Canvas 2d context */
  private context5: CanvasRenderingContext2D;

  /** Canvas 2d context */
  private manContext: CanvasRenderingContext2D;
  
  @Input() public width = 5;
  @Input() public height = 5;
  x: number = 0;
  y: number = 0;
  textX: number = 0;
  textY: number = 0;

  renderer: any;
  img1 = new Image();
  updateSubscription: Subscription;
  history: any[] = [];
  hasData:boolean = true;
	mac_address: any;
  constructor(private viewmapService : ViewMapService,
    private router: Router, 
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.mac_address = JSON.parse(sessionStorage.getItem('device'));
  }

  ngAfterViewInit() {

    this.context = (this.myCanvas.nativeElement as HTMLCanvasElement).getContext('2d');
    this.context1=  (this.myCanvas.nativeElement as HTMLCanvasElement).getContext('2d');
    this.context2 =  (this.myCanvas.nativeElement as HTMLCanvasElement).getContext('2d');
    this.context3 =  (this.myCanvas.nativeElement as HTMLCanvasElement).getContext('2d');
    this.context4 =  (this.myCanvas.nativeElement as HTMLCanvasElement).getContext('2d');
    this.context5 =  (this.myCanvas.nativeElement as HTMLCanvasElement).getContext('2d');
    this.manContext = (this.manCanvas.nativeElement as HTMLCanvasElement).getContext('2d');
    this.drawBuildingMap();
      // TODO: fetch the details auto refresh
	this.checkUserPosition();
	this.getLocationHistory();
    this.startAutoReferesh();
  }

  startAutoReferesh() {
      this.updateSubscription = interval(30000).subscribe(val => {
		this.checkUserPosition();
		this.getLocationHistory();
      });
  }

  checkLength(){
	  console.log("history length : ",this.history.length> 0);
	  if(this.history.length > 0){
		  return true;
	  }
	  return false;
  }
  // /**
  //  * Draws something using the context we obtained earlier on
  //  */
  // private draw() {
  //   this.context.font = "30px Arial";
  //   this.context.textBaseline = 'middle';
  //   this.context.textAlign = 'center';

  //   const x = (this.canvasEl.nativeElement as HTMLCanvasElement).width / 2;
  //   const y = (this.canvasEl.nativeElement as HTMLCanvasElement).height / 2;
  //   this.context.fillText("@realappie", x, y);
  // }

  ngOnDestroy() {
    this.updateSubscription.unsubscribe();
  }
  
checkUserPosition() {
		
	var x = 30;
    var y = 20;

    // this.context.fillText("@realappie", x, y);

		this.viewmapService.getPosition(this.mac_address).subscribe(
      (data) => {
				// responseJson.forEach(position, (key, value) {
          console.log("DATA ",data[0]);
          if(data.length == 0){
            return;
          }
          let position = data[0];
					x = position.xcoordinate;
					y = position.ycoordinate;
        // });
        console.log("inside fn X = "+x+" Y = "+y)
        this.positionUser(x, y);
        // this.drawBuildingMap();
			}	
		);
		
  }

  getLocationHistory(){
	  console.log("getting locaiton history");
	this.viewmapService.getHistory(this.mac_address).subscribe(
		(data) => {
			this.history = data;
			if(data.length > 0){
				this.hasData =true;
			}
		  	console.log("History : ", data);
		}	
	);
  }
  
  goBack(){
    this.router.navigate(['/view-devices']);
  }
	
	positionUser(x, y) {

      this.img1.onload = ()=> {
		// this.manContext.clearRect(this.x, this.y, 30,48);
		this.manContext.clearRect(0,0, 1000, 600);
        this.x = x;
        this.y = y;
		this.manContext.drawImage(this.img1, x, y, 30, 48);
		this.textX = x+25;
		let rect = y+15;
		this.textY = y+15;
		this.manContext.fillStyle = "#FF0000";
		this.manContext.font = "16px Arial";
		this.manContext.fillText("Hey, I'm Here", this.textX, this.textY, 70);
      }
      this.img1.src = '../assets/images/man.png';
  }

  drawBuildingMap(){
		// var canvas = document.getElementById('myCanvas');
		// var context0 = canvas.getContext('2d');
    this.context.font = "16px Arial";
    this.context.textBaseline = 'middle';
    this.context.textAlign = 'center';

	this.context.beginPath();
	this.context.moveTo(50,50);//Starting point of the diagram
	this.context.lineTo(50,500);//top to bottom
	this.context.lineTo(900,500);//bottom-left to bottom-right side
	this.context.lineTo(900,50);//bottom-right to top-right side
	this.context.lineTo(50,50);
	this.context.fillStyle = '#FFFFFF'; // I'd like to set with CSS
	this.context.fill();
	this.context.lineWidth = 1; // I'd like to set with CSS
	this.context.strokeStyle = '#003300'; // I'd like to set with CSS
	this.context.stroke();
	this.context.strokeText("", 200, 150);

	this.context.beginPath();
    this.context.moveTo(50,50);//Starting point of the diagram
	this.context.lineTo(50,500);//top to bottom
	this.context.lineTo(900,500);//bottom-left to bottom-right side
	this.context.lineTo(900,450);//bottom-right to top-right side

	this.context.moveTo(900,400);
	this.context.lineTo(900,50);
	this.context.lineTo(50,50);
		
	this.context.moveTo(930,400);
	this.context.lineTo(900,400);

	this.context.moveTo(900,450);
	this.context.lineTo(900,450);
	
	this.context.moveTo(900,450);
	this.context.lineTo(900,450);
	this.context.lineWidth = 5; // I'd like to set with CSS
	this.context.strokeStyle = '#2f3030'; // I'd like to set with CSS
	this.context.stroke();

	// var canvas1 = document.getElementById('myCanvas');
	// var context1 = canvas.getContext('2d');
	this.context1.beginPath();	
	this.context1.lineWidth = 3; // I'd like to set with CSS
	this.context1.strokeStyle = '#2f3030'; // I'd like to set with CSS

	this.context1.moveTo(50,250);
	this.context1.lineTo(150,250);//bottom-left to bottom-right side	  

	this.context1.moveTo(900,300);
	this.context1.lineTo(800,300);

	this.context1.moveTo(200,250);
	this.context1.lineTo(200,200);

	this.context1.moveTo(200,250);
	this.context1.lineTo(300,250);

	this.context1.moveTo(350,250);
	this.context1.lineTo(550,250);

	this.context1.moveTo(600,250);
	this.context1.lineTo(700,250);

	this.context1.moveTo(200,50)
	this.context1.lineTo(200,250);//bottom-right to top-right side

	this.context1.moveTo(400,50)
	this.context1.lineTo(400,250);//bottom-right to top-right side

	this.context1.moveTo(600,50)
	this.context1.lineTo(600,250);//bottom-right to top-right side

	this.context1.moveTo(750,50)
	this.context1.lineTo(750,250);

	this.context1.moveTo(50,300);
	this.context1.lineTo(150,300);

	this.context1.moveTo(200,300);
	this.context1.lineTo(300,300);

	this.context1.moveTo(350,300);
	this.context1.lineTo(550,300);	  

	this.context1.moveTo(200,300)
	this.context1.lineTo(200,500);//bottom-right to top-right side
	this.context1.moveTo(400,300)
	this.context1.lineTo(400,500);//bottom-right to top-right side
	this.context1.moveTo(600,300)
	this.context1.lineTo(600,500);//bottom-right to top-right side
	this.context1.moveTo(650,300);
	this.context1.lineTo(701,300);
	this.context1.stroke();
	
	// var context2 = canvas.getContext("2d");
	this.context2.beginPath();
	
	this.context2.moveTo(700,300);
	this.context2.lineTo(750,350);

	this.context2.moveTo(750,350);
	this.context2.lineTo(750,500);
	this.context2.lineWidth = 3; // I'd like to set with CSS
	this.context2.strokeStyle = '#2e3300'; // I'd like to set with CSS
	this.context2.stroke();
	
	var canvas = document.getElementById("myCanvas")

	//***************************Cafeteria start*********************
	
	var ctx = (this.myCanvas.nativeElement as HTMLCanvasElement).getContext('2d');
	ctx.beginPath();
	ctx.lineWidth = 2; // I'd like to set with CSS
	ctx.strokeStyle = '#47363e'; // I'd like to set with CSS
	ctx.stroke();
	ctx.arc(800,90,15,0,2*Math.PI);
	ctx.stroke();
	
	
	var ctx = (this.myCanvas.nativeElement as HTMLCanvasElement).getContext('2d');
	ctx.beginPath();
	ctx.lineWidth = 2; // I'd like to set with CSS
	ctx.strokeStyle = '#47363e'; // I'd like to set with CSS
	ctx.stroke();
	ctx.arc(800,130,15,0,2*Math.PI);
	ctx.stroke();
	
	
    var ctx =  (this.myCanvas.nativeElement as HTMLCanvasElement).getContext('2d');
	ctx.beginPath();
	ctx.lineWidth = 2; // I'd like to set with CSS
	ctx.strokeStyle = '#47363e'; // I'd like to set with CSS
	ctx.stroke();
	ctx.arc(800,170,15,0,2*Math.PI);
	ctx.stroke();
	
	
	var ctx = (this.myCanvas.nativeElement as HTMLCanvasElement).getContext('2d');
	ctx.beginPath();
	ctx.lineWidth = 2; // I'd like to set with CSS
	ctx.strokeStyle = '#47363e'; // I'd like to set with CSS
	ctx.stroke();
	ctx.arc(850,90,15,0,2*Math.PI);
	ctx.stroke();
	
	
	var ctx = (this.myCanvas.nativeElement as HTMLCanvasElement).getContext('2d');
	ctx.beginPath();
	ctx.lineWidth = 2; // I'd like to set with CSS
	ctx.strokeStyle = '#47363e'; // I'd like to set with CSS
	ctx.stroke();
	ctx.arc(850,130,15,0,2*Math.PI);
	ctx.stroke();
	
	
	var ctx = (this.myCanvas.nativeElement as HTMLCanvasElement).getContext('2d');
	ctx.beginPath();
	ctx.lineWidth = 2; // I'd like to set with CSS
	ctx.strokeStyle = '#47363e'; // I'd like to set with CSS
	ctx.stroke();
	ctx.arc(850,170,15,0,2*Math.PI);
	ctx.stroke();

	//***************************Cafeteria end*********************
	//**************Reception Table **********************
	var canvas = document.getElementById('myCanvas');
	var receptionTable = (this.myCanvas.nativeElement as HTMLCanvasElement).getContext('2d');

	receptionTable.beginPath();
	receptionTable.arc(850, 315, 40, 0, Math.PI, false);
	receptionTable.closePath();
	receptionTable.lineWidth = 3;
	receptionTable.fillStyle = '#7f8482';
	receptionTable.fill();
	receptionTable.strokeStyle = 'black';
	receptionTable.stroke();
		
	//*************************************************
	var roomName = (this.myCanvas.nativeElement as HTMLCanvasElement).getContext('2d');
	roomName.beginPath();
	roomName.lineWidth = 1;
	// roomName.font="veranda 6px Times";
	roomName.strokeStyle = '#47363e'; 
	roomName.fillText("Reception", 800, 400);
	roomName.stroke();
	//*************************************************
	
	var roomName = (this.myCanvas.nativeElement as HTMLCanvasElement).getContext('2d');
	roomName.beginPath();
	roomName.lineWidth = 1;
	//roomName.font="veranda 6px Times";
	roomName.strokeStyle = '#47363e'; 
	roomName.fillText("Cafeteria", 800, 200);
	roomName.stroke();
	
	var roomName = (this.myCanvas.nativeElement as HTMLCanvasElement).getContext('2d');
	roomName.beginPath();
	roomName.lineWidth = 1;
	//roomName.font="veranda 6px Times";
	roomName.strokeStyle = '#47363e'; 
	roomName.fillText("Confrence Hall 1", 670, 150);
	roomName.stroke();
	
	var roomName = (this.myCanvas.nativeElement as HTMLCanvasElement).getContext('2d');
	roomName.beginPath();
	roomName.lineWidth = 1;
	//roomName.font="veranda 6px Times";
	roomName.strokeStyle = '#47363e'; 
	roomName.fillText("Confrence Hall 2", 120, 150);
	roomName.stroke();
	
	var roomName = (this.myCanvas.nativeElement as HTMLCanvasElement).getContext('2d');
	roomName.beginPath();
	roomName.lineWidth = 1;
	//roomName.font="veranda 6px Times";
	roomName.strokeStyle = '#47363e'; 
	roomName.fillText("Server Room", 120, 400);
	roomName.stroke();
	
	var roomName = (this.myCanvas.nativeElement as HTMLCanvasElement).getContext('2d');
	roomName.beginPath();
	roomName.lineWidth = 1;
	//roomName.font="veranda 6px Times";
	roomName.strokeStyle = '#47363e'; 
	roomName.fillText("Dev Room 4", 270, 180);
	roomName.stroke();
	
	var roomName = (this.myCanvas.nativeElement as HTMLCanvasElement).getContext('2d');
	roomName.beginPath();
	roomName.lineWidth = 1;
	roomName.font="veranda 6px Times";
	roomName.strokeStyle = '#47363e'; 
	// roomName.strokeText("Dev Room 2", 470, 150);
	roomName.fillText("Dev Room 2", 470, 150);
	roomName.stroke();

	var roomName = (this.myCanvas.nativeElement as HTMLCanvasElement).getContext('2d');
	roomName.beginPath();
	roomName.lineWidth = 1;
	//roomName.font="veranda 6px Times";
	roomName.strokeStyle = '#47363e'; 
	roomName.fillText("Dev Room 3", 270, 400);
	roomName.stroke();
	
	var roomName = (this.myCanvas.nativeElement as HTMLCanvasElement).getContext('2d');
	roomName.beginPath();
	roomName.lineWidth = 1;
	//roomName.font="veranda 6px Times";
	roomName.strokeStyle = '#47363e'; 
	roomName.fillText("Dev Room 1", 470, 400);
	roomName.stroke();
	
	var roomName = (this.myCanvas.nativeElement as HTMLCanvasElement).getContext('2d');
	roomName.beginPath();
	roomName.lineWidth = 1;
	//roomName.font="veranda 6px Times";
	roomName.strokeStyle = '#47363e'; 
	roomName.fillText("IT Support ", 650, 400);
	roomName.stroke();
	
	//****************************************************
	this.receptionTable();
	this.drawCanvas();
  }
  
  //****************************************************
  drawCanvas() {
    
    var context = (this.myCanvas.nativeElement as HTMLCanvasElement).getContext('2d');
  // Italic Stroke Text
	context.font="italic 26px Times";
	context.fillStyle= '#301202';
    context.fillText("Office work space", 400, 275);
  }
  
  receptionTable(){
    var canvas = document.getElementById('myCanvas');
    var receptionTable = (this.myCanvas.nativeElement as HTMLCanvasElement).getContext('2d');

    receptionTable.beginPath();
    receptionTable.arc(288, 75, 70, 0, Math.PI, false);
    receptionTable.closePath();
    receptionTable.lineWidth = 3;
    receptionTable.fillStyle = 'red';
    receptionTable.fill();
    receptionTable.strokeStyle = '#550000';
    receptionTable.stroke();
  }
}
