//Importing Require Modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

// Connection URL
const url = 'mongodb://admin:A123456@ds119442.mlab.com:19442/hackaroo';

// Database Name
const dbName = 'hackaroo';

//Initializing express server.
const app = express();

//Port number
const port = process.env.PORT || 3002;

//Cors is used to allow other domains to access our application.
app.use(cors());

//BodyParser is used to parse in coming request body.
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb', extended: false}));


//Static folder
app.use(express.static(path.join(__dirname, 'public')));

//Get method is used to fetch the data.
app.get("/getTop", (req, res, next) => {
    //Connecting the mongodb
    MongoClient.connect(url,{ useNewUrlParser: true }, function (err, client) {
        //If connection failed the it will go to if condition.
        if (err) {
            res.send(JSON.stringify(err));
            res.end();
        }
        const db = client.db(dbName);
        db.collection('game').find().sort( { geek_rating: -1 } ).limit(10).toArray(function (err, result) {
            if (err) {
                res.write("fetching  top 10 games failed");
                res.end();
            } else {
                res.send(JSON.stringify(result));
            }
        });
    });
});

//Get method is used to fetch the data.
app.get("/search", (req, res, next) => {
    //Connecting the mongodb
    MongoClient.connect(url,{ useNewUrlParser: true }, function (err, client) {
        //If connection failed the it will go to if condition.
        if (err) {
            res.send(JSON.stringify(err));
            res.end();
        }
        console.log(req.query);
        const db = client.db(dbName);
        var query={};
        if(req.query.category !== ""){
            query[ "category"]= {$regex : ".*"+req.query.category+".*"};
        }
        if(req.query.max_players !== ""){
            query[ "max_players"]= { $lte: parseInt(req.query.max_players) };
        }
        if(req.query.avg_time !== ""){
            query[ "avg_time"]= { $lte: parseInt(req.query.avg_time) };
        }
        if(req.query.age !== ""){
            query[ "age"]= { $lte: parseInt(req.query.age)};
        }
       
        db.collection('game').find(query).sort( { year: -1 } ).sort( { geek_rating: -1 } ).limit(10).toArray(function (err, result) {
            if (err) {
                res.write("fetching  top 10 games failed");
                res.end();
            } else {
                res.send(JSON.stringify(result));
            }
        });
    });
});


//Post method is used to add the student in the database.
app.post("/create", (req, res, next) => {
    //Connecting to database
    MongoClient.connect(url, { useNewUrlParser: true },function (err, client) {
        //If connection failed the it will go to if condition.
        if (err) {
            res.write("connecting to Database failed");
            res.end();
        }
        const db = client.db(dbName);
        console.log(req.body);
        //Inserting the record in the database.
        db.collection('game').insertMany(req.body, function (err, result) {
            if (err) {
                res.send("Registration Failed, Error While Registering "+err);
                res.end();
            }
            res.send("Inserted a document into the students collection.");
        });
    });
});

//Required for navigating angular routes without server routes
app.all('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get("/service-worker.js", (req, res) => {
    res.sendFile(path.resolve(__dirname, "public", "service-worker.js"));
  });
//Starting the server.
app.listen(port, () => {
    console.log("Sever running in port : " + port);
});