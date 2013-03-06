'use strict';

/* Controllers */


function mapController($scope, DataSource) {
  $scope.list = muniList.body.route;
  $scope.input = {val: ''};
  $scope.$watch('input.select', function (val){
    $scope.input.val = val;
    $scope.go();
  });
  $scope.getLocation = function(){
    if (navigator.geolocation){
      navigator.geolocation.getCurrentPosition(showPosition);
      }
    else{alert("Geolocation is not supported by this browser.");}
  };
  function showPosition(position){
    var lat = position.coords.latitude;
    var lng = position.coords.longitude; 
    var zoom = 15;
    console.log(lat, lng, zoom);
    var point = new L.LatLng(lat, lng);
    map.setView(point, zoom);
    L.circle([lat, lng], 100, {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5
    }).addTo(map);
  };
  $scope.go = function(val){
    $('input').blur();
    $scope.vehicles = {};
    $scope.input.select = $scope.input.val && $scope.input.val.toString().toUpperCase(); 
    $scope.route = $scope.input.val;
    for (var i in map._layers){
      if (map._layers[i]._tiles){ continue}
      map.removeLayer(map._layers[i])
    }
    lastTime = 0;
    DataSource.get(setData, $scope.route);
  };
  $scope.vehicles = {};
  var setData = function(data) {
    if (Array.isArray( data['body']['vehicle']) ){
      var vehicles = data.body.vehicle;
      vehicles.forEach(function(v){
        if (v.heading >= 0 && v.heading <= 90){v.heading = 'NE'}
        if (v.heading >= 91 && v.heading <= 180){v.heading = 'SE'}
        if (v.heading >= 181 && v.heading <= 270){v.heading = 'SW'}
        if (v.heading >= 271 && v.heading <= 360){v.heading = 'NW'}
        if (!v.predictable) { return }
        if (!$scope.vehicles[v.id]){
          $scope.vehicles[v.id] = L.marker([v.lat,v.lon]).bindPopup('Vehicle ID: '+v.id+'<br/>Heading:'+v.heading).addTo(map);
        } else {
          $scope.vehicles[v.id].setLatLng([v.lat,v.lon]);
        }
      });
    } else if (typeof data.body.vehicle === 'object'){
      var v = data.body.vehicle;
        if (!v.predictable) { return; }
        if (!$scope.vehicles[v.id]){
          $scope.vehicles[v.id] = L.marker([v.lat,v.lon]).bindPopup('Vehicle ID: '+v.id+'B'+v.heading).addTo(map);
        } else {
          $scope.vehicles[v.id].setLatLng([v.lat,v.lon]);
        }
    }
  };
  
         
  $scope.interval = setInterval(function(){
    $scope.$apply(function() {
      DataSource.get(setData, $scope.route)

    });
  }, 3000);
};
// mapController.$inject = [$scope];


function MyCtrl2() {
}
MyCtrl2.$inject = [];
