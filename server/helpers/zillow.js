var Q = require('q');
var getXmlRequest = require('./getXmlRequest.js');
// var keys = require('./../config/keys.js');

var keys = {
  googleAPIKey: process.env.GOOGLE_KEY,
  zwsId: process.env.ZILLOW_KEY,
  instagramAccessToken: process.env.INSTAGRAM_KEY
}

//-----------------------------------------------------------------------------------
//GET demography information for a neighborhood and a city from Zillow
/*Input: neighborhood, city
  Output: demographyObj
*/
module.exports = function (neighborhood, city) {
  var deferred = Q.defer();

  var zwsId = keys.zwsId;
  var zillowUrl_zwsId = 'http://www.zillow.com/webservice/GetDemographics.htm?zws-id='
  var zillowUrl_neighborhood = '&neighborhood='
  var zillowUrl_city = '&city=';

  var zillowUrl = zillowUrl_zwsId + zwsId + zillowUrl_neighborhood + neighborhood + zillowUrl_city + city;

  //remove
  // console.log('ZillowUrl:', zillowUrl);

  getXmlRequest(zillowUrl)
  .then(function (responseObj) {
    // console.log('Response Object:', responseObj);
    if(responseObj['Demographics:demographics'].response) { deferred.resolve(responseObj['Demographics:demographics'].response[0]); }
    else { deferred.resolve({ message: 'Call Limits Exceeded for the day :/'}); }
  });

  return deferred.promise;
}
