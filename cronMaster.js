var CronJob = require('cron').CronJob;
var db = require('./db.js');
var ebayCaller = require('./ebayCaller.js').refinedSearch;
var Promise = require('bluebird');

const avgPriceFinder = (arr, condition) => {
  if (condition === 'good') {
    arr = arr.filter((elem) => {
      let quality = Number(elem.condition[0].conditionId[0])
     return  quality >= 3000 && quality < 7000;
    })
  } else {
    arr = arr.filter((elem) => {
      let quality = Number(elem.condition[0].conditionId[0])
      return quality <= 2999;
    })
  }
  let avg = arr.reduce(function(acc, cV, cI){ return acc + Number(cV.sellingStatus[0].convertedCurrentPrice[0].__value__)}, 0)/arr.length;
  return Math.round(avg * 100) / 100;
}

const grabEbayCron = new CronJob({
  cronTime: '30 * * * *',
  onTick: () => {
    console.log('fire');
    db.CronJob.find({})
      .then(result => {
        result.forEach((job) => {
          ebayCaller(job.searchQuery, job.categoryId)
            .then((ebayRes) => {
              ebayRes = ebayRes.filter((auction) => {
                return auction.sellingStatus[0].sellingState[0] === 'EndedWithSales';
              });
              const priceHistoryObject = new db.PriceHistoryObject({
                createdAt: Date.now(),
                avgGreatPrice: avgPriceFinder(ebayRes, 'great'),
                avgGoodPrice: avgPriceFinder(ebayRes, 'good')
              });
              job.priceHistory.push(priceHistoryObject);
              job.markModified('priceHistory');
              job.save((err) => {
                if (err) {
                  console.log(err);
                }
              });
            })
          })
      })
      .catch(err => {
        console.log(err)
      });
  },
  start: false,
  timeZone: 'America/Los_Angeles'
});


module.exports = {
  grabEbayCron
}
