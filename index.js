const express=require("express");
const app=express();

let server=require('./server');
let middleware=require('./middleware');

const bodyParser=require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

const MongoClient = require("mongodb").MongoClient;

const url='mongodb://127.0.0.1:27017';
const dbName='hospitalManagement';

MongoClient.connect(url,(err,client)=>{
    if(err) return console.log(error);
    
    db=client.db(dbName);

    console.log(`Connected Database: ${url}`);
    console.log(`Database : ${dbName}`);
    
});
//fetching hospital details
app.get('/hospitaldetails',middleware.checkToken,function(req,res){
    console.log("Fetching data from Hospital Collection");
    var data=db.collection("hospital").find().toArray()
        .then(result=> res.json(result));
});


//Fetching ventilator details

app.get('/ventilatordetails',middleware.checkToken,(req,res)=>{
    console.log("Ventilators Information");
    var ventilatordetails=db.collection("ventilator").find().toArray().then(result=>res.json(result));
});

//search ventilator by status

app.post('/searchventbystatus',middleware.checkToken,(req,res)=>{
    var status=req.body.status;
    console.log(status);
    var ventilatordetails=db.collection('ventilator')
    .find({"status": status}).toArray().then(result=>res.json(result));
});

//search ventilator by hospital name

app.post('/searchventbyname',middleware.checkToken,(req,res)=>{
    var name=req.query.name;
    console.log(name);
    var ventilatordetails=db.collection('ventilator')
    .find({"name": new RegExp(name, 'i')}).toArray().then(result=>res.json(result));
});

//search hospital by name

app.post('/searchhospbyname',middleware.checkToken,(req,res)=>{
    var name=req.query.name;
    console.log(name);
    var hospitaldetails=db.collection('hospital')
    .find({"name": new RegExp(name,'i')}).toArray().then(result=>res.json(result));
});

//delete ventilator by ventilator id

app.delete('/delete',middleware.checkToken,(req,res)=>{
    var myquery=req.query.vid;
    console.log(myquery);
    var myquery1 = {vid: myquery};
    db.collection("ventilator").deleteOne(myquery1,function(err,obj){
        if(err) throw err;
        res.json("1 document deleted");
    });
});

//update ventilator details

app.put('/update',middleware.checkToken,(req,res)=>{
    var myquery=req.body.vid;
    var status=req.body.status;
    console.log(myquery);
    var myquery1={vid:myquery};
    db.collection("ventilator").updateOne(myquery1,{$set:{"status": status}},function(err,obj){
        if(err) throw err;
        res.json("1 document updated");
    });
});

//add ventilator details

app.post('/insert',middleware.checkToken,(req,res)=>{
    var hid=req.body.hid;
    var vid=req.body.vid;
    var status=req.body.status;
    var name=req.body.name;
    var myquery={"hid":hid,"vid":vid,"status":status,"name":name};
    console.log(myquery);
    db.collection("ventilator").insertOne(myquery,function(err,obj){
        if(err) throw err;
        res.json("1 document inserted");
    });
});

app.listen(1100);





