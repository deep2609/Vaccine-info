const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const moment = require('moment');
const path = require('path');
const mongodb = require('mongodb');
var dbConn = mongodb.MongoClient.connect('mongodb://localhost:27017');


const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/",function(req,res){
  res.sendFile(__dirname+"/home.html");
});

app.get("/notify",function(req,res){
  res.sendFile("C:\Users\shantanupc\main-project\Vaccine-info-main\vaccinenotify.html");
})
// var PINCODE = '203001';
// const AGE = 45;

app.post('/post-feedback', function (req, res) {
    let xyz;
     mongodb.MongoClient.connect('mongodb://localhost:27017',(err,client) =>{
       var db = client.db('test');
       delete req.body._id; // for safety reasons
       db.collection('feedbacks').insertOne(req.body);
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

async function getUserData(){
  let userData;
  mongodb.MongoClient.connect('mongodb://localhost:27017',(err,client)=>{
    var db = client.db('test');
    db.collection('feedbacks').find({}).toArray().then(function(feedbacks) {
        userData = feedbacks;
        console.log(userData);

    });
  });
  return userData;
}

async function deleteFoundItems(toBeDeleted){
  mongodb.MongoClient.connect('mongodb://localhost:27017',(err,client)=>{
    var db = client.db('test');
    toBeDeleted.forEach(element =>{
      db.collection('feedbacks').remove({_id : element});
    });
  });
  return true;
}
async function checkAvailability() {

    let datesArray = await fetchNext1Days();
    let userData = await getUserData();

    let toBeDeleted=[];
    for(let i=0;i<userData.length;i++){
      datesArray.forEach(date => {
          let ok = getSlotsForDate(date,userData[i]);
          if(ok)toBeDeleted.push(userData[i]._id);
      });
    }
//     userData.forEach(element => {
//       datesArray.forEach(date => {
//           let ok = getSlotsForDate(date,element);
//           if(ok)toBeDeleted.push(element._id);
//       });
//     });

    let done = await deleteFoundItems(toBeDeleted);



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

function getSlotsForDate(DATE,element) {

   let ok=false;

    var options = {
        'method': 'GET',
        'url': 'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=' + element.district + '&date=' + DATE,
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
        for (var i = 0; i < data.centers.length; ++i) {
            for (var j = 0; j < data.centers[i].sessions.length; ++j) {
                let availability = data.centers[i].sessions[j].available_capacity;
                let minAge = data.centers[i].sessions[j].min_age_limit;
                if (minAge <= element.age && availability > 0) {
                    validSlots.push(data.centers[i]);
                }
            }
        }
        if (validSlots.length > 0) {
            console.log("Vaccination Centres Found");
            notifyMe(validSlots,element.email);
            ok=true;
        }
    });
    return ok;
}

async function notifyMe(validSlots,email) {
    let slotDetails = JSON.stringify(validSlots, null, '\t');
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'vaccineinfo2021@gmail.com',
            pass: 'Notify2021'
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
    console.log("Server Started on Port 3000");
});


main().then(() => { console.log('Vaccine availability checker started.'); });
