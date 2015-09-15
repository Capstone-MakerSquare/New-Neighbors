var details = angular.module('myApp.details', []);

details.controller('detailsController', ['Details', 'Map', function (Details, Map){
  var detail = this;
  // detail.picturesArr = [];
  detail.markers = [];

  detail.currentNeighborhood = Details.currentNeighborhood;
  console.log('detailsController says:', Details.currentNeighborhood);

  detail.displayMarkers = function(place) {
    var icon;


    Map.clearMarkers(Details.currentMarkers);
    for (var i = 0; i < place[1].length; i++) {
      var coordinates = {
        latitude: place[1][i].geometry.location.lat,
        longitude: place[1][i].geometry.location.lng
      }
      detail.markers.push(Map.dropMarker(coordinates, place[1][i].name, place[1][i].name, icon))
    }
    for (var j = 0; j < detail.markers.length; j++){
      Details.currentMarkers.push(detail.markers[j])
    }
    console.log("detail.displayMarkers", place)
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

}]);
