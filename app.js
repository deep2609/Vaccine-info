const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const moment = require('moment');
const path = require('path');
const mongodb = require('mongodb');
var dbConn = mongodb.MongoClient.connect('mongodb://localhost:27017');  // use mongoDB atlas when hosting on server   (follow same procedures for all other links below)

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

app.post("/success",function(req,res){
  res.redirect("/");
})

app.post("/failure",function(req,res){
  res.redirect("/notify");
})


app.post('/post-feedback', function (req, res) {

    mongodb.MongoClient.connect('mongodb://localhost:27017', (err, client) => {
        var db = client.db('test');
        delete req.body._id; // for safety reasons
        db.collection('data').insertOne(req.body);

    });

    console.log(JSON.stringify(req.body));
    res.sendFile(__dirname + "/public/html/successfulRegistration.html");
});

async function main() {
    try {
        cron.schedule('0 0 */6 * * *', async () => {
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


        datesArray.forEach(date =>{
            let ok = getSlotsForDate(date,userData[i]);

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
            'Host': 'cdn-api.co-vin.in',
            'Accept-Language': 'en_US',
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36'
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
    //console.log(validSlots[0]);
    let html=`<table style="border-collapse: collapse; width: 75%;">
    <thead style=" padding-top: 12px; padding-bottom: 12px; text-align: center; background-color: #009879; color: white; ">
        <th style="border: 1px solid #ddd; padding: 8px;">Centre Name</th>
        <th style="border: 1px solid #ddd; padding: 8px;">Vaccine</th>
        <th style="border: 1px solid #ddd; padding: 8px;">Address</th>
        <th style="border: 1px solid #ddd; padding: 8px;">PinCode</th>
        <th style="border: 1px solid #ddd; padding: 8px;">Date</th>
        <th style="border: 1px solid #ddd; padding: 8px;">Availability Dose 1</th>
        <th style="border: 1px solid #ddd; padding: 8px;">Availability Dose 2</th>
        <th style="border: 1px solid #ddd; padding: 8px;">Minimum Age</th>
        <th style="border: 1px solid #ddd; padding: 8px;">Fee Type</th>
    </thead>
    <tbody id='data-body'>`;



   for(let i=0;i<validSlots.length;i++){
     for(let j=0;j<validSlots[i].sessions.length;j++){
       if(validSlots[i].sessions[j].available_capacity===0)continue;
       html+=`<tr style=" padding-top: 12px; padding-bottom: 12px; text-align: center;">`;
       html+=`<td style="border: 1px solid #ddd; padding: 8px;">`+validSlots[i].name+`</td>`;
       html+=`<td style="border: 1px solid #ddd; padding: 8px;">`+validSlots[i].sessions[j].vaccine+`</td>`;
       html+=`<td style="border: 1px solid #ddd; padding: 8px;">`+validSlots[i].address+`</td>`;
       html+=`<td style="border: 1px solid #ddd; padding: 8px;">`+validSlots[i].pincode+`</td>`;
       html+=`<td style="border: 1px solid #ddd; padding: 8px;">`+validSlots[i].sessions[j].date+`</td>`;
       html+=`<td style="border: 1px solid #ddd; padding: 8px;">`+validSlots[i].sessions[j].available_capacity_dose1+`</td>`;
       html+=`<td style="border: 1px solid #ddd; padding: 8px;">`+validSlots[i].sessions[j].available_capacity_dose2+`</td>`;
       html+=`<td style="border: 1px solid #ddd; padding: 8px;">`+validSlots[i].sessions[j].min_age_limit+`</td>`;
       html+=`<td style="border: 1px solid #ddd; padding: 8px;">`+validSlots[i].fee_type+`</td>`;
       html+=`</tr>`;
     }
   }
   html+=`</tbody>;`
html+=`</table>`
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
        html: html


    };



        // text:'Following Slots are Available Right now! Please Book Fast otherwise it would be filled immediately\n' + slotDetails,


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
