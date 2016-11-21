var Q = require('q');
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
//GET Google pictures that are location specific
/*Input: Picture references from a Google Places Details Search
  Output: imagesArray with links
*/
module.exports = function (picRefsArr, neighborhoodName) {
  var deferred = Q.defer();
  let photoMaxWidth = 150;
  let photoMaxHeight = 400;  // use this or maxWidth, not both
  let numPics = picRefsArr.length
  let imagesArray = [];
  let numEvents = 0;

  let placePhoto_path = 'https://maps.googleapis.com/maps/api/place/photo?';
  let placePhoto_ref = 'photoreference=';
  let placePhoto_maxWidth = '&maxwidth=' + photoMaxWidth;
  let placePhoto_maxHeight = '&maxheight=' + photoMaxHeight; // use this or maxWidth, not both
  let placePhoto_key = '&key=' + keys.googleAPIKey;

  for(let i=0; i<numPics; i++) {
    let picRef = picRefsArr[i];
    let placePhotoUrl = placePhoto_path + placePhoto_ref + picRef.photo_reference + placePhoto_key + placePhoto_maxHeight;
    numEvents++;

    imagesArray.push({
      name: neighborhoodName,
      image: placePhotoUrl,
      userLink: picRef.html_attributions,
      nativeWidth: picRef.width,
      nativeHeight: picRef.height
    });

    if (numEvents === numPics) {
      deferred.resolve(imagesArray);
    }

  }

  return deferred.promise;
}



