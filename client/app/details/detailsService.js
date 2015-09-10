console.log('detailsService called)');

details
.factory('Details', function () {

  var placesDict = {
    airport: [],
    atm: [],
    bank: [],
    bar: [],
    book_store: [],
    cafe: [],
    car_rental: [],
    convenience_store: [],
    department_store: [],
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
      var places = neighborhoodArr[i].amenities_attractions;
      for (var place in places) {
        console.log('places[place].types', places[place].types);
        if (places[place].types && places[place].types.length > 0) {
          for (var j = 0; j < places[place].types.length; j++){
            if (placesDict[places[place].types[j]] && temp[places[place].types[j]]) {
              temp[places[place].types[j]].push(places[place]);
            } else if (placesDict[places[place].types[j]] && !temp[places[place].types[j]]) {
              temp[places[place].types[j]] = [places[place]];
            }
          }
        }
      }
      results[neighborhoodArr[i].name] = temp;
    }
    console.log('results', results);
    //console.log('getPlacesObj results:', results, 'counter', counter, 'counter2', counter2);
    return results;
  };


  return {
    placesDict: placesDict,
    getPlacesObj : getPlacesObj
  };
});
