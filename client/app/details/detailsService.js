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

  var createPlacesObj = function (neighborhoodArr, dictionary) {
    var results = {};
    var temp;
    neighborhoodArr = neighborhoodArr || [];

    for (var i = 0; i < neighborhoodArr.length; i++) {
      temp = {};
      var establishments = neighborhoodArr[i].amenities_attractions;

      for (var place in establishments) {
        if (establishments[place].types && Array.isArray(establishments[place].types)) {
          for (var j = 0; j < establishments[place].types.length; j++){

            if (dictionary[establishments[place].types[j]] && temp[establishments[place].types[j]]) {
              temp[establishments[place].types[j]].push(establishments[place]);
            } else if (dictionary[establishments[place].types[j]] && !temp[establishments[place].types[j]]) {
              temp[establishments[place].types[j]] = [establishments[place]];
              temp[establishments[place].types[j]][0].type = establishments[place].types[j]
            }
          }
        }
      }
      if(neighborhoodArr[i].name==='Downtown') {
        neighborhoodArr[i].name = neighborhoodArr[i].name + ' ' + neighborhoodArr[i].city;
      }
      results[neighborhoodArr[i].name] = temp;
    }
    neighborhoodDetailsObj = results;

    //remove
    console.log('neighborhoodDetailsObj' , dictionary, results);

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
    serviceDict: serviceDict,
    attractionDict: attractionDict,
    currentNeighborhood: currentNeighborhood,
    currentMarkers: currentMarkers,
    neighborhoodDetailsObj: neighborhoodDetailsObj,
    createPlacesObj : createPlacesObj
    // mapCurrentNeighborhood:mapCurrentNeighborhood
  };
});
