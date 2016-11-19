var Q = require('q');
var getRequest = require('./getRequest.js');
var _ = require('underscore');
var keys;

if (process.env.PORT) {
  keys = {
    googleAPIKey: process.env.GOOGLE_KEY,
    quandlAPIKey: process.env.QUANDL_KEY,
  }
} else {
  keys = require('../config/keys.js');
}


//-----------------------------------------------------------------------------------
//GET Quandl rental and house prices for a location
/*Input: Zip Codes for US location, type of price wanted
  Output: Demographics object
*/
module.exports = function (zipCode, searchType) {
  var deferred = Q.defer();

  let searchPath = '';

  if (searchType.buyOrRent === 'rent') {
    searchPath = '_RZSF'
  } else {

    switch(searchType.bedrooms) {
      case 1:
          searchPath = '_1B';
          break;
      case 2:
          searchPath = '_2B';
          break;    
      case 3:
          searchPath = '_3B';
          break;
      case 4:
          searchPath = '_4B';
          break;
      case 5:
          searchPath = '_5B';
          break;
      case 6:
          searchPath = '_MSP';
          break;
      case 7:
          searchPath = '_C';
          break;
      default:
          return "Search input was bad";
    }
  }

  let price_path = 'http://www.quandl.com/api/v3/datasets/ZILL/Z'
  let price_params = '.json?rows=1&api_key='
  let quandlPriceUrl = price_path + zipCode + searchPath + price_params + keys.quandlAPIKey;

  //remove
  console.log('quandlPriceUrl:', quandlPriceUrl);

  getRequest(quandlPriceUrl)
  .then(function (responseObj) {
    let price = responseObj.dataset.data[0][1];
    //remove
    console.log('getPrice says: Response data fetched: ',price);
    
    deferred.resolve(price)

  }, function (errorMessage) {
    console.log(errorMessage);
    deferred.resolve(errorMessage);
  });

  return deferred.promise;
}



