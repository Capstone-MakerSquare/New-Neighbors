details
.factory('Details', function () {

  var neighborhoodDetailsObj;
  var currentNeighborhood;
  var currentMarkers;

  var placesDict = {
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
    spa: [],
    store: [],
    subway_station: [],
    train_station: [],
    veterinary_care: [],
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
    university: [],
    zoo: []
  };

  var getPlacesObj = function (neighborhoodArr) {
    var results = {};
    var temp;
    for (var i = 0; i < neighborhoodArr.length; i++) {
      temp = {};
      var establishments = neighborhoodArr[i].amenities_attractions;
      for (var place in establishments) {
        if (establishments[place].types && establishments[place].types.length > 0) {
          for (var j = 0; j < establishments[place].types.length; j++){
            if (placesDict[establishments[place].types[j]] && temp[establishments[place].types[j]]) {
              temp[establishments[place].types[j]].push(establishments[place]);
            } else if (placesDict[establishments[place].types[j]] && !temp[establishments[place].types[j]]) {
              temp[establishments[place].types[j]] = [establishments[place]];
            }
          }
        }
      }
      if(neighborhoodArr[i].name==='Downtown') {
        neighborhoodArr[i].name = neighborhoodArr[i].name + ' ' + neighborhoodArr[i].city;
      }
      results[neighborhoodArr[i].name] = temp;
    }

    //remove
    // console.log('results', results);

    neighborhoodDetailsObj = results;
    return results;
  };

  // var mapCurrentNeighborhood = function(neighborhood, placesObj) {
  //   currentNeighborhood = neighborhood;
  //   currentNeighborhood.places = placesObj[neighborhood.name];
  //   for (var place in currentNeighborhood.places){
  //     if (place === "grocery_or_supermarket") {
  //       currentNeighborhood.places[place] = ["grocery", currentNeighborhood.places[place]]
  //     } else {
  //       currentNeighborhood.places[place] = [place.replace("_", " "), currentNeighborhood.places[place]]
  //     }
  //   }
  //   console.log(currentNeighborhood);
  // }


  return {
    placesDict: placesDict,
    currentNeighborhood: currentNeighborhood,
    currentMarkers: currentMarkers,
    neighborhoodDetailsObj: neighborhoodDetailsObj,
    getPlacesObj : getPlacesObj
    // mapCurrentNeighborhood:mapCurrentNeighborhood
  };
});
