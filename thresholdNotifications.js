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

// we need to grab the thresholds for the user
  // and compare the avg price
  // then send them an email
  // set cron for every half hour

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

const grabUsers = () => {
  db.User.find({})
    .then((success) => {
      success.notifications
    })
}
const grabLast = (user) => {
  db.CronJob.findOne({})
    .then((success) => {
      var priceHistory = success.priceHistory;
      console.log(priceHistory[priceHistory.length-1]);
    })
}

grabLast();

const grabSubs = (arr) => {
  return arr.reduce((acc, cV, cI) => {
    if (cV.subscription === true) {
      return acc + cV.email + ' '
    }
  }, '').split(' ');
}

// transporter.sendMail(mailOptions, (error, info) => {
//   if (error) {
//     return console.log(error);
//   }
//   console.log('Message sent: %s', info.messageId);
//   console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
// })

let test = () => {
  db.User.find({})
    .then(res => {
      return grabSubs(res)
    }).then((success) => {
      for (let i = 0; i < success.length-1; i++) {
        let current = success[i];
        console.log(`Hello ${current}, `)
        mailOptions.to = success[i];
        mailOptions.text = `Hello ${success[i]}`
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
      }
    })
}
// test();

/*
let
*/


const autoCronMailer = new CronJob({
  cronTime: '*/10 * * * * *',
  onTick: () => {
    console.log('WOO');
  },
 start: false,
 timeZone: 'America/Los_Angeles'
});

module.exports = {
  autoCronMailer
}