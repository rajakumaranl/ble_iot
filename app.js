var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://broker.hivemq.com')
const cors = require('cors');
const mysql = require('mysql');
const express = require('express');
const bodyparser = require('body-parser');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

//Configuring express server
app.use(bodyparser.json());
const _ = require('lodash');
const moment = require('moment');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());

app.use('/', indexRouter);
app.use('/users', usersRouter);


const { MqttClient } = require('mqtt');

  onAppStartUp();

async function onAppStartUp() {
    const port = 3000

    app.get('/', (req, res) => {
      res.send('Hello World!')
    })

    app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`)
    })

    // restApiServer.use(cors({'credentials':true , 'origin' : 'http://localhost:8110'}))
    app.use(cors({'credentials':true , 'origin' : ['http://localhost:8100','http://localhost','capacitor://localhost','ionic://localhost','http://34.219.218.137:4200','http://localhost:4200']}))

    //MySQL details
    const con = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'abcd',
      database: 'iot',
    });

    con.connect((err) => {
      if(err){
        console.log('Error connecting to Db ========> ', err);
        return;
      }
      console.log('Connection established');
      con.query('SELECT * from iot.device;', function (err, result) {
        if (err) throw err;
        console.log("Result: " + result);
      });
    });
    
    // con.end((err) => {
    //   // The connection is terminated gracefully
    //   // Ensures all remaining queries are executed
    //   // Then sends a quit packet to the MySQL server.
    // });

  // await appConfigService.startupDBConnect();
    //init rest api
    // configureRestApi();
}

function configureRestApi() {
  //configure http request logging
  var accessLogStream = fs.createWriteStream(global.logFilePath, {flags: 'a'});
  var morganParams = '[:date[clf]] :method :url :status :response-time ms - :res[content-length]'; //log date, method, url, status, response time, content length
  //log all rest api http request to log file
  restApp.use(morgan(morganParams, {stream: accessLogStream}));
  //log all rest api http request to console
  restApp.use(morgan(morganParams));

  restApp.use(bodyParser.json({ limit: '5mb' }));
  restApp.use(cors(corsOptions),function(req,res,next){
    var database = req.get('Database');
    if(database){
      appConfigService.startupDBConnect({'masterDbName':database}).then(function(){
        next();
      })
    }else{
      appConfigService.startupDBConnect().then(function(){
        next();
      })
    }
    
  })
  global.restApp = restApp;
  require('./nodeApp')(restApp);
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var deviceState = ''
var connected = false

client.on('connect', () => {
  client.subscribe('device/connected', function (err, granted) {
      console.log("error : ", err);
      console.log("Granted ", granted);
  });
  client.subscribe('device/state');
  client.subscribe('DeviceLocation');
})

client.on('message', (topic, message) => {
  switch (topic) {
    case 'DeviceLocation':
      return handleDeviceConnected(message)
    case 'device/connected':
      return handleDeviceConnected(message)
    case 'device/state':
      return handleDeviceState(message)
  }
  console.log('No handler for topic %s', topic)
})


function handleDeviceConnected (message) {
  console.log('device connected status %s', message)
  let receviceData = JSON.parse(message);

  console.log("received device UUID : ",receviceData.device_UUID);
  const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'abcd',
    database: 'iot',
  });

  var uuid =   receviceData.device_UUID;;
  con.connect((err) => {
    if(err){
      console.log('Error connecting to Db ========> ', err);
      return;
    }
    console.log('Connection established to udate devices status');
    con.query("UPDATE device SET status = 1 WHERE device_UUID = '"+ uuid+"'", function (err, result) {
      if (err)
        throw err;
      allDevices = result;
      console.log("Result: " + result);
    });
  });
  connected = (message.toString() === 'true')
}
function saveTotalPurchase(request){
  return new Promise(async function(resolve) {
  const pool = con.createConnection();
  var result = await pool.query('SELECT * from devices;')
  // var result = await pool.query('INSERT INTO precence(supplier_code, telephone_no, po_no, bill_discount, invoice_no, invoice_amount, net_amount, status, po_date, invoice_date, brand, created_by, changed_by, final_invoice_amount ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *;', [request.code, request.telephone, request.poNo, request.billDiscount, request.invoiceNo, request.invoiceAmount, request.net_amount, request.status, request.poDate, request.invoiceDate, request.brand,request.created_by,request.changed_by, request.finalInvoiceAmount]);
  resolve(result.rows);
  });   
}
function handleDeviceState (message) {
  deviceState = message
  console.log('device state update to %s', message)
}


// function openDeviceDoor () {
//   // can only open door if we're connected to mqtt and door isn't already open
//   if (connected && deviceState !== 'open') {
//     // Ask the door to open
//     client.publish('device/open', 'true')
//   }
// }

// function closeDeviceDoor () {
//   // can only close door if we're connected to mqtt and door isn't already closed
//   if (connected && deviceState !== 'closed') {
//     // Ask the door to close
//     client.publish('device/close', 'true')
//   }
// }

// // --- For Demo Purposes Only ----//

// // simulate opening garage door
// setTimeout(() => {
//   console.log('open door')
//   openDeviceDoor()
// }, 5000)

// // simulate closing garage door
// setTimeout(() => {
//   console.log('close door')
//   closeDeviceDoor()
// }, 20000)

module.exports = app;
