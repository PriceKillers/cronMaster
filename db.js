const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
require('dotenv').config();

const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_SERVER}`;

mongoose.connect(uri, {
  useMongoClient: true,
  promiseLibrary: require('bluebird')
})
  .then(() => console.log('database connected'))
  .catch(err => {
    console.log(err);
  });

// mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_SERVER}`, {mongoUseClient: true});

// let db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//   console.log('connected to database');
// });

const Schema = mongoose.Schema;
//favoriteObject: {
//   searchQuery: String,
//   categoryId: Number,
//   favoriteIsCurrent: boolean
// }
//Historical Data
const CronJobSchema = new Schema({
  searchQuery: { type: String },
  categoryId: { type: Number },
  priceHistory: { type: Array, "default": [] } //Save function must include: `cronJob.markModified('priceHistory');`
});
//priceHistoryObject: {
//   createdAt: timestamp,
//   avgGreatPrice: Number,
//   avgGoodPrice: Number,
// }

const ProductAuctionsSchema = new Schema({
  searchQuery: { type: String },
  categoryId: { type: Number },
  auctions: {} //Save function must include: `productAuctions.markModified('auctions');`
});
//auctionsObjct: {
//   itemId1: auctionObject from ebay,
//   itemId2: auctionObject from ebay,
//   ...itemIdn: auctionObject from ebay
// }

const CronJob = mongoose.model('CronJob', CronJobSchema);
const ProductAuctions = mongoose.model('ProductAuctions', ProductAuctionsSchema);

module.exports.CronJob = CronJob;
module.exports.ProductAuctions = ProductAuctions;
// module.exports.Product = Product;