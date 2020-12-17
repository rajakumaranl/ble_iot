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
  renderer: any;
  img1 = new Image();
  updateSubscription: Subscription;
  constructor(private viewmapService : ViewMapService,
    private router: Router, 
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    
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
    this.startAutoReferesh();
  }

  startAutoReferesh() {
      this.updateSubscription = interval(30000).subscribe(val => {
        this.checkUserPosition();
      });
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

		this.viewmapService.getPosition().subscribe(
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
  
  goBack(){
    this.router.navigate(['/view-map']);
  }
	
	positionUser(x, y) {
      // this.contextLayer2.clearRect(0, 0, 50, 38);

      // this.img1.onload = ()=>{
      //   this.manContext.clearRect(0, 0, 50,38);  // clear canvas
      //   this.manContext.drawImage(this.img1, x, y);                       // draw image at current position
      //   x -= 4;
      //   if (x > 250) requestAnimationFrame(this.loopFunction)        // loop
      // }
      // this.img1.src = "http://i.stack.imgur.com/Rk0DW.png";  
      // drawing of the test image - img1
      this.img1.onload = ()=> {
        this.manContext.clearRect(this.x, this.y, 50,38);
        this.x = x;
        this.y = y;
        this.manContext.drawImage(this.img1, x, y, 50, 38);
      }
      this.img1.src = '../assets/images/man.png';
  }

  drawBuildingMap(){
		// var canvas = document.getElementById('myCanvas');
		// var context0 = canvas.getContext('2d');
    this.context.font = "16px Arial";
    this.context.textBaseline = 'middle';
    this.context.textAlign = 'center';

    // const x = (this.myCanvas.nativeElement as HTMLCanvasElement).width / 2;
    // const y = (this.myCanvas.nativeElement as HTMLCanvasElement).height / 2;
    // this.context.fillText("@realappie", x, y);

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


		// var canvas = document.getElementById('myCanvas');
		// var context = canvas.getContext('2d');

		this.context.beginPath();
    this.	context.moveTo(50,50);//Starting point of the diagram
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
		
		// var canvas = document.getElementById("myCanvas");
		// var context2 = canvas.getContext("2d");
		this.context2.beginPath();
		
		this.context2.moveTo(700,300);
		this.context2.lineTo(750,350);

		this.context2.moveTo(750,350);
		this.context2.lineTo(750,500);
		this.context2.lineWidth = 3; // I'd like to set with CSS
		this.context2.strokeStyle = '#2e3300'; // I'd like to set with CSS
		this.context2.stroke();
		
		var canvas = document.getElementById("myCanvas");
		var roomName = (this.myCanvas.nativeElement as HTMLCanvasElement).getContext('2d');
		roomName.beginPath();
		roomName.lineWidth = 1;
		roomName.font="veranda 6px Times";
		roomName.strokeStyle = '#330018'; 
		roomName.strokeText("Reception", 800, 450);
		roomName.stroke();

		//***************************Cafeteria start*********************
		var canvas = document.getElementById("myCanvas");
		var ctx = (this.myCanvas.nativeElement as HTMLCanvasElement).getContext('2d');
		ctx.beginPath();
		ctx.lineWidth = 2; // I'd like to set with CSS
		ctx.strokeStyle = '#330018'; // I'd like to set with CSS
		ctx.stroke();
		ctx.arc(800,90,15,0,2*Math.PI);
		ctx.stroke();
		
		var canvas = document.getElementById("myCanvas");
		var ctx = (this.myCanvas.nativeElement as HTMLCanvasElement).getContext('2d');
		ctx.beginPath();
		ctx.lineWidth = 2; // I'd like to set with CSS
		ctx.strokeStyle = '#330018'; // I'd like to set with CSS
		ctx.stroke();
		ctx.arc(800,130,15,0,2*Math.PI);
		ctx.stroke();
		
		var canvas = document.getElementById("myCanvas");
    var ctx =  (this.myCanvas.nativeElement as HTMLCanvasElement).getContext('2d');
		ctx.beginPath();
		ctx.lineWidth = 2; // I'd like to set with CSS
		ctx.strokeStyle = '#330018'; // I'd like to set with CSS
		ctx.stroke();
		ctx.arc(800,170,15,0,2*Math.PI);
		ctx.stroke();
		
		var canvas = document.getElementById("myCanvas");
		var ctx = (this.myCanvas.nativeElement as HTMLCanvasElement).getContext('2d');
		ctx.beginPath();
		ctx.lineWidth = 2; // I'd like to set with CSS
		ctx.strokeStyle = '#330018'; // I'd like to set with CSS
		ctx.stroke();
		ctx.arc(850,90,15,0,2*Math.PI);
		ctx.stroke();
		
		var canvas = document.getElementById("myCanvas");
		var ctx = (this.myCanvas.nativeElement as HTMLCanvasElement).getContext('2d');
		ctx.beginPath();
		ctx.lineWidth = 2; // I'd like to set with CSS
		ctx.strokeStyle = '#330018'; // I'd like to set with CSS
		ctx.stroke();
		ctx.arc(850,130,15,0,2*Math.PI);
		ctx.stroke();
		
		var canvas = document.getElementById("myCanvas");
		var ctx = (this.myCanvas.nativeElement as HTMLCanvasElement).getContext('2d');
		ctx.beginPath();
		ctx.lineWidth = 2; // I'd like to set with CSS
		ctx.strokeStyle = '#330018'; // I'd like to set with CSS
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
		
		var canvas = document.getElementById("myCanvas");
		var roomName = (this.myCanvas.nativeElement as HTMLCanvasElement).getContext('2d');
		roomName.beginPath();
		roomName.lineWidth = 1;
		//roomName.font="veranda 6px Times";
		roomName.strokeStyle = '#330018'; 
		roomName.strokeText("Cafeteria", 800, 150);
		roomName.stroke();
		
		var canvas = document.getElementById("myCanvas");
		var roomName = (this.myCanvas.nativeElement as HTMLCanvasElement).getContext('2d');
		roomName.beginPath();
		roomName.lineWidth = 1;
		//roomName.font="veranda 6px Times";
		roomName.strokeStyle = '#330018'; 
		roomName.strokeText("Confrence Hall 1", 620, 150);
		roomName.stroke();
		
		
		var canvas = document.getElementById("myCanvas");
		var roomName = (this.myCanvas.nativeElement as HTMLCanvasElement).getContext('2d');
		roomName.beginPath();
		roomName.lineWidth = 1;
		//roomName.font="veranda 6px Times";
		roomName.strokeStyle = '#330018'; 
		roomName.strokeText("Confrence Hall 2", 100, 150);
		roomName.stroke();
		
		var canvas = document.getElementById("myCanvas");
		var roomName = (this.myCanvas.nativeElement as HTMLCanvasElement).getContext('2d');
		roomName.beginPath();
		roomName.lineWidth = 1;
		//roomName.font="veranda 6px Times";
		roomName.strokeStyle = '#330018'; 
		roomName.strokeText("Server Room", 100, 400);
		roomName.stroke();
		
		
		var canvas = document.getElementById("myCanvas");
		var roomName = (this.myCanvas.nativeElement as HTMLCanvasElement).getContext('2d');
		roomName.beginPath();
		roomName.lineWidth = 1;
		//roomName.font="veranda 6px Times";
		roomName.strokeStyle = '#330018'; 
		roomName.strokeText("Dev Room 4", 270, 150);
		roomName.stroke();
		
			var canvas = document.getElementById("myCanvas");
		var roomName = (this.myCanvas.nativeElement as HTMLCanvasElement).getContext('2d');
		roomName.beginPath();
		roomName.lineWidth = 1;
		//roomName.font="veranda 6px Times";
		roomName.strokeStyle = '#330018'; 
		roomName.strokeText("Dev Room 2", 470, 150);
		roomName.stroke();
		
		
		var canvas = document.getElementById("myCanvas");
		var roomName = (this.myCanvas.nativeElement as HTMLCanvasElement).getContext('2d');
		roomName.beginPath();
		roomName.lineWidth = 1;
		//roomName.font="veranda 6px Times";
		roomName.strokeStyle = '#330018'; 
		roomName.strokeText("Dev Room 3", 270, 400);
		roomName.stroke();
		
			var canvas = document.getElementById("myCanvas");
		var roomName = (this.myCanvas.nativeElement as HTMLCanvasElement).getContext('2d');
		roomName.beginPath();
		roomName.lineWidth = 1;
		//roomName.font="veranda 6px Times";
		roomName.strokeStyle = '#330018'; 
		roomName.strokeText("Dev Room 1", 470, 400);
		roomName.stroke();
		
		var canvas = document.getElementById("myCanvas");
		var roomName = (this.myCanvas.nativeElement as HTMLCanvasElement).getContext('2d');
		roomName.beginPath();
		roomName.lineWidth = 1;
		//roomName.font="veranda 6px Times";
		roomName.strokeStyle = '#330018'; 
		roomName.strokeText("IT Support ", 650, 400);
		roomName.stroke();
		
		//****************************************************
		//  this.drawCanvas();
		
		this.receptionTable();
  }
  
  //****************************************************
  drawCanvas() {
    var canvas = document.getElementById("canvasText");
    var context = (this.myCanvas.nativeElement as HTMLCanvasElement).getContext('2d');
  // Italic Stroke Text
    context.font="italic 16px Times";
    context.strokeText("Italic, Stroke, Text, 26px, times", 20, 85);
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
