let state = document.getElementById('state');
let district = document.getElementById('district');
let pin = document.getElementById('pin');
state.length = 0;


const stateurl = 'https://cdn-api.co-vin.in/api/v2/admin/location/states';
const districturl = 'https://cdn-api.co-vin.in/api/v2/admin/location/districts/';

//Adding the List of States

fetch(stateurl).then(function (response) {

    // Emptying The Responses of States 

    let defaultOption1 = document.createElement('option');
    defaultOption1.text = 'Choose State/Province';
    state.add(defaultOption1);

    // Emptying The Responses of Districts 
    
    district.length = 0;
    let defaultOptionDistrict = document.createElement('option');
    defaultOptionDistrict.text = 'Choose District';
    district.add(defaultOptionDistrict);

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