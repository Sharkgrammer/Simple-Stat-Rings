/*
  A simple clock which renders the current time and date in a digital format.
  Callback should be used to update your UI.
*/
import clock from "clock";
import { preferences } from "user-settings";

import { days, months, monthsShort } from "./locales/en.js";
import * as util from "./utils";
import { battery, charger } from "power";

let dateFormat, clockCallback;

export function initialize(granularity, dateFormatString, callback) {
  dateFormat = dateFormatString;
  clock.granularity = granularity;
  clockCallback = callback;
  clock.addEventListener("tick", tickHandler);
}

function tickHandler(evt) {
  let today = evt.date;
  let dayName = days[today.getDay()];
  let month = util.zeroPad(today.getMonth() + 1);
  let monthName = months[today.getMonth()];
  let monthNameShort = monthsShort[today.getMonth()];
  let dayNumber = util.zeroPad(today.getDate());

  let hours = today.getHours();
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
  } else {
    // 24h format
    hours = util.zeroPad(hours);
  }
  let mins = util.zeroPad(today.getMinutes());

  let timeString = `${hours}:${mins}`;
  let dateString = today;

  switch(dateFormat) {
    case "shortDate":
      dateString = `${monthNameShort} ${dayNumber}`;
      break;
    case "mediumDate":
      dateString = `${dayNumber} ${monthName}`;
      break;
    case "longDate":
      dateString = `${monthName} ${dayNumber}`;
      break;
  }

  // Use the power api to get battery level
  let batNum = Math.floor(battery.chargeLevel);
  let isCharging = charger.connected;
  let power = {battery: batNum, charging: isCharging};

  clockCallback({time: timeString, date: dateString, power: power});
}
