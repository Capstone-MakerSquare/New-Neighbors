'use strict';

var Q = require('q');
var getRequest = require('./getRequest.js');
var _ = require('underscore');
var keys;

if (process.env.PORT) {
  keys = {
    googleAPIKey: process.env.GOOGLE_KEY,
  }
} else {
  keys = require('../config/keys.js');
}


//-----------------------------------------------------------------------------------
//GET GeoData Demographics for a location
/*Input: Zip Codes for US location
  Output: Demographics object
*/
module.exports = function (zipCode) {
  var deferred = Q.defer();
  let geoData_path = 'https://azure.geodataservice.net/GeoDataService.svc/GetUSDemographics?$format=json&zipcode='
  let geoDataUrl = geoData_path + zipCode;

  //remove
  // console.log('geoDataUrl:', geoDataUrl);

  getRequest(geoDataUrl)
  .then(function (responseObj) {
    let demogObj = responseObj.d[0];
    //remove
    // console.log('getDemographics says: Response data fetched: ',demogObj);
    
    deferred.resolve(demogObj)


  }, function (errorMessage) {
    console.log(errorMessage);
    deferred.resolve(errorMessage);
  });

  return deferred.promise;
}



