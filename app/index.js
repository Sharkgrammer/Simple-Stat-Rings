import * as document from "document";
import * as clock from "./simple/clock";
import * as activity from "./simple/activity";
import * as hrm from "./simple/hrm";

/**
 * Background colour code
 */
const background = document.getElementById("background");

function setBackgroundColour() {
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

    background.gradient.colors.c1 = colour;
}

setBackgroundColour();

/**
 * Datetime code
 */

const timeElem = document.getElementById("timeElem");
const dateElem = document.getElementById("dateElem");
const timeElem2 = document.getElementById("timeElem2");
const dateElem2 = document.getElementById("dateElem2");

function clockCallback(data) {
    timeElem.text = timeElem2.text = data.time;
    dateElem.text = dateElem2.text = data.date;
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
let iconsShown = false, texts = [AZMText, caloriesText, floorsText, heartText, stepsText, distanceText]

screen.addEventListener("click", (evt) => {
    let visibility = "hidden";

    if (iconsShown) {
        screen.animate("disable");
        visibility = "visible";
    } else {
        screen.animate("enable");
    }

    for (let i = 0; i < texts.length; i++) {
        texts[i].style.visibility = visibility;
    }

    iconsShown = !iconsShown;
});