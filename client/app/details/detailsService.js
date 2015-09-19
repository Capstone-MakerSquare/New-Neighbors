details
.factory('Details', function () {

  var neighborhoodDetailsObj;
  var currentNeighborhood;
  var currentMarkers = [];
  var neighborhoodMarkers = [];

  var serviceDict = {
    airport: [],
    atm: [],
    bank: [],
    bar: [],
    book_store: [],
    cafe: [],
    car_rental: [],
    convenience_store: [],
    fire_station: [],
    gas_station: [],
    grocery_or_supermarket: [],
    gym: [],
    hospital: [],
    laundry: [],
    library: [],
    pharmacy: [],
    police: [],
    post_office: [],
    restaurant: [],
    school: [],
    store: [],
    subway_station: [],
    train_station: [],
    veterinary_care: []
  };

  var attractionDict = {
    amusement_park: [],
    aquarium: [],
    art_gallery: [],
    bowling_alley: [],
    casino: [],
    movie_theatre: [],
    museum: [],
    night_club: [],
    park: [],
    shopping_mall: [],
    stadium: [],
    spa: [],
    university: [],
    zoo: []
  };

  var amenitiesIcons = {
    airport: [],
    atm: [],
    bank: [],
    bar: [],
    book_store: [],
    cafe: [],
    car_rental: [],
    convenience_store: [],
    fire_station: [],
    gas_station: [],
    grocery_or_supermarket: [],
    gym: [],
    hospital: [],
    laundry: [],
    library: [],
    pharmacy: [],
    police: [],
    post_office: [],
    restaurant: [],
    school: [],
    store: [],
    subway_station: [],
    train_station: [],
    veterinary_care: []
  }

  // var getAmenitiesIcon = function(amenity) {
  //   return './assets/images/Amenities/'+amenity.displayName+'.png';
  // }


  //----------------------------------------------------------------------------------
  //Creates objects that can be displayed in the amenities and attractions sections.
  //The dictionary argument determines which category it applies to

  var createPlacesObj = function (neighborhoodArr, dictionary) {
    var results = {};
    var spots;
    neighborhoodArr = neighborhoodArr || [];
    var thisType = '';
    var thisHoodObj;

    for (var i = 0; i < neighborhoodArr.length; i++) {
      thisHoodObj = {};
      spots = neighborhoodArr[i].amenities_attractions;

      for (var place in spots) {
        if (spots[place].types && Array.isArray(spots[place].types)) {
          for (var j = 0; j < spots[place].types.length; j++){

            thisType = spots[place].types[j];
            if (dictionary[thisType]) {

              if (!thisHoodObj[thisType]) {
                thisHoodObj[thisType] = []
              }
              thisHoodObj[thisType].push(JSON.parse(JSON.stringify(spots[place])));
              thisHoodObj[thisType][0].type = thisType
            }
          }
        }
      }
      if(neighborhoodArr[i].name==='Downtown') {
        neighborhoodArr[i].name = neighborhoodArr[i].name + ' ' + neighborhoodArr[i].city;
      }
      results[neighborhoodArr[i].name] = thisHoodObj;
    }
    neighborhoodDetailsObj = results;

    //remove
    // console.log('neighborhoodDetailsObj' , dictionary, results);

    return results;
  };



  return {
    serviceDict: serviceDict,
    attractionDict: attractionDict,
    currentNeighborhood: currentNeighborhood,
    currentMarkers: currentMarkers,
    neighborhoodDetailsObj: neighborhoodDetailsObj,
    createPlacesObj : createPlacesObj,
    neighborhoodMarkers: neighborhoodMarkers
    // mapCurrentNeighborhood:mapCurrentNeighborhood
  };
});
