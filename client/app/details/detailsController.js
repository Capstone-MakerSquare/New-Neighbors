var details = angular.module('myApp.details', []);

details.controller('detailsController', ['Details', 'Map', function (Details, Map){
  var detail = this;
  detail.markers = [];
  detail.selectedCategory = undefined;
  detail.currentSpotsToDisplay = [];

  detail.currentNeighborhood = Details.currentNeighborhood;

  // State Flags
  detail.tabs = [1,0,0];    //[amenities, attractions, charts]

  // console.log('detailsController says: This is where you print from:', detail.currentNeighborhood.services);

  detail.displayMarkers = function(place) {
    var icon = Map.getIcon();
    // console.log('place1', place)
    // console.log('Type:',type);
    // console.log('detail.currentNeighborhood.attractions', detail.currentNeighborhood.attractions);
    // console.log('detail.currentNeighborhood.services', detail.currentNeighborhood.services);
    // console.log('place selected:',place);
    console.log('details.currentSpotsToDisplay:', detail.currentSpotsToDisplay);

    Map.clearMarkers(Details.currentMarkers);
    for (var i = 0; i < place.length; i++) {
      var coordinates = {
        latitude: place[i].geometry.location.lat,
        longitude: place[i].geometry.location.lng
      }
      var tuple = Map.dropMarker(coordinates, place[i].name, place[i], icon, 'amenities_attractions');
      //[marker, infowindow]
      detail.markers.push(tuple[0]);

      place[i].marker = tuple[0]; place[i].infowindow = tuple[1];
    }
    for (var j = 0; j < detail.markers.length; j++){
      Details.currentMarkers.push(detail.markers[j])
    }
    // console.log("detail.displayMarkers", place)
  }


  //----------------------------------------------------------------------------------
  //to expand and collapse icons section

  detail.isCollapsed = true;
  detail.moreLess = '+ More';
  detail.expandCollapse = function() {
    if (detail.moreLess === '+ More') {
      detail.moreLess = '- Less';
    } else if (detail.moreLess === '- Less') {
      detail.moreLess = '+ More';
    }
    detail.isCollapsed = !detail.isCollapsed;
  };

  //----------------------------------------------------------------------------------


  //----------------------------------------------------------------------------------
  // instagram map
  detail.populatePictures = function(){
    var pictures = [];
    detail.currentNeighborhood.instagram.forEach(function (obj) {
      pictures.push([obj.images.low_resolution.url, obj.user.full_name]);
    });
    return pictures;
  };

  // detail.picturesArr = detail.populatePictures()

  //remove
  // console.log('detailsController says: picturesArr:', detail.picturesArr);


  //----------------------------------------------------------------------------------

  //----------------------------------------------------------------------------------
  //

   detail.selectCategory = function(index) {
     // console.log("selected category fn called with index", index)
      detail.selectedCategory = index;

    // console.log(category, "attraction index:", detail.selectedAttractionCategory, "service index:", detail.selectedServiceCategory);
  };

  //----------------------------------------------------------------------------------

  //HELPERS
  //----------------------------------------------------------------------------------

   detail.displayAmenitiesOrAttractions = function(spotsArray) {
    // console.log('Selected Spots:', spotsArray);
    detail.currentSpotsToDisplay = spotsArray;
  };

  //----------------------------------------------------------------------------------
    detail.toggleTooltip = function (spot) {
      // console.log('Tool tip toggle for spot:', spot);
      Map.toggleInfoWindow(spot.infowindow, spot.marker);
    }

  //----------------------------------------------------------------------------------
    detail.getAmenitiesIcon = function(amenity) {
      // console.log('getAmenitiesIcon says: amenity:',amenity);
      return './assets/images/Amenities/'+amenity.displayName+'.png';
    }

  //----------------------------------------------------------------------------------
    detail.getAttractionsIcon = function(attraction) {
      // console.log('getAttractionsIcon says: attraction:',attraction);
      return './assets/images/Attractions/'+attraction.displayName+'.png';
    }

  //----------------------------------------------------------------------------------
    detail.stateSwitch = function(currState) {
      switch(currState) {
        case 'amenities': detail.tabs = [1,0,0];
                          break;
        case 'attractions': detail.tabs = [0,1,0];
                            break;
        case 'charts': detail.tabs = [0,0,1];
                           break;
        default: break;
      }
      // console.log('stateSwitch says:',detail.tabs);
    }


}]);








