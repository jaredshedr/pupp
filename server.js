const express = require("express");
const schedule = require("node-schedule");
const axios = require("axios");
require("dotenv").config();


const app = express();

const port = 3000;

let getDuration = schedule.scheduleJob("30 11 * * MON-FRI", async () => {

  let catUrl = 'https://catfact.ninja/fact?max_length=140'
  let catFact;

  await axios.get(catUrl)
  .then(response => {
    console.log('Cat: ', response.data.fact);
    catFact = response.data.fact
  })
  .catch(error => {
    console.error('Error:', error.response ? error.response.data : error.message);
  });

  console.log(catFact)


  if (catFact !== 'undefined') {

    let toPhoneNumbers = ['12017478033', '12017059630', '14434627841', '18566251242', '19142608474']

    for (let number of toPhoneNumbers) {

      var settings = {
        "url": "https://2vxk8l.api.infobip.com/sms/2/text/advanced",
        "method": "POST",
        "timeout": 0,
        "data": {
            "messages": [
                {
                    "destinations": [
                        {
                            "to": number
                        }
                    ],
                    "from": "InfoSMS",
                    "text": `This is a Cat Fact from Jared : ${catFact}`
                }
            ]
        },
      };
      var headers = {
        "Authorization": "App 750a17b4ae63f049264437da384bf871-aa382734-5f44-483f-b093-4fae706c6e5b",
        "Content-Type": "application/json",
        "Accept": "application/json"
      }

      axios.post(settings.url, settings.data, { headers })
      .then(response => {
        console.log('SMS sent successfully!', response.data);
      })
      .catch(error => {
        console.error('Error sending SMS:', error.response ? error.response.data : error.message);
      });
    }
  }







  // let dateMs = Date.now();
  // dateMs += 120000;
  // let currentTime = new Date(dateMs).toISOString();

  // var data = JSON.stringify({
  //   origin: {
  //     location: {
  //       latLng: {
  //         latitude: 39.361285641676815,
  //         longitude: -74.55458443778282,
  //       },
  //     },
  //   },
  //   destination: {
  //     location: {
  //       latLng: {
  //         latitude: 40.73930770087554,
  //         longitude: -74.17095539542098,
  //       },
  //     },
  //   },
  //   travelMode: "DRIVE",
  //   routingPreference: "TRAFFIC_AWARE",
  //   departureTime: currentTime,
  //   computeAlternativeRoutes: false,
  //   routeModifiers: {
  //     avoidTolls: false,
  //     avoidHighways: false,
  //     avoidFerries: false,
  //   },
  //   languageCode: "en-US",
  //   units: "IMPERIAL",
  // });

  // var config = {
  //   method: "post",
  //   url: `https://routes.googleapis.com/directions/v2:computeRoutes?key=${process.env.API_KEY}&fields=routes.duration`,
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   data: data,
  // };

  // axios(config)
  //   .then(function (response) {
  //     let timeRequired = getTime(response.data.routes[0].duration);
  //     client.messages
  //       .create({
  //         from: process.env.TWILIO_PHONE_NUMBER,
  //         to: '914-260-8474',
  //         body: timeRequired,
  //       })
  //       .then(() => {
  //         console.log("message created");
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   })
  //   .catch(function (error) {
  //     console.log(error);
  //   });
});

app.listen(port);
console.log(`listening on port - ${port}`);
