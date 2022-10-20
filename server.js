const express = require("express");
const schedule = require("node-schedule");
const axios = require("axios");
require("dotenv").config();
const { getTime } = require("./converter.js");
const client = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const app = express();

const port = 3000;

let getDuration = schedule.scheduleJob("* * * * *", () => {
  // console.log(new Date().toISOString());

  let dateMs = Date.now();
  dateMs += 120000;
  let currentTime = new Date(dateMs).toISOString();

  var data = JSON.stringify({
    origin: {
      location: {
        latLng: {
          latitude: 39.361285641676815,
          longitude: -74.55458443778282,
        },
      },
    },
    destination: {
      location: {
        latLng: {
          latitude: 40.73930770087554,
          longitude: -74.17095539542098,
        },
      },
    },
    travelMode: "DRIVE",
    routingPreference: "TRAFFIC_AWARE",
    departureTime: currentTime,
    computeAlternativeRoutes: false,
    routeModifiers: {
      avoidTolls: false,
      avoidHighways: false,
      avoidFerries: false,
    },
    languageCode: "en-US",
    units: "IMPERIAL",
  });

  var config = {
    method: "post",
    url: `https://routes.googleapis.com/directions/v2:computeRoutes?key=${process.env.API_KEY}&fields=routes.duration`,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  axios(config)
    .then(function (response) {
      let timeRequired = getTime(response.data.routes[0].duration);
      client.messages
        .create({
          from: process.env.TWILIO_PHONE_NUMBER,
          to: '914-260-8474',
          body: timeRequired,
        })
        .then(() => {
          console.log("message created");
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch(function (error) {
      console.log(error);
    });
});

app.listen(port);
console.log(`listening on port - ${port}`);
