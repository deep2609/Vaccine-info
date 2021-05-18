// Adding the Check Vaccine Availability Toggler Function

function togglefunction() {
  var divElement = document.querySelector('.search-toggle');
  if (divElement.style.display === "block") {
    divElement.style.display = "none";
  }
  else {
    divElement.style.display = "block";
  }
}



let pinButton = document.getElementById('pinButton');
let stateButton = document.getElementById('stateButton');

// "flag" Stores the current state (Pin - > 0 and State/District -> 1)
let flag = 0;

// Store the next 7 days starting from today as strings in the form dd-mm-yy
let dates = [];


// initialize the dates
function initializeDate() {
  dates = [];
  let currentDate = new Date();
  let date = currentDate.getDate();
  let month = currentDate.getMonth();
  let year = currentDate.getFullYear();

  let toAdd = "";
  if (month < 9) toAdd += '0';
  let curr = date + "-" + toAdd + (month + 1) + "-" + year;
  dates.push(curr);
  for (let i = 1; i <= 6; i++) {
    let tempDate = date + i;
    let tempMonth = month;
    let tempYear = year;
    if (month === 1) {
      if (year % 4 === 0 && year % 1000 !== 0 && tempDate >= 30) {
        tempDate -= 29;
        tempMonth++;
      } else if (tempDate >= 29) {
        tempDate -= 28;
        tempMonth++;
      }
    }
    else if (month === 11) {
      if (tempDate >= 32) {
        tempDate -= 31;
        tempMonth = 0;
        year++;
      }
    }
    else {
      if (month % 2 === 0) {
        if (tempDate >= 32) {
          tempDate -= 31;
          tempMonth++;
        }
      } else {
        if (tempDate >= 31) {
          tempDate -= 30;
          tempMonth++;
        }
      }
    }
    if (tempMonth < 9) toAdd = "0";
    else toAdd = "";
    curr = tempDate + "-" + toAdd + (tempMonth + 1) + "-" + tempYear;
    dates.push(curr);
  }
  for (let i = 0; i <= 6; i++) {
    let index = "#d-" + (i + 1);
    $(index).html(dates[i]);
  }
}


$("#selectByState").hide();
$("#availabilityOutput").hide();
pinButton.addEventListener("click", function () {
  $("#selectByPin").show();
  $('#selectByState').hide();
  $('#pinButton').removeClass('btn-light');
  $('#pinButton').addClass('btn-info');
  $('#stateButton').removeClass('btn-info');
  $('#stateButton').addClass('btn-light');
  flag = 0;
});


stateButton.addEventListener("click", function () {
  $("#selectByState").show();
  $("#selectByPin").hide();
  $('#stateButton').removeClass('btn-light');
  $('#stateButton').addClass('btn-info');
  $('#pinButton').removeClass('btn-info');
  $('#pinButton').addClass('btn-light');
  flag = 1;
});

checkAvailability.addEventListener("click", function () {
  $("#availabilityOutput").show();
});






let state = document.getElementById('state');
let district = document.getElementById('district');
let pin = document.getElementById('pin');
state.length = 0;

const stateurl = 'https://cdn-api.co-vin.in/api/v2/admin/location/states';
const districturl = 'https://cdn-api.co-vin.in/api/v2/admin/location/districts/';

//Adding the List of States

fetch(stateurl).then(function (response) {

  let defaultOption1 = document.createElement('option');
  defaultOption1.text = 'Choose State/Province';
  state.add(defaultOption1);

  if (response.status !== 200) {
    console.warn('Looks like there was a problem. Status Code: ' + response.status);
    return;
  }
  // Updating the Dropdown State List

  response.json().then(function (data) {

    let option;
    for (let i = 0; i < data.states.length; i++) {
      option = document.createElement('option');
      option.text = data.states[i].state_name;
      option.value = data.states[i].state_id;
      state.add(option);
    }
  });
});

// Changing the District List When User Selects the State

state.onchange = function () {

  district.length = 0;
  let defaultOption = document.createElement('option');
  defaultOption.text = 'Choose District';
  district.add(defaultOption);

  var e = document.getElementById("state");
  var value = e.options[e.selectedIndex].value;
  var text = e.options[e.selectedIndex].text;

  fetch(districturl + value).then(function (response) {

    if (response.status !== 200) {
      console.warn('Looks like there was a problem. Status Code: ' + response.status);
      return;
    }
    // Updating the Dropdown District List

    response.json().then(function (data) {

      let option;
      for (let i = 0; i < data.districts.length; i++) {
        option = document.createElement('option');
        option.text = data.districts[i].district_name;
        option.value = data.districts[i].district_id;
        district.add(option);
      }
    });
  });
}

// Getting the district id
let district_id;
district.onchange = function () {
  var e = document.getElementById("district");
  var value = e.options[e.selectedIndex].value;
  var text = e.options[e.selectedIndex].text;
  district_id = value;
}


// Deletes all the rows in the table from the previous searches

$('#checkAvailability').on('click', () => {
  $('#data-body').empty()
});


// printing the table

checkAvailability.addEventListener("click", function () {
  initializeDate();


  // flag -> 0 represents search by pin ////  flag-> 1 represents search by district
  if (flag === 0) {
    let pincode = $('#pin').val();

    let checkByPinURL = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=" + pincode + "&date=" + dates[0];

    fetch(checkByPinURL).then(function (response) {

      if (response.status !== 200) {
        console.warn('Looks like there was a problem. Status Code: ' + response.status);
        return;
      }

      response.json().then(function (data) {


        for (let i = 0; i < data.centers.length; i++) {

          // adding a row
          let addRow = "<tr>";
          addRow += "<td style='background:#f7a440;'><h5>" + data.centers[i].name + "</h5></td>";

          let tempData = [];
          for (let j = 0; j < data.centers[i].sessions.length; j++) {
            let currData = [];
            currData.push(JSON.stringify(data.centers[i].sessions[j].date));
            currData.push(JSON.stringify(data.centers[i].sessions[j].available_capacity));
            currData.push(JSON.stringify(data.centers[i].sessions[j].min_age_limit));
            currData.push(JSON.stringify(data.centers[i].sessions[j].vaccine));
            tempData.push(currData);
          }
          let idx = 0;


          for (let j = 0; j < 7; j++) {

            if (idx == tempData.length) {
              addRow += "<td>No Slots</td>";
            } else {
              if (tempData[idx][0].substring(1, tempData[idx][0].length - 1) == dates[j]) {
                if (tempData[idx][1] > 0) {
                  addRow += "<td style='background:#f9f871;'>Available Capacity : " + tempData[idx][1] + "<br>Min Age : " + tempData[idx][2] + "<br>Vaccine : " + tempData[idx][3] + "</td>";
                }
                else {
                  addRow += "<td>Available Capacity : " + tempData[idx][1] + "<br>Min Age : " + tempData[idx][2] + "<br>Vaccine : " + tempData[idx][3] + "</td>";
                }

                idx++;
              } else {
                addRow += "<td>No Slots</td>"
              }
            }
          }

          addRow += "</tr>";
          let tableBody = $("table tbody");
          tableBody.append(addRow);

        }
      });


    });
  }
  else {
    let checkByDistrictURL = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=" + district_id + "&date=" + dates[0];
    fetch(checkByDistrictURL).then(function (response) {

      if (response.status !== 200) {
        console.warn('Looks like there was a problem. Status Code: ' + response.status);
        return;
      }

      response.json().then(function (data) {



        for (let i = 0; i < data.centers.length; i++) {
          let addRow = "<tr>";
          addRow += "<td style='background:#f7a440;'><h5>" + data.centers[i].name + "</h5></td>";

          let tempData = [];
          for (let j = 0; j < data.centers[i].sessions.length; j++) {
            let currData = [];
            currData.push(JSON.stringify(data.centers[i].sessions[j].date));
            currData.push((data.centers[i].sessions[j].available_capacity));
            currData.push(JSON.stringify(data.centers[i].sessions[j].min_age_limit));
            currData.push(JSON.stringify(data.centers[i].sessions[j].vaccine));
            tempData.push(currData);
          }
          let idx = 0;

          for (let j = 0; j < 7; j++) {
            if (idx == tempData.length) {
              addRow += "<td>No Slots</td>";
            } else {
              if (tempData[idx][0].substring(1, tempData[idx][0].length - 1) == dates[j]) {
                console.log(typeof (tempData[idx][1]));
                console.log(tempData[idx][1] > 0);
                if (tempData[idx][1] > 0) {

                  addRow += "<td style='background:#f9f871;'>Available Capacity : " + tempData[idx][1] + "<br>Min Age : " + tempData[idx][2] + "<br>Vaccine : " + tempData[idx][3] + "</td>";
                }
                else {
                  addRow += "<td>Available Capacity : " + tempData[idx][1] + "<br>Min Age : " + tempData[idx][2] + "<br>Vaccine : " + tempData[idx][3] + "</td>";
                }
                idx++;
              } else {
                addRow += "<td>No Slots</td>"
              }
            }
          }

          addRow += "</tr>";
          let tableBody = $("#data-body");
          tableBody.append(addRow);

        }
      });

    });
  }
});
