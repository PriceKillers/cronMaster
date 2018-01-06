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

const UserSchema = new Schema({
  username: { type: String },
  favorites: { type: Array,  "default" : [] },//Save function must include: `user.markModified('favorites');`
  email: { type: String },  //depends on OAuth
  subscription: { type: Boolean },
  picture: { type: String },
  notifications: [
    new Schema ({
      searchQuery: { type: String },
      categoryId: { type: Number },
      thresholdLow: { type: Number },
      thresholdHigh: { type: Number }
    })
  ]
});

//favoriteObject: {
//   searchQuery: String,
//   categoryId: Number,
//   favoriteIsCurrent: boolean
// }

const PriceHistoryObjectSchema = new Schema({
  createdAt: Date,
  avgGreatPrice: Number, //Change average function to round to nearest cent
  avgGoodPrice: Number
});
//priceHistoryObject: {
//   createdAt: timestamp,
//   avgGreatPrice: Number,
//   avgGoodPrice: Number,
// }

//Historical Data
const CronJobSchema = new Schema({
  searchQuery: { type: String },
  categoryId: { type: Number },
  priceHistory: [PriceHistoryObjectSchema] //Save function must include: `cronJob.markModified('priceHistory');`
});

const notificationSchema = new Schema({
  searchQuery: { type: String },
  categoryId: { type: Number },
  threshold: { type: Number },
  notificationsPref: { type: Boolean }
})

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

const User = mongoose.model('User', UserSchema);
const CronJob = mongoose.model('CronJob', CronJobSchema);
const PriceHistoryObject = mongoose.model('PriceHistoryObject', PriceHistoryObjectSchema);
const ProductAuctions = mongoose.model('ProductAuctions', ProductAuctionsSchema);



module.exports.User = User;
module.exports.CronJob = CronJob;
module.exports.PriceHistoryObject = PriceHistoryObject;
module.exports.ProductAuctions = ProductAuctions;
// module.exports.Product = Product;