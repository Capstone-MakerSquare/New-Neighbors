var Q = require('q');
var getRequest = require('./getRequest.js');
// var keys = require('./../config/keys.js');

var keys = {
  googleAPIKey: process.env.GOOGLE_KEY,
  zwsId: process.env.ZILLOW_KEY,
  instagramAccessToken: process.env.INSTAGRAM_KEY
}

//-----------------------------------------------------------------------------------
//GET the street address of a latitude/longitude pair
//Reverse Geocoding
/*
  Input: coordinates = {
            latitude :
            longitude :
          }
  Output: addressObj
*/

module.exports = function (coordinates) {
  var deferred = Q.defer();

  var geocodeUrl_latlng = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='
  var geocodeUrl_key = '&key=';

  var geocodeUrl = geocodeUrl_latlng + coordinates.latitude + ',' + coordinates.longitude + geocodeUrl_key + keys.googleAPIKey;

  //remove
  // console.log('reverseGeocodeUrl:',geocodeUrl);

  getRequest(geocodeUrl)
  .then(function (streetAddress) {
     // console.log('***********reverse Geocode**********');
     // console.log('streetAddress fetched.');
     // console.log('LatLng:',coordinates.latitude, coordinates.longitude);
     // console.log('Street Address:',streetAddress);

     if(streetAddress.status === 'OK') {
       var addressBits = streetAddress.results[0].formatted_address.split(', ');
       // console.log('Street address pieces:', addressBits);
       var addressObj = { formatted_address: streetAddress.results[0].formatted_address }

       var country = addressBits.pop();
       if(country === 'USA') {
         //standard format
         var stateZip = addressBits.pop().split(' ');
         var state = stateZip[0];
         var zip = stateZip[1];
         var city = addressBits.pop();

         addressObj.country = country;
         addressObj.state = state;
         addressObj.city = city;
         addressObj.zip = zip;
       }

       //remove
       // console.log('addressObj:',addressObj);

       deferred.resolve(addressObj);
       // return addressObj;

     }
     else {
       deferred.resolve({formatted_address : 'Not available'});
       // return {formatted_address : 'Not available'};

     }
  });
  // function (errorMessage) {
  //   // console.log('Error while fetching street address:',errorMessage);
  //   deferred.reject('Not Available');
  // });

  return deferred.promise;
}
