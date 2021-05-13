const url = "https://covid.ourworldindata.org/data/owid-covid-data.json"

fetch(url).then(function(response){
  if (response.status !== 200) {
    console.warn('Looks like there was a problem. Status Code: ' + response.status);
    return;
  }
  response.json().then(function(data){
       let len = data.IND.data.length;


       let peopleFullyVaccinated = data.IND.data[len-2].people_fully_vaccinated;
       let totalVaccinated = data.IND.data[len-2].total_vaccinations;
       let newVaccinations = data.IND.data[len-2].new_vaccinations;

       let peopleFullyVaccinatedPrevious = data.IND.data[len-3].people_fully_vaccinated;
       let totalVaccinatedPrevious = data.IND.data[len-3].total_vaccinations;

       let addContent1 = "<h4 style='color:green;'>"+newVaccinations+"</h4><br><h4>New Vaccinations</h4>";
       let addContent2 = "<h4>"+totalVaccinated+"</h4>"+"<h4 style='color:green;'>"+"(+"+(totalVaccinated-totalVaccinatedPrevious)+")</h4><br><h4>Total Vaccinated</h4>";
       let addContent3 = "<h4>"+peopleFullyVaccinated+"</h4>"+"<h4 style='color:green;'>(+"+(peopleFullyVaccinated-peopleFullyVaccinatedPrevious)+")</h4><br><h4 >Fully Vaccinated</h4>";

       let updateDate = data.IND.data[len-2].date;
       let addContent4 = "<center><h5>Last Updated : "+updateDate+"</h5></center>";
       $('#newVaccinations').append(addContent1);
       $('#totalVaccinated').append(addContent2);
       $('#peopleFullyVaccinated').append(addContent3);
       $('#updateDate').append(addContent4);

  });
});
