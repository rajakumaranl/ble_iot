var express = require('express');
var router = express.Router();
const mysql = require('mysql');
const cors = require('cors'); 
var http = require('http');
const moment = require('moment');
var app = express();

app.use(cors());
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET home page. */
router.get('/about', function(req, res, next) {
  res.render('index', { title: 'This is sample about page' });
});

router.get('/available-devices', function(req, res, next) {
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
    
    con.query('SELECT * from iot.device;', function (err, result) {
      if (err)
        throw err;
      con.end();
      // console.log("Result: " + result);
      res.status(200).send(result);
    });
    // con.end((err));
  });
})

router.get('/device-position', function(req, res, next) {

  var mac_address = req.query.mac_address;
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
    
    con.query('SELECT xcoordinate, ycoordinate from iot.device where device_Address = "'+mac_address+'" LIMIT  1;', function (err, result) {
      if (err)
        throw err;
      // console.log("resuls for presence : ",result);
      con.end();
      res.status(200).send(result);
    });
  });

})


router.post('/add-device', function(req, res, next) {
  const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root@123',
    database: 'iot',
  });
  var device = req.body.params;
  console.log("Device Data : ",device);
  var xcoordinate = device.xcoordinate;
  var ycoordinate = device.ycoordinate;
  var location = device.location;
  let mac_address = device.device_address;
  let uuid = device.uuid;
  let device_name = device.device_name;
  var time =  moment(new Date()).format('YYYY-MM-DD');
  con.connect((err) => {
    if(err){
      console.log('Error connecting to Db ========> ', err);
      return;
    }
    var iq = 'INSERT INTO iot.device (device_UUID, device_name, device_Address, device_Location, Created_By, Created_Date, Modified_By, Modified_Date, End_Date, xcoordinate, ycoordinate) '
    +'values("'+uuid+'", "'+device_name+'", "'+mac_address+'", "'+location+'", 1, "'+time+'", NULL, NULL, NULL, '+xcoordinate+', '+ycoordinate+')';
    con.query(iq, function (err, result) {
      if(err) throw err;
      // console.log("Added new device : " + result);
      res.status(200).send(result);
    });
  });
  // con.end((err));
});

router.post('/edit-device', function(req, res, next) {
  const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root@123',
    database: 'iot',
  });
  var device = req.body.params;
  console.log("Device Data : ",device);
  var xcoordinate = device.xcoordinate;
  var ycoordinate = device.ycoordinate;
  var location = device.location;
  let mac_address = device.device_address;
  let uuid = device.uuid;
  let device_name = device.device_name;
  var time =  moment(new Date()).format('YYYY-MM-DD');
  con.connect((err) => {
    if(err){
      console.log('Error connecting to Db ========> ', err);
      return;
    }
    var uq = 'update iot.device SET device_name="'+device_name+'", device_Address="'+mac_address+'", device_Location="'+location+'", Modified_By=1, Modified_Date="'+time+'", End_Date=NULL, xcoordinate='+xcoordinate+', ycoordinate='+ycoordinate+' WHERE device_UUID ="'+uuid+'"';
    con.query(uq, function (err, result) {
      if(err) throw err;
      // console.log("Updated device : " + result);
      con.end();
      res.status(200).send(result);
    });
  });
  // con.end((err));
});

router.delete('/remove-devices', function(req, res, next) {
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
    var deleteQuery = 'DELETE FROM iot.device';
    con.query(deleteQuery, function (err, result) {
      if(err) throw err;
      console.log("Removed all devices : " + result);
      con.end();
      res.status(200).send(result);
    });
  });
  // con.end((err));
});

router.get('/device-position/history', function(req, res, next) {
  var mac_address = req.query.mac_address;
  
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
    
    con.query('SELECT * from iot.userpresence join iot.device on device.device_id = userpresence.device_id where device.device_Address = "'+mac_address+'" and userpresence.End_Date IS NOT NULL order by userPresence_id  DESC LIMIT  20;', function (err, result) {
      if (err)
        throw err;
      console.log("resuls for presence : ",result);
      con.end();
      res.status(200).send(result);
    });
  });

})

module.exports = router;
