# 💉 Vaccine-Info

Vaccine-Info is a maintained Project made by **[Pranshu Kashyap](https://github.com/pranshukas)** and **[Souradip Mandal](https://github.com/deep2609)**. It uses Cowin API's to fetch Real-time Vaccine Slots Available in Pin Code or Districts and displays to users. Additionally, it has another great Functionality Vaccine-Notifier. Users can subscribe in case vaccine is not available, and it will check and automatically send Emails whenever new slots are available in the nearest area. Additionally, we have also added a webpage that displays real-time Covid-19 Cases (Fetched using API's) and details of Vaccines available and Breaking News Related to Covid and Vaccinations. 

We have used node-cron for scheduling tasks and node-mailer for Sending Emails. MongoDB was used to Store User Data. Cowin API's are used for fetching real-time Vaccine slots. Chart.js was used for plotting Doughnut Pie Charts and NewsAPIs were used for getting News Headlines related to Covid. 

## Contributors 

<a href="https://github.com/pranshukas/vaccine-info/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=pranshukas/vaccine-info" />
</a>

## Table of Content 

* [Deployment](#deployment)
* [Tools and Technologies Used](#tools-and-technologies-used)
* [Usage](#usage)
* [Installation](#installation)
* [Contribution](#contribution)
* [License](#license)
* [Screenshots Of Pages](#screenshots-of-pages)

## Deployment 

[![Website https://vaccine-info-2021.herokuapp.com/](https://img.shields.io/website-up-down-green-red/https/naereen.github.io.svg)](https://vaccine-info-2021.herokuapp.com/)

Deployed Website (on Heroku): https://vaccine-info-2021.herokuapp.com/

<h4>Succesful Email Sent!</h4>

![Successful Image](public/assets/images/successful-email.png)

<h4>Notify Page (Simple UI)</h4>

![Notify Page](public/assets/images/notify.png)
<!-- <img src="public/assets/images/notify.png" alt="noftifer" width="700" height="800"> -->

## Tools and Technologies Used

#### Front-End <br/><br/>

<p>
    <img src="public/assets/Tool%20and%20Technologies%20Used/html5.svg" alt="html5" width="80" height="80">&nbsp;&nbsp;&nbsp;
    <img src="public/assets/Tool%20and%20Technologies%20Used/css3.svg" alt="css3" width="80" height="80">&nbsp;&nbsp;&nbsp;
    <img src="public/assets/Tool%20and%20Technologies%20Used/bootstrap.svg" alt="bootstrap" width="80" height="80">&nbsp;&nbsp;&nbsp;
    <img src="public/assets/Tool%20and%20Technologies%20Used/js.png" alt="javascript" width="80" height="80">&nbsp;&nbsp;&nbsp;
    <img src="public/assets/Tool%20and%20Technologies%20Used/jquery.svg" alt="jquery" width="80" height="80">&nbsp;&nbsp;&nbsp;
    <img src="public/assets/Tool%20and%20Technologies%20Used/chartjs.svg" alt="chartjs" width="80" height="80">&nbsp;&nbsp;&nbsp;
 </p>
 
 #### Back-End <br/>
 
 <p>
    <img src="public/assets/Tool%20and%20Technologies%20Used/nodejs.svg" alt="nodejs" width="80" height="80">&nbsp;&nbsp;&nbsp;
    <img src="public/assets/Tool%20and%20Technologies%20Used/express.svg" alt="express" width="80" height="80">&nbsp;&nbsp;&nbsp;
    <img src="public/assets/Tool%20and%20Technologies%20Used/mongodb.svg" alt="mongodb" width="80" height="80">&nbsp;&nbsp;&nbsp;
 </p>
 
 #### Deployment and Miscellaneous Tools Used <br/><br/>
 
 <p>
    <img src="public/assets/Tool%20and%20Technologies%20Used/heroku.svg" alt="heroku" width="80" height="80">&nbsp;&nbsp;&nbsp;
    <img src="public/assets/Tool%20and%20Technologies%20Used/amazon-aws.svg" alt="amazon-aws" width="80" height="80">&nbsp;&nbsp;&nbsp;
    <img src="public/assets/Tool%20and%20Technologies%20Used/git.svg" alt="git" width="80" height="80">&nbsp;&nbsp;&nbsp;
    <img src="https://cdns.iconmonstr.com/wp-content/assets/preview/2012/240/iconmonstr-github-1.png" alt="github" width="80" height="80">
</p>


## Usage

Make changes to API in newapi.js for using the NewsAPIs. Update Your Password and Email Id in .env file. Update the MongoDB Atlas Path for using MongoDB and storing Users' data (can update acc. to your need if want to store on local work system). 


## Installation

1. Run `npm install`
2. Dependencies are `express body-parser request nodemailer node-cron moment path mongodb https dotenv`
3. Now run on Local Host use `node app.js`
4. Open `http://localhost:3000/` to view the Document

## Contribution

The Project is open to Contribution for making it more better in terms of design, functionality, and reaches more people. UI is kept simple for now but needs to be improved. For lower screens responsiveness needed to be made better. 

😃 Feel free to Reach out to us! **[Pranshu Kashyap](https://github.com/pranshukas)** **[Souradip Mandal](https://github.com/deep2609)** 


## License

![License](https://img.shields.io/badge/license-MIT%20License-blue.svg)

This project is licensed under the MIT License.

Copyright (c) 2021 Vaccine Info

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Screenshots Of Pages

![Successful Image](public/assets/images/cover.png)
![Successful Image](public/assets/images/info-page.png)
