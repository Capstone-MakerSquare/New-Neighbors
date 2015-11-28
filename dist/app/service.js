angular.module('myApp.requestHoodServices',[])
.factory('ServerApi', function ($http) {

  var submit = function (searchInfo) {
    console.log('requestHoodServices.js says: Info submitted:', searchInfo);

    console.log('requestHoodServices.js says: POST request initiated.');
    return $http({
      method: 'POST',
      url: '/api/getNeighbors',
      data: searchInfo
    })
    .then(function(resp) {
      console.log('requestHoodServices.js says: POST request complete.');
      console.log('response data:',resp.data);
      return resp.data;
    });
  };

  return {
    submit : submit,
  };
});
