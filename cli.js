#!/usr/bin/env node

import minimist from 'minimist';
import fetch from 'node-fetch';
import moment from 'moment-timezone';

const args = minimist(process.argv.slice(2));



if (args.h) {
	console.log("Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE");
	console.log("	-h		    Show this help message and exit.");
	console.log("	-n, -s		Latitude: N positive; S negative.");
	console.log("	-e, -w		Longitude: E positive; W negative.");
	console.log("	-z		    Time zone: uses tz.guess() from moment-timezone by default.");
	console.log("	-d 0-6		Day to retrieve weather: 0 is today; defaults to 1.");
	console.log("	-j		    Echo pretty JSON from open-meteo API and exit.");
	process.exit(0);
}

const timezone = args.z || moment.tz.guess();
let latitude = args.n || -args.s;
let longitude = args.e || -args.w;

const response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=" + latitude + "&longitude=" + longitude + "&timezone=" + timezone+ "&daily=precipitation_hours");
const data = await response.json();
console.log(data);

if (args.j) {
	console.log(data);
	if (!latitude) {
		console.log("Latitude must be in range");
		process.exit(0);
	}
	if (!longitude) {
		console.log("Longitude must be in range.");
		process.exit(0);
	}
	process.exit(0);
}

const days = args.d;

if (data.daily.precipitation_hours[days] > 0) {
	console.log("You might need your galoshes");
} else {
	console.log("You will not need your galoshes");
}

if (days == 0) {
  console.log("today.");
} else if (days > 1) {
  console.log("in " + days + " days.");
} else {
  console.log("tomorrow.");
} 
