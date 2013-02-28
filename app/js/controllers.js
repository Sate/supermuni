'use strict';

/* Controllers */


function mapController($scope, DataSource) {
  $scope.go = function(){
    $scope.vehicles = {};
    $scope.route = $scope.input;
    for (var i in map._layers){
      if (map._layers[i]._tiles){ continue}
      map.removeLayer(map._layers[i])
    }
    lastTime = 0;
    DataSource.get(setData, $scope.route);
  };
  $scope.tree = {stuff:'yup'};
  $scope.vehicles = {};
  var setData = function(data) {
    if (Array.isArray( data['body']['vehicle']) ){
      var vehicles = data.body.vehicle;
      vehicles.forEach(function(v){
        if (!$scope.vehicles[v.id]){
          $scope.vehicles[v.id] = L.marker([v.lat,v.lon]).bindPopup(v.routetag+'').addTo(map);
        } else {
          $scope.vehicles[v.id].setLatLng([v.lat,v.lon]);
        }
      });
      console.log($scope.vehicles)
    } else if (typeof data.body.vehicle === 'object'){
      var v = data.body.vehicle;
        if (!$scope.vehicles[v.id]){
          $scope.vehicles[v.id] = L.marker([v.lat,v.lon]).bindPopup(v.routetag+'').addTo(map);
        } else {
          $scope.vehicles[v.id].setLatLng([v.lat,v.lon]);
        }
    }
  }
         
  setInterval(function(){
    $scope.$apply(function() {
      DataSource.get(setData, $scope.route)

    });
  }, 5000);
}
// mapController.$inject = [$scope];


function MyCtrl2() {
}
MyCtrl2.$inject = [];
