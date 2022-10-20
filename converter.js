module.exports.getTime = function(APIResult) {
  const secondsToTime = function(timeInSeconds) {
    const timeInMinutes = Math.floor(timeInSeconds / 60);
    const numberOfMinutes = timeInMinutes % 60;
    const numberOfHours = Math.floor(timeInMinutes / 60);
    const hourText = numberOfHours === 1 ? 'hour' : 'hours';
    const minuteText = numberOfMinutes === 1 ? 'minute' : 'minutes';
    return `Time to destination: ${numberOfHours} ${hourText} and ${numberOfMinutes} ${minuteText}`;
  }
  const getNumberOfSeconds = function(returnTime) {
    delete returnTime[returnTime.length - 1];
    return parseInt(returnTime);
  }

  const timeInSeconds = getNumberOfSeconds(APIResult);
  return secondsToTime(timeInSeconds);

}
