var express = require('express');
var router = express.Router();
const mysql = require('mysql');
const cors = require('cors'); 
var http = require('http');
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
    console.log('Connection established t o fetch devices');
    // var updateAudit = await pool.query('INSERT INTO public.product_audit(product_id, mrp, price , module_name, operation , updated_json , operation_done_by) VALUES ($1, $2, $3, $4, $5, $6, $7)',[request.product_id, request.mrp, request.sellingPrice, request.module_name,'UPDATED',updateJson,request.changed_by])
    con.query('SELECT * from iot.device;', function (err, result) {
      if (err)
        throw err;

      console.log("Result: " + result);
      res.status(200).send(result);
    });
  });
  // res.render('index', { title: 'Available devices' })
})

module.exports = router;
