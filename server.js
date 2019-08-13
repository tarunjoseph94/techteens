const express=require('express');
const templatesjs = require('templatesjs');
const server=express();
const fs=require('fs');
var bodyParser=require('body-parser');
const cheerio = require('cheerio')
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({
  extended: true
}));
var MongoClient = require('mongodb').MongoClient
, assert = require('assert');
var url = 'mongodb://localhost:27017';


templatesjs.dir = "./templates/";

server.get('/',function(req,res){
  fs.readFile("index.html", function(err,data){ // provided the file above is ./ index.html
    if(err)
    throw err;
    templatesjs.set(data,function(err,dat){
      if(err)
      throw err;
      res.write(dat);
      res.end();
    });
  });
});
server.get('/faq',function(req,res){
  fs.readFile("faq.html", function(err,data){ // provided the file above is ./ index.html
    if(err)
    throw err;
    templatesjs.set(data,function(err,dat){
      if(err)
      throw err;
      res.write(dat);
      res.end();
    });
  });
});
server.get('/calender',function(req,res){
  fs.readFile("calendar.html", function(err,data){ // provided the file above is ./ index.html
    if(err)
    throw err;
    templatesjs.set(data,function(err,dat){
      if(err)
      throw err;
      MongoClient.connect(url, function(err, client) {
        assert.equal(null, err);
        var db = client.db('Test');
        //console.log("Connected correctly to server");
        db.collection('calendarData').find({}).project({_id:0}).toArray(function(err, docs) {
          assert.equal(null, err);
          client.close();
          //console.log(docs);
          var exp;
          // console.log(docs.length);
          // for(var i=0;i<docs.length;i++)
          // {
          //   exp+=docs[i];
          //   //if(i!=(docs.length-1))
          //   console.log(exp)
          // }
          //console.log(exp);
          var dataNew=dat.toString();
          for(var i=0;i<=docs.length;i++)
          {
            if(JSON.stringify(docs[docs.length-i])!=undefined)
            exp+=JSON.stringify(docs[docs.length-i]);
              if(i!=(docs.length))
              exp+='$'
          }
          console.log(exp)
          const $ = cheerio.load(dataNew)
          $('textarea#caldat').text(exp);
          var bufStr=($.html());
          var buf=Buffer.from(bufStr, 'utf8');
          res.send(bufStr );

        });
        //res.end();
      });
    });
  });
});
server.get('/caladd',function(req,res){
  fs.readFile("caladd.html", function(err,data){ // provided the file above is ./ index.html
    if(err)
    throw err;
    templatesjs.set(data,function(err,dat){
      if(err)
      throw err;
      res.write(dat);
      res.end();
    });
  });

});
server.post('/caladdsubmit',function(req,res){
  console.log("asdasf");
  if(req)
  {
    var eventName=req.body.event_name;
    var eventDescription=req.body.event_description;
    var eventStartDate=req.body.event_start_date;
    var eventEndDate=req.body.event_end_date;
    MongoClient.connect(url, function(err, client) {
      assert.equal(null, err);
      console.log("Connected successfully to server");
      var db = client.db('Test');
      db.collection('calendarData').insertOne({title:eventName,description:eventDescription,start:eventStartDate,end:eventEndDate}, function(err, r) {
        assert.equal(null, err);
        assert.equal(1, r.insertedCount);
        client.close();
        fs.readFile("caladd.html", function(err,data){ // provided the file above is ./ index.html
          if(err)
          throw err;
          templatesjs.set(data,function(err,dat){
            if(err)
            throw err;
            res.write(dat);
            res.end();
          });
        });
      });
    });
    console.log(eventName);
    console.log(eventDescription);
    console.log(eventStartDate);
    console.log(eventEndDate);
  }

});
server.use(express.static(__dirname+'/assets'));
server.listen(3001);
console.log("Using 3001");
