var Q = require('q');
var getRequest = require('./getRequest.js');
var keys = require('./../config/keys.js');
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

module.exports = function (searchInfo, neighborhood) {
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
  // deferred.resolve(['ZTO', 'ZTO', neighborhood]);

  // UNCOMMENT - ZILPY TEMPORARILY DISABLED
  //----------------------------------------------------------------------------
  getRequest(zilpyUrl)
  .then(function (zilpyData) {
     // console.log('Neighborhood fetched:',neighborhood);
     // console.log('Zilpy Data:',zilpyData);
     // console.log('************************');
    deferred.resolve([zilpyData.estimate, zilpyData.subjectPropertyUserEntry.propertyType, neighborhood]);
  }, function (errorMessage) {
    console.log('Error/server not responding.');
    console.log('errorMessage:', errorMessage);
    deferred.resolve(['N/A', 'N/A', neighborhood]);
  });

  return deferred.promise;
}