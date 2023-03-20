const fetch15Min = 900;
const fetch1Day = 86400;

function getUrl(type) {
  return `${baseURLDynamic}/${year}/export?TYPE=${type}&L=${league_id}&JSON=1`;
}

const fetchParams = [
  ['rosters', getUrl('rosters'), fetch15Min],
  ['transactions', getUrl('transactions'), fetch15Min],
  ['assets', getUrl('assets'), fetch15Min],
  ['league', getUrl('league'), fetch1Day],
  ['leagueStandings', getUrl('leagueStandings'), fetch1Day]
];

const storedTime = JSON.parse(localStorage.getItem(`${league_name}_storedTime_${year}_${league_id}`)) || { fifteenMin: {}, oneDay: {} };

fetchParams.forEach(([type, url, interval]) => {
  const timeFrame = interval === fetch15Min ? 'fifteenMin' : 'oneDay';
  const storedTimestamp = storedTime[timeFrame][type];

  if (!storedTimestamp || currentServerTime - storedTimestamp >= interval) {
    fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        localStorage.setItem(`${league_name}_${type}_${year}_${league_id}`, JSON.stringify(data));

        // Update the stored timestamp for the current time frame
        storedTime[timeFrame][type] = currentServerTime;
        localStorage.setItem(`${league_name}_storedTime_${year}_${league_id}`, JSON.stringify(storedTime));
      })
      .catch(error => {
        console.error(`Error fetching data for ${type}:`, error);
      });
  } else {
    const remainingMinutes = Math.ceil((interval - (currentServerTime - storedTimestamp)) / 60);
    console.log(`Using cached data for ${type}. ${remainingMinutes} minute(s) until update.`);
    }
});
