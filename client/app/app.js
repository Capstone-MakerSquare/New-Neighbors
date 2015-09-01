// app.js requires all the modules in their respective folders.
// The requires in this file accesses the index.js file in each service's directory
// and points to the module. 

var myApp = angular.module('myApp', [
  'ui.router'
]);

myApp.config(['$urlRouterProvider', function($urlRouterProvider) {
  $urlRouterProvider
    .otherwise('/');
}]);


myApp.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.
    otherwise("/results");

  $stateProvider
    .state('results', {
      url: "/results",
      templateUrl: "partials/results.html"
    })
    .state('results.fullGlance', {
      url: "/fullGlance",
      templateUrl: "partials/results.fullGlance.html",
    })
});