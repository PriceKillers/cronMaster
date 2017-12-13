var CronJob = require('cron').CronJob;


const grabEbayCron = new CronJob({
  cronTime: '1 * * * * * *',
  onTick: () => {
   console.log('grabEbayCron fire');
  },
  start: false,
  timeZone: 'America/Los_Angeles'
});


module.exports = {
  grabEbayCron
}
