angular.module('myApp.detailsService',[])
.factory('Details', function () {

  var AmenitiesDict = {
    atm: [],
    bank: [],
    beauty_salon: [],
    book_store: [],
    cafe: [],
    car_rental: [],
    car_repair: [],
    car_wash: [],
    clothing_store: [],
    convenience_store: [],
    dentist: [],
    department_store: [],
    doctor: [],
    electrician: [],
    electronics_store: [],
    fire_station: [],
    florist: [],
    food: [],
    furniture_store: [],
    gas_station: [],
    general_contractor: [],
    grocery_or_supermarket: [],
    gym: [],
    hair_care: [],
    hardware_store: [],
    health: [],
    home_goods_store: [],
    hospital: [],
    insurance_agency: [],
    laundry: [],
    library: [],
    liquor_store: [],
    locksmith: [],
    meal_delivery: [],
    meal_takeaway: [],
    movie_rental: [],
    parking: [],
    pet_store: [],
    pharmacy: [],
    plumber: [],
    post_office: [],
    school: [],
    shoe_store: [],
    spa: [],
    store: [],
    subway_station: [],
    taxi_stand: [],
    train_station: [],
    veterinary_care: []
  }

  var getAmenitiesObj = function (neighborhoodArr) {
    for (var i = 0; i < neighborhoodArr.length; i++) {

    }
  }


  return {
    AmenitiesDict: AmenitiesDict,
    getAmenitiesObj : getAmenitiesObj
  };
});
