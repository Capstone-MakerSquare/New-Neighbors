angular.module('myApp.services',[])
.factory('Api', function ($http) {

  var submit = function (searchInfo) {
    console.log('services.js says: Info submitted:', searchInfo);

    console.log('services.js says: POST request initiated.');
    return $http({
      method: 'POST',
      url: '/api/getNeighbors',
      data: searchInfo
    })
    .then(function(resp) {
      console.log('services.js says: POST request complete.');
      console.log('Response data:',resp.data);
      return resp.data;
    })
  };

  return {
    submit : submit,
  };
});