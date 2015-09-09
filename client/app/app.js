var app = angular.module('myApp', [
  'ui.router',
  'myApp.requestHoodServices',
  'myApp.map',
  'myApp.searchForm',
  'myApp.filter',
  'myApp.thumbnails'
]);
console.log("app.js called");
app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.
    otherwise("/landing");

  $stateProvider
    .state('landing', {
      url: "/landing",
      controller: 'MainController',
      controllerAs: 'main',
      views: {
        "": {
          templateUrl: "./app/landing/landing.html"
        }
      }
     })
    .state('main', {
      url: "/main",
      controller: 'MainController',
      controllerAs: 'main',
      views: {
        "": {
          templateUrl: "./app/main/main.html"
        }
      }
     })
    .state('main.results', {
      url: "/results",
      controller: 'MainController',
      controllerAs: 'main',
      views: {
        "glance-card": {
          templateUrl: "./app/results/resultsTemplate.html"
        }
      }
    })
    .state('main.details', {
      url: "/details",
      views: {
        "glance-card": {
          templateUrl: "./app/details/detailsTemplate.html"
        }
      }
    });
  });

