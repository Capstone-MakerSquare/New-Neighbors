var app = angular.module('myApp', [
  'myApp.requestHoodServices', 
  'myApp.mapServices', 
  'ui.router'
])

app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.
    otherwise("/");

  $stateProvider
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
          templateUrl: "./app/thumbnails/thumbnailsTemplate.html"
        }
      }
    })
    .state('main.details', {
      url: "/details",
      controller: 'MainController',
      controllerAs: 'main',
      views: {
        "glance-card": {
          templateUrl: "./app/details/detailsTemplate.html"
        }
      }
    })
  });

