const url = "https://covid.ourworldindata.org/data/owid-covid-data.json";

function convert(x) {
  x = x.toString();
  var lastThree = x.substring(x.length - 3);
  var otherNumbers = x.substring(0, x.length - 3);
  if (otherNumbers != '') {
    lastThree = ',' + lastThree;
  }
  var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
  return res;
}


fetch(url).then(function (response) {
  if (response.status !== 200) {
    console.warn('Looks like there was a problem. Status Code: ' + response.status);
    return;
  }
  response.json().then(function (data) {
    let len = data.IND.data.length;

    let peopleFullyVaccinated = data.IND.data[len - 2].people_fully_vaccinated;
    let totalVaccinated = data.IND.data[len - 2].total_vaccinations;
    let newVaccinations = data.IND.data[len - 2].new_vaccinations;

    let peopleFullyVaccinatedPrevious = data.IND.data[len - 3].people_fully_vaccinated;
    let totalVaccinatedPrevious = data.IND.data[len - 3].total_vaccinations;

    let updateDate = data.IND.data[len - 2].date;

    let currentDate = new Date();
    let date = currentDate.getDate();
    let month = currentDate.getMonth();
    let year = currentDate.getFullYear();
    let toAdd = "";
    if (month < 9) toAdd += '0';
    let curr = year + "-" + toAdd + (month + 1) + "-" + date;

    $('#newVaccinations').html(convert(newVaccinations));
    $('#totalVaccinated').html(convert(totalVaccinated) + "<br>(<span style='color: green'>+" + convert(totalVaccinated - totalVaccinatedPrevious) + ")</span>");
    $('#peopleFullyVaccinated').html(convert(peopleFullyVaccinated) + "<br>(<span style='color: green'>+" + convert(peopleFullyVaccinated - peopleFullyVaccinatedPrevious) + ")</span>");
    $('#updateDate').append(curr);

  });
});
