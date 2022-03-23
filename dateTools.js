/**
 *
 * @param {Date} targetDate
 */
const buildTimeLeft = function (targetDate, launchDate) {
  let emotes = ["⬜", "⬛"];
  let currentDateMi = new Date().getTime();
  let target_dateMi = targetDate.getTime();
  let launch_dateMi = launchDate.getTime();

  let total_time = target_dateMi - launch_dateMi;
  let elasped_time = currentDateMi - launch_dateMi;
  let produit_croix = (elasped_time * 10) / total_time;
  Math.round(produit_croix);

  let finalText = "";
  let emotesLeft = 10 - produit_croix;

  for (let i = 2; i < produit_croix; i++) {
    finalText = finalText + emotes[0];
  }
  for (let i = 0; i < emotesLeft; i++) {
    finalText = finalText + emotes[1];
  }
  return finalText;
};

/**
 *
 * @param {Date} d
 */
const dateToString = function (d) {
  let finalText;
  finalText =
    d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear() + " ";
  let hours, minutes;
  hours = d.getHours();
  minutes = d.getMinutes();
  if (hours === 0) hours = "00";
  if (minutes === 0) minutes = "00";

  finalText = finalText + hours + "h" + minutes;

  return finalText;
};

const timeLeft = function (target_mi) {
  let current_mi = new Date().getTime();
  let different = new Date().getTimezoneOffset();
  let left_s = target_mi - current_mi;
  left_s = left_s + different * 60 * 1000;
  let textTimeLeft = left_s + "s";
  if (left_s >= 6.048 * 10 ** 8) {
    textTimeLeft =
      " " +
      Math.round((left_s / (6.048 * 10 ** 8)) * 10) / 10 +
      " week(s) remaining";
  } else if (left_s >= 8.64 * 10 ** 7) {
    textTimeLeft =
      " " +
      Math.round((left_s / (8.64 * 10 ** 7)) * 10) / 10 +
      " day(s) remaining";
  } else {
    let d = new Date(left_s);
    textTimeLeft =
      " " +
      d.getHours() +
      " h " +
      d.getMinutes() +
      " min " +
      d.getSeconds() +
      " sec remaining";
  }

  return textTimeLeft;
};

exports.buildTimeLeft = buildTimeLeft;
exports.dateToString = dateToString;
exports.timeLeft = timeLeft;
