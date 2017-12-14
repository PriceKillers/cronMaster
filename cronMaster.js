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
  return avg;
}

const grabEbayCron = new CronJob({
  cronTime: '20 0 * * * * *',
  onTick: () => {
    db.CronJob.find({})
      .then(result => {
        result.forEach((job) => {
          ebayCaller(job.searchQuery, job.categoryId)
            .then((ebayRes) => {
              
              let priceHistoryObject = {
                createdAt: Date.now(),
                avgGreatPrice: avgPriceFinder(ebayRes, 'great'),
                avgGoodPrice: avgPriceFinder(ebayRes, 'good')
              }
              console.log(priceHistoryObject);
              job.priceHistory = job.priceHistory.push(priceHistoryObject);
              job.markModified('priceHistory');
              job.save((err) => {
                if (err) {
                  console.log(err);
                }
              });
              db.ProductAuctions.findOne({searchQuery: job.searchQuery,
                categoryId: job.categoryId})
                .then(product => {
                  let productDidChange = false;
                  ebayRes.forEach((auction) => {
                    if (!product.auctions) {
                      product.auctions = {}
                    }
                    if (!product.auctions[auction.itemId[0]]) {
                      product.auctions[auction.itemId[0]] = auction
                      productDidChange = true;
                    }
                  })
                  if (productDidChange) {
                    product.markModified('auctions');
                    product.save((err) => {
                      if (err) {
                        console.log(err);
                      }
                    })
                  }
                })
                .catch((err) => {
                  console.log(err)
                })
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
