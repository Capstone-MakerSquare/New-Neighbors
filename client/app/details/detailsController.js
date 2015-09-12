var details = angular.module('myApp.details', []);

details.controller('detailsController', ['Details', 'Map', function (Details, Map){
  var detail = this;
  detail.picturesArr = [
    'assets/images/default-japan-slideshow-1.jpeg',
    'assets/images/default-japan-slideshow-2.jpeg',
    'assets/images/default-japan-slideshow-3.jpeg',
    'assets/images/default-japan-slideshow-4.jpeg',
    'assets/images/default-japan-slideshow-5.jpeg',
    'assets/images/default-japan-slideshow-6.jpeg',
    'assets/images/default-japan-slideshow-7.jpeg',
    'assets/images/default-japan-slideshow-8.jpeg',
    'assets/images/default-japan-slideshow-9.jpeg'
  ];

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




}]);
