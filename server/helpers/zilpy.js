var Q = require('q');
var getRequest = require('./getRequest.js');
// var keys = require('./../config/keys.js');

var keys = {
  googleAPIKey: process.env.GOOGLE_KEY,
  zwsId: process.env.ZILLOW_KEY,
  instagramAccessToken: process.env.INSTAGRAM_KEY
}
//-----------------------------------------------------------------------------------
//GET Rent estimate High/Low
/*Prerequisites:
  Street Address, Bedrooms, Bathrooms
  Website: zilpy.com

  Input: searchInfo = {
          address:
          bedrooms:
          bathrooms:
        }
  Output: zilpyData object
*/

module.exports = function (searchInfo) {
  var deferred = Q.defer();

  /* Possible values for ptype:
      single_family_house
      apartment_condo
      town_house
  */

  var zilpyUrl_address = 'http://api-stage.zilpy.com/property/-/rent/newreport?addr='
  var zilpyUrl_bedrooms = '&ptype=apartment_condo&bdr='              //default to apartment_condos
  var zilpyUrl_bathrooms = '&ba=';

  var zilpyUrl = zilpyUrl_address + searchInfo.address + zilpyUrl_bedrooms + searchInfo.bedrooms + zilpyUrl_bathrooms + searchInfo.bathrooms;

  //remove
  // deferred.resolve(['ZTO', 'ZTO']);
  console.log('zilpyUrl:', zilpyUrl);

  // UNCOMMENT - ZILPY TEMPORARILY DISABLED
  //----------------------------------------------------------------------------
  getRequest(zilpyUrl)
  .then(function (zilpyData) {
     // console.log('Zilpy Data:',zilpyData);
     console.log('************************');
    deferred.resolve([zilpyData.estimate, zilpyData.subjectPropertyUserEntry.propertyType]);
  }, function (errorMessage) {
    console.log('Error/server not responding.');
    console.log('errorMessage:', errorMessage);
    deferred.resolve(['N/A', 'N/A']);
  });

  return deferred.promise;
}
