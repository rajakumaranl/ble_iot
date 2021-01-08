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
      password: 'root@123',
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
        console.log("Available Devices : " + result.length);
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
  let deviceInfo = JSON.parse(message);
  var uuid =  deviceInfo.device_UUID;
  var mac_address = deviceInfo.device_Address
  let t = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
  console.log("================ T ================== : ",t);
  var time =  moment(deviceInfo.location_Time).format('YYYY-MM-DD hh:mm:ss');
  // var time =  deviceInfo.location_Time;

  if(uuid =='' && mac_address == ''){
    return;
  }
  var xcoordinate = 100;
  var ycoordinate = 100;
  var location = deviceInfo.user_Name;

  if(location =='Conference_room'){
    xcoordinate = 700;
    ycoordinate = 150;
  } else if(location =='Dev_Room_1'){
    xcoordinate = 500;
    ycoordinate = 350;
  } else if(location =='Cafeteria'){
    xcoordinate = 800;
    ycoordinate = 150;
  } else if(location =='Reception'){
    xcoordinate = 800;
    ycoordinate = 350;
  } else if(location =='Dev_Room_2'){
    xcoordinate = 500;
    ycoordinate = 150;
  } else if(location =='Dev_Room_3'){
    xcoordinate = 300;
    ycoordinate = 350;
  } else if(location =='Dev_Room_4'){
    xcoordinate = 300;
    ycoordinate = 150;
  } else if(location =='IT_Support'){
    xcoordinate = 670;
    ycoordinate = 350;
  } else if(location =='Server_Room'){
    xcoordinate = 100;
    ycoordinate = 350;
  } else if(location =='Conference_Room_2'){
    xcoordinate = 100;
    ycoordinate = 150;
  } else{
    
  }
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root@123',
    database: 'iot',
  });

  var device = null;
  connection.connect((err) => {
    if(err){
      console.log('Error connecting to Db ========> ', err);
      return;
    }
    console.log("new device found  : ",deviceInfo.device_UUID);
    var qur = 'SELECT * from iot.device WHERE iot.device.device_Address = "'+mac_address+'";';
    connection.query(qur, [true], (error, results) => {
      if (error) {
        console.log("Error ",error.message);
        return;
      }
      if(results.length == 0){
        console.log("not already exists with MAC_Address so checking with UUID ");
        var qur1 = 'SELECT * from iot.device WHERE iot.device.device_UUID = "'+uuid+'";';
        connection.query(qur1, [true], (error, results1) => {
          if (error) {
            console.log("Error ",error.message);
            connection.end();
            return;
          }

          if(results1.length == 0){
              console.log("not already exists with UUID also so creating new device ", uuid);
              var insertDevice = 'INSERT INTO iot.device (device_UUID,device_name,device_Address,device_Location,Created_By,Created_Date,Modified_By,Modified_Date,End_Date,xcoordinate,ycoordinate,status) '
              +'values ("'+uuid+'","'+deviceInfo.device_Name+'","'+deviceInfo.device_Address+'","'+deviceInfo.user_Name+'",1,"'+time+'", NULL,NULL,NULL,'+xcoordinate+','+ycoordinate+',1)';
              
              connection.query(insertDevice, function (err, result) {
                if (err) {console.log("Error while insert ",err);}
                
                var qur = 'SELECT * from iot.device WHERE device.device_Address = "'+deviceInfo.device_Address+'" LIMIT 1;';
                connection.query(qur, (error, results) => {
                  if (error) {
                    console.log("Error ",error.message);
                  }

                  device = results[0];
                  //inserting the current position of the device
                  var insertQuery ='INSERT INTO iot.userpresence (user_id,device_id,Created_By,Created_Date,End_Date,xcoordinate,ycoordinate,userlocation) '
                  +'values (1,'+device.device_id+', 1 ,"' +time+'", NULL, '+ xcoordinate+', '+ ycoordinate+', "'+ location+'")';

                  connection.query(insertQuery, function (err, result) {
                  if (err) throw err;
                  console.log('Updated device current position : ');
                  connection.end();
                  return;
                  }); 
                });
                console.log("Device added successfully " , device);
                
            });
          } else {
            console.log("Device already exists so Updating location: 2 ", results1[0]);
            const devicesId = results1[0].device_id;
            console.log("devicesId : " + devicesId);
            //make the device status online
            connection.query("UPDATE iot.device SET device_Location='"+deviceInfo.user_Name+"', xcoordinate="+xcoordinate+", ycoordinate="+ycoordinate+", status = 1 WHERE device_UUID = '"+ uuid+"';", function (err, result) {
              if (err) throw err;

              console.log("Update device status Result asa : " + devicesId);
              let t = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
              var times =  moment(t).format('YYYY-MM-DD hh:mm:ss');

              //make the old locaiton false
              var deleteQuery ='UPDATE iot.userpresence SET End_Date = "'+times+'" WHERE device_id='+devicesId;
              connection.query(deleteQuery, function (err, result) {
                if (err) throw err;
              });
              
              //inserting the current position of the device
              var insertQuery ='INSERT INTO iot.userpresence (user_id,device_id,Created_By,Created_Date,End_Date,xcoordinate,ycoordinate,userlocation) '
                            +'values (1,'+devicesId+', 1 ,"' +times+'", NULL, '+ xcoordinate+', '+ ycoordinate+', "'+ location+'")';
              
              connection.query(insertQuery, function (err, result) {
                if (err) throw err;
                console.log('Updated device status presence : ');
                connection.end();
                return;
              });   
              
            });
          }
        });
        // return;
      } else {
          console.log("Updating location: 3 ", results);
          device = results[0];
          //make the device status online
          connection.query("UPDATE iot.device SET device_Location='"+deviceInfo.user_Name+"',xcoordinate="+xcoordinate+", ycoordinate="+ycoordinate+", status = 1 WHERE device_Address = '"+ mac_address+"';", function (err, result) {
            if (err) throw err;
            console.log("Update device status Result: " + result);
          });
          let t = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
          var times =  moment(t).format('YYYY-MM-DD hh:mm:ss');
          //make the old locaiton false
          var deleteQuery ='UPDATE iot.userpresence SET End_Date = "'+times+'" WHERE device_id='+device.device_id;
          connection.query(deleteQuery, function (err, result) {
            if (err) throw err;
          });

          //inserting the current position of the device
          var insertQuery ='INSERT INTO iot.userpresence (user_id,device_id,Created_By,Created_Date,End_Date,xcoordinate,ycoordinate,userlocation) '
                        +'values (1,'+device.device_id+', 1 ,"' +times+'", NULL, '+ xcoordinate+', '+ ycoordinate+', "'+ location+'")';
          
          connection.query(insertQuery, function (err, result) {
            if (err) throw err;
            console.log('Updated device status presence : ');
            connection.end();
          });   
      }  
    });
  });
  connected = (message.toString() === 'true')
}

function isDeviceExists(connection){
  var qur = 'SELECT * from iot.device WHERE iot.device.device_UUID = "'+uuid+'";';
    connection.query(qur, [true], (error, results) => {
      if (error) {
        console.log("Error ",error.message);
      }
      if(results.length > 0){
        return results;
      }
    });
}

function updatePresence(){
  return new Promise(async function(resolve) {
    const pool = con.createConnection();
    var result = await pool.query('SELECT * from devices;');
    resolve(result.rows);
    });   
}

function getDeviceDetails(uuid, con){
  // return new Promise(async function(resolve) {
      var qur = 'SELECT * from iot.device where device_UUID = "'+uuid+'";';
      console.log('Connection established t o fetch devices : ',qur);
      
      var result = con.query(qur);
      console.log("result ",result.rows);
      // resolve(result.rows);
    // });  
}

function handleDeviceState (message) {
  deviceState = message
  console.log('device state update to %s', message)
}

module.exports = app;
