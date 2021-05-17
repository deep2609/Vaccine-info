const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const moment = require('moment');
const path = require('path');
const mongodb = require('mongodb');
var dbConn = mongodb.MongoClient.connect('mongodb://localhost:27017');

let userData;
let deletedIds=[];
const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/public/html/home.html");
});

app.get("/contactus", function (req, res) {
    res.sendFile(__dirname + "/public/html/contact-me.html");
});


app.get("/notify", function (req, res) {
    res.sendFile(__dirname + "/public/html/vaccinenotify.html");
})

app.get("/vaccine-info", function (req, res) {
    res.sendFile(__dirname + "/public/html/vaccine_info.html");
})

// var PINCODE = '203001';
// const AGE = 45;

app.post('/post-feedback', function (req, res) {

    mongodb.MongoClient.connect('mongodb://localhost:27017', (err, client) => {
        var db = client.db('test');
        delete req.body._id; // for safety reasons
        db.collection('data').insertOne(req.body);
        //xyz=db;
    });
    //res.send('Data received:\n' + JSON.stringify(req.body));
    //console.log(xyz);
    console.log(JSON.stringify(req.body));
    res.send("<h1>Done</h1>");
});

async function main() {
    try {
        cron.schedule('* * * * *', async () => {
            checkAvailability();
        });
    } catch (e) {
        console.log('an error occured: ' + JSON.stringify(e, null, 2));
        throw e;
    }
}




async function checkAvailability() {

    let datesArray = await fetchNext1Days();
    await getUserData();
   console.log("I'm here");
   console.log(userData);

    if(typeof userData !== 'undefined'){
      for(let i=0;i<userData.length;i++){
        // console.log(typeof(userData[i]._id));
        // console.log(deleteIds.has(userData[i]._id));

        // let index = deletedIds.prototype.findIndex(function(element){
        //   return element === userData[i];
        // });
        // if(index>-1){
        //   deletedIds.splice(index,1);
        //   continue;
        // }else{
        //   datesArray.forEach(date =>{
        //     let ok = getSlotsForDate(date,userData[i]);
        //     // if(ok)toBeDeleted.push(userData[i]._id);
        //   });
        // }
        // if(deletedIds.has(userData[i]._id)){
        //   deletedIds.delete(userData[i]._id);
        //   continue;
        // }else{
        //   datesArray.forEach(date =>{
        //     let ok = getSlotsForDate(date,userData[i]);
        //     // if(ok)toBeDeleted.push(userData[i]._id);
        //   });
        // }

        datesArray.forEach(date =>{
            let ok = getSlotsForDate(date,userData[i]);
            // if(ok)toBeDeleted.push(userData[i]._id);
          });
      }
    }

}

async function fetchNext1Days() {
    let dates = [];
    let today = moment();
    for (let i = 0; i < 1; i++) {
        let dateString = today.format('DD-MM-YYYY')
        dates.push(dateString);
        today.add(1, 'day');
    }
    return dates;
}

async function getUserData() {
    mongodb.MongoClient.connect('mongodb://localhost:27017', (err, client) => {
        var db = client.db('test');
        db.collection('data').find({}).toArray().then(function (feedbacks) {
            userData = (feedbacks);
            console.log(userData);
            console.log(typeof(userData));

        });
    });
  //  return userData;
}

function getSlotsForDate(DATE, element) {

    let ok = false;
    console.log(element.district);
    var options = {
        'method': 'GET',
        'url': 'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id='+ Number(element.district) + '&date='+DATE,
        'headers': {
            'Accept-Language': 'en_US'
        }
    };

    request(options, function (error, response) {
        if (error) {
            throw new Error(error);
        }

        let validSlots = [];
        let data = JSON.parse(response.body);
        // console.log(data);
        for (var i = 0; i < data.centers.length; ++i) {
            for (var j = 0; j < data.centers[i].sessions.length; ++j) {
                let availability = data.centers[i].sessions[j].available_capacity;
                let minAge = data.centers[i].sessions[j].min_age_limit;
                // console.log(availability);
                if (availability > 0) {
                    validSlots.push(data.centers[i]);
                }
            }
        }
        console.log(validSlots.length);
        if (validSlots.length > 0) {
            console.log("Vaccination Centres Found");
            notifyMe(validSlots, element.email);

            mongodb.MongoClient.connect('mongodb://localhost:27017', (err, client) => {
                var db = client.db('test');
                db.collection('data').deleteOne({
                  "_id" : element._id
                });
            });
            deletedIds.push(element);
        }
    });
    // return ok;
}

async function notifyMe(validSlots, email) {
    let slotDetails = JSON.stringify(validSlots, null, '\t');
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'vaccineinfo2021@gmail.com',
            pass: 'Noti'
        }
    });

    var mailOptions = {
        from: 'vaccineinfo2021@gmail.com',
        to: email,
        subject: 'Vaccine Available-Hurry Up! Book Fast',
        text: 'Following Slots are Available Right now! Please Book Fast otherwise it would be filled immediately\n' + slotDetails,
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
    // console.log(slotDetails);
};


const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
    console.log("Server Started on Port" + PORT);
});


main().then(() => { console.log('Vaccine availability checker started.'); });
