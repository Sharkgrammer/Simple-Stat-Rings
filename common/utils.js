// Add zero in front of numbers < 10
export function zeroPad(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

export function getHexTime() {
  let today = new Date();

  // * by 255 and divide by the max number to get a number in the range of 0 to 255.
  let seconds = today.getSeconds() * 255 / 59;
  let minutes = today.getMinutes() * 255 / 59;
  let hours = today.getHours() * 255 / 23;

  let min = 30;

  if (hours < min) hours = min;
  if (minutes < min) minutes = min;
  if (seconds < min) seconds = min;

  return "#" + toHex(hours) + toHex(minutes) + toHex(seconds);
}

export function toHex(num) {
  let hex = Number(parseInt(num)).toString(16);

  if (hex.length === 1) hex = "0" + hex;

  return hex;
}
