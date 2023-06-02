import * as document from "document";
import * as clock from "./simple/clock";
import * as activity from "./simple/activity";
import * as hrm from "./simple/hrm";

function getColourFromGoal() {
    let colour;

    switch (activity.getPrimaryGoal()) {
        case "steps":
            colour = "deepskyblue";
            break;
        case "calories":
            colour = "limegreen";
            break;
        case "distance":
            colour = "orange";
            break;
        case "elevationGain":
            colour = "magenta";
            break;
        case "activeZoneMinutes":
            colour = "gold";
            break;
        default:
            colour = "red";
            break;
    }

    return colour;
}

/**
 * Background colour code
 */
const background = document.getElementById("background");

function setBackgroundColour() {
    background.gradient.colors.c1 = getColourFromGoal();
}

setBackgroundColour();

const batteryRect = document.getElementById("batteryRect");

function showBatteryLevel(power) {
    const defaultX = 5;
    const maxBat = 55;

    let batteryLevel = power.battery;
    let isCharging = power.charging;

    if (isCharging) {
        batteryRect.style.fill = "#00FF00";
    } else {
        batteryRect.style.fill = batteryLevel > 20 ? getColourFromGoal() : "#FF0000";
    }

    let adjustedBat = Math.floor((batteryLevel / 100) * maxBat);

    batteryRect.width = adjustedBat;
    batteryRect.x = (defaultX + maxBat - adjustedBat)
}

/**
 * Datetime code
 */

const timeElem = document.getElementById("timeElem");
const dateElem = document.getElementById("dateElem");
const timeElem2 = document.getElementById("timeElem2");
const dateElem2 = document.getElementById("dateElem2");
const batteryElem = document.getElementById("batteryElem");
const batteryElem2 = document.getElementById("batteryElem2");

function clockCallback(data) {
    timeElem.text = timeElem2.text = data.time;
    dateElem.text = dateElem2.text = data.date;
    batteryElem.text = batteryElem2.text = data.power.battery + "%";

    // For if the user updates their goals
    setBackgroundColour();
    showBatteryLevel(data.power);
}

clock.initialize("minutes", "shortDate", clockCallback);

/**
 * STEPS, DISTANCE, AZM, CALORIES
 * Gets your current steps, and alters the arc based on your steps & steps goal.
 */

const stepsArc = document.getElementById("stepsArc");
const stepsText = document.getElementById("stepsText");

const distanceArc = document.getElementById("distanceArc");
const distanceText = document.getElementById("distanceText");

const AZMArc = document.getElementById("AZMArc");
const AZMText = document.getElementById("AZMText");

const caloriesArc = document.getElementById("caloriesArc");
const caloriesText = document.getElementById("caloriesText");

const floorsArc = document.getElementById("floorsArc");
const floorsText = document.getElementById("floorsText");

function activityCallback(data) {
    stepsText.text = data.steps.pretty;
    stepsArc.sweepAngle = (data.steps.raw / data.steps.goal) * 360;

    distanceText.text = data.distance.pretty;
    distanceArc.sweepAngle = (data.distance.raw / (data.distance.goal / 1000)) * 360;

    AZMText.text = data.activeMinutes.pretty;
    AZMArc.sweepAngle = (data.activeMinutes.raw / data.activeMinutes.goal) * 360;

    caloriesText.text = data.calories.pretty;
    caloriesArc.sweepAngle = (data.calories.raw / data.calories.goal) * 360;

    floorsText.text = data.elevationGain.pretty;
    floorsArc.sweepAngle = (data.elevationGain.raw / data.elevationGain.goal) * 360;
}

activity.initialize("seconds", activityCallback);

/**
 * Heart Rate code
 * Gets your current hr.
 */

const heartArc = document.getElementById("heartArc");
const heartText = document.getElementById("heartText");

function hrmCallback(data) {
    let hr = data.bpm;
    if (hr === null) hr = "--";

    if (heartText !== null) heartText.text = hr;

    if (hr === "--") {
        return
    }

    heartArc.sweepAngle = (hr / 220) * 360;
}

hrm.initialize(hrmCallback);

/**
 * Animation code
 */

const screen = document.getElementById("screen");
const clickable = document.getElementById("clickable");

let iconsShown = false;

clickable.addEventListener("click", (evt) => {
    if (iconsShown) {
        screen.animate("disable");
    } else {
        screen.animate("enable");
    }

    iconsShown = !iconsShown;
});