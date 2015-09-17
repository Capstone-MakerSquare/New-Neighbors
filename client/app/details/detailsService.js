details
.factory('Details', function () {

  var neighborhoodDetailsObj;
  var currentNeighborhood;
  var currentMarkers = [];

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


  //----------------------------------------------------------------------------------
  //Creates objects that can be displayed in the amenities and attractions sections.
  //The dictionary argument determines which catagory it applies to

  var createPlacesObj = function (neighborhoodArr, dictionary) {
    var results = {};
    var catagories;
    neighborhoodArr = neighborhoodArr || [];
    var thisType = '';
    var thisHoodObj;

    for (var i = 0; i < neighborhoodArr.length; i++) {
      thisHoodObj = {};
      catagories = neighborhoodArr[i].amenities_attractions;

      for (var place in catagories) {
        if (catagories[place].types && Array.isArray(catagories[place].types)) {
          for (var j = 0; j < catagories[place].types.length; j++){

            thisType = catagories[place].types[j];
            if (dictionary[thisType]) {

              if (!thisHoodObj[thisType]) {
                thisHoodObj[thisType] = []
              }
              thisHoodObj[thisType].push(catagories[place]);
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
    createPlacesObj : createPlacesObj
    // mapCurrentNeighborhood:mapCurrentNeighborhood
  };
});
