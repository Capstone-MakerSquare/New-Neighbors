var details = angular.module('myApp.details', []);

details.controller('detailsController', ['Details', 'Map', function (Details, Map){
  var detail = this;
  detail.picturesArr = [];

  detail.currentNeighborhood = Details.currentNeighborhood;
  console.log('detailsController says:', Details.currentNeighborhood);

  detail.displayMarkers = function(place) {
    var coordinates = {
      latitude: place[1][0].geometry.location.lat,
      longitude: place[1][0].geometry.location.lng
    }
    Map.dropMarker(coordinates, place[1].name)
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

  detail.currentNeighborhood.instagram.forEach(function (obj) {
    detail.picturesArr.push([obj.images.low_resolution.url, obj.user.full_name]);
    // detail.picturesArr.push({
      // username: obj.user.full_name,
      // url: obj.images.standard_resolution.url
    // });
  });

  //remove
  console.log('detailsController says: picturesArr:', detail.picturesArr);


  //----------------------------------------------------------------------------------

}]);
