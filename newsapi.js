const API_KEY = "";

const URL = "https://gnews.io/api/v4/top-headlines?q=corona OR covid OR Vaccine&lang=en&country=in&token=" + API_KEY;
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
