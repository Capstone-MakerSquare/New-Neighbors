angular.module('myApp.requestHoodServices',[])
.factory('ServerApi', function ($http) {

  var submit = function (searchInfo, searchType) {
    console.log('requestHoodServices.js says: POST request:', searchInfo);
    let searchUrl = 'api/get' + searchType; // 'Neighborhoods'  or  'Demography'

    return $http({
      method: 'POST',
      url: searchUrl,
      data: searchInfo
    })
    .then(function submitSuccess(resp) {
      console.log('requestHoodServices.js says: POST request complete. Response data:', resp.data);
      return resp.data;
    }, function submitError(error) {
      console.log(error);
      return({error});
    });
  };

  return {
    submit : submit,
  };
});
