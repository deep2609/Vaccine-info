const covidURL = "https://api.apify.com/v2/key-value-stores/toDWvRj1JpTXiM8FF/records/LATEST?disableRedirect=true";

var totalCases = document.getElementById('totalCases');
var newCases = document.getElementById('newCases');
var totalDeaths = document.getElementById('totalDeaths');
var newDeaths = document.getElementById('newDeaths');
var recovered = document.getElementById('recovered');
var newRecovered = document.getElementById('newRecovered');
var update = document.getElementById('update');

var xValues = [];
var yValues = [];

fetch(covidURL).then(function (response) {
    if (response.status !== 200) {
        console.warn('Looks like there was a problem. Status Code: ' + response.status);
        return;
    }


    // Updating the Statistics on the Page 
    response.json().then(function (data) {

        var newInfected = 0;

        for (var i = 0; i < data.regionData.length; ++i) {
            xValues.push(data.regionData[i].region);
            yValues.push(Math.abs(data.regionData[i].activeCases));
            newInfected += Math.abs(data.regionData[i].newInfected);
        }
        // console.log(newInfected);


        totalCases.innerHTML = data['totalCases'];
        newCases.innerHTML = "(+" + data['activeCasesNew'] + ")";
        totalDeaths.innerHTML = data['deaths'];
        newDeaths.innerHTML = "(+" + data['deathsNew'] + ")";
        recovered.innerHTML = data['recovered'];
        newRecovered.innerHTML = "(+" + data['recoveredNew'] + ")";
        update.innerHTML = data['lastUpdatedAtApify'].substring(0, 10) + " : " + data['lastUpdatedAtApify'].substring(11, 19);

        // Plotting Pie Chart for Each States

        var barColors = ["#ffcccb", "#b91d47", "#00aba9", "#2b5797", "#e8c3b9", "#1e7145", "#feb24c", "#9ebcda", "#fa9fb5", "#2b8cbe", "#bdbdbd", "#edf8b1",
            "#fde0dd", "#fdae6b", "#c994c7", "#99ff33", "#2c7fb8", "#31a354", "#636363", "#9ebcda", "#ff0066", "#58508d", "#ff6361", "#00429d", "#ffffe0",
            "#ffbdcb", "#3751a4", "#ffcc99", "#5362ab", "#00429d", "#0066ff", "#ff00ff", "##cc0000", "#ffff00", "#800000", "#990099"

        ];

        new Chart("myChart", {
            type: "doughnut",
            data: {
                labels: xValues,
                datasets: [{
                    backgroundColor: barColors,
                    data: yValues
                }]
            },
            options: {
                title: {
                    display: true,
                    text: "Active Cases StateWise"
                },
                legend: {
                    display: false,
                }
            }
        });

    });
});


// Vacctination Pie Chart 


const vaccineURL = "https://covid.ourworldindata.org/data/owid-covid-data.json"

fetch(vaccineURL).then(function (response) {
    if (response.status !== 200) {
        console.warn('Looks like there was a problem. Status Code: ' + response.status);
        return;
    }
    response.json().then(function (data) {
        let len = data.IND.data.length;
        let peopleFullyVaccinated = data.IND.data[len - 2].people_fully_vaccinated;
        let totalVaccinated = data.IND.data[len - 2].total_vaccinations;

        var x1Values = ["Total Vaccinated" , "People Fully Vaccinated"];
        var y1Values = [totalVaccinated , peopleFullyVaccinated];
        var barColorsSet2 = ["#04CD00", "#2c7fb8"];
        new Chart("myChart1", {
            type: "doughnut",
            data: {
                labels: x1Values,
                datasets: [{
                    backgroundColor: barColorsSet2,
                    data: y1Values
                }]
            },
            options: {
                title: {
                    display: true,
                    text: "Vaccinations"
                },
                legend: {
                    display: false,
                }
            }
        });

    });
});

// Using News APIs for Displaying Latest News 

const API_KEY = "";

const URL = "https://gnews.io/api/v4/top-headlines?q=corona OR covid OR vaccine&lang=en&country=in&token=" + API_KEY;
const newsList = document.querySelector(".newsList");

fetch(URL).then(function (response) {
    if (response.status !== 200) {
        console.warn('Looks like there was a problem. Status Code: ' + response.status);
        return;
    }

    // Updating the News Headlines
    response.json().then(function (data) {

        var news = document.getElementById("relatednews");
        for (let i = 0; i < data.articles.length; i++) {
            let li = document.createElement('li');
            let a = document.createElement('a');
            a.setAttribute('href', data.articles[i].url);
            a.setAttribute('target', '_blank');
            a.textContent = data.articles[i].title;
            li.className += "news-heading";
            li.appendChild(a);
            newsList.appendChild(li);
        }
    });
});

