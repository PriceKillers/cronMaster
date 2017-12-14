const express = require('express');
const axios = require('axios');
const Promise = require('bluebird');

function refinedSearch(searchQuery, categoryId) {
  const keywords = searchQuery.split(' ').join('%20');
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url: `http://svcs.ebay.com/services/search/FindingService/v1?service-version=1.13.0&security-appname=${process.env.EBAYAPIKEY}&OPERATION-NAME=findCompletedItems&keywords=${keywords}&ItemSort=BestMatch&response-data-format=JSON&categoryId=${categoryId}`
    })
    .then((response) => {
      //const error = response.data.findCompletedItemsResponse[0].errorMessage[0].error[0];
      const results = response.data.findCompletedItemsResponse[0].searchResult[0].item;
      //console.log(results);
      resolve(results)
    })
    .catch((err) => console.log('error: ', reject(err)));
  })
}

module.exports.refinedSearch = refinedSearch;
