'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/map', {templateUrl: 'partials/map.html', controller: mapController});
    $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: MyCtrl2});
    $routeProvider.otherwise({redirectTo: '/map'});
  }]).
  config(['$httpProvider', function($httpProvider) {
    // delete $httpProvider.defaults.headers.common["X-Requested-With"]
  }]);