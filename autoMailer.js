const CronJob = require('cron').CronJob;
const nodemailer = require('nodemailer');
const db = require('./db.js');
const Promise = require('bluebird');

const transporter = nodemailer.createTransport({
  service: 'Mailgun',
  host: 'smtp.mailgun.org',
  auth: {
    user: 'postmaster@info.consonare.io',
    pass: '40a2fc9deadd6abc548e2b08d169be87',
  }
});
// bbinder912@gmail.com, dyazhi@gmail.com

let mailOptions = {
  from: '"PriceKillers Notifications👨💻" <alertsatpricekiller@gmail.com>',
  to: '',
  subject: 'Reminder ⚙️',
  text: 'Hello world?',
  html: `
  <img src="https://s3-us-west-1.amazonaws.com/hackreactor27/pricekiller_logov1.png" alt="PriceKillers" width="236" height="56" /><br />
  <h1>Your Item Notifications!</h1>
  <p></p>
  `
}

let recentPriceList = [];
let tempUserList = [];
let subbedEmails = [];

const grabSubs = (arr) => {
  return arr.filter((user) => {
    return user.subscription
  });
}

const findSubs = () => {
  return new Promise((resolve, reject) => {
    db.User.find({})
      .then((users) => {
        tempUserList = grabSubs(users);
        resolve(tempUserList);
      });
  })
};


// transporter.sendMail(mailOptions, (error, info) => {
//   if (error) {
//     return console.log(error);
//   }
//   console.log('Message sent: %s', info.messageId);
//   console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
// })

let globalSubscription = () => {
  db.User.find({})
    .then((Users) => {
      return grabSubs(Users)
    }).then((subbedUsers) => {
      tempUserList = subbedUsers;
      db.CronJob.find({})
        .then((allItems) => {
          recentPriceList = allItems.reduce((acc, item) => {
            acc[item.searchQuery] = item.priceHistory[item.priceHistory.length-1];
            return acc
          }, {})
          return recentPriceList;
        }).then((recentPriceList) => {
          tempUserList.forEach((user) => {
            let current = user.email;
            console.log(`Hello ${current}, `)
            mailOptions.to = user.email;
            // for each user loop thru users favorites
              // reference by searchQuery
            mailOptions.text = `Hello ${user.email}`
            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                return console.log(error);
              }
              console.log('Message sent: %s', info.messageId);
              console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            })
            /*
            mailOptions.text `Hello {current}`
            */
          })
        })
      })
}
// globalSubscription();

let thresholdMailer = () => {
  findSubs();
  db.CronJob.find({})
    .then((items) => {
      recentPriceList = items.reduce((acc, item) => {
        acc[item.searchQuery] = item.priceHistory[item.priceHistory.length-1];
        return acc
      }, {});
      return recentPriceList;
    })
    .then((recentPriceList) => {
      tempUserList.forEach((user) => {
        user.notifications.forEach((item) => {
          if (recentPriceList[item.searchQuery]['avgGreatPrice'] > item.thresholdHigh || recentPriceList[item.searchQuery]['avgGoodPrice'] > item.thresholdHigh || recentPriceList[item.searchQuery]['avgGreatPrice'] < item.thresholdLow || recentPriceList[item.searchQuery]['avgGoodPrice'] < item.thresholdLow) {
            let current = user.email;
            console.log(`Hello ${current}, `)
            mailOptions.to = user.email;
            // for each user loop thru users favorites
              // reference by searchQuery
            mailOptions.text = `Hello ${user.email}`
            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                return console.log(error);
              }
              console.log('Message sent: %s', info.messageId);
              console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            })
          }
        })
      })
      return tempUserList
    })
    .then((tempUserList) => {
    })
}


const threshCronMailer = new CronJob({
  cronTime: '30 * * * *',
  onTick: () => {
    thresholdMailer()
  },
 start: false,
 timeZone: 'America/Los_Angeles'
});

module.exports = {
  threshCronMailer
}