

/* Directives */


angular.module('myApp.directives', []).
  directive('appVersion', ['version','test', function(val,version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]).
  directive('sfMap', function(){
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var map = L.map(attrs.id, {
                center: [37.7750, -122.4183],
                zoom: 10
            });
            alert(attrs.id);
            //create a CloudMade tile layer and add it to the map
            L.tileLayer('http://{s}.tile.cloudmade.com/57cbb6ca8cac418dbb1a402586df4528/997/256/{z}/{x}/{y}.png', {
                maxZoom: 18
            }).addTo(map);
        }
    };
  }).
  directive("leaflet", function ($http, $log) {
    return {
      restrict: "A",
      replace: true,
      transclude: true,
      scope: {
        center: "=center",
        marker: "=marker",
        message: "=message",
        zoom: "=zoom"
      },
      template: '<div class="map"></div>',
      link: function (scope, element, attrs, ctrl) {
        var lat = 37.7750;
        var lng = -122.4183;
        var zoom = 12;
        var $el = element[0];
        map = new L.Map($el);

          L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 20 }).addTo(map);

                // Default center of the map
                var point = new L.LatLng(lat, lng);
                map.setView(point, zoom);

                scope.$watch("center", function(center) {
                    if (center === undefined) return;

                    // Center of the map
                    center = new L.LatLng(scope.center.lat, scope.center.lng);
                    var zoom = scope.zoom || 8;
                    map.setView(center, zoom);

                    var marker = new L.marker(scope.center, { draggable: attrs.markcenter ? false:true });
              if (attrs.markcenter || attrs.marker) {
                        map.addLayer(marker);

                        if (scope.message) {
                            marker.bindPopup("<strong>" + scope.message + "</strong>", { closeButton: false });
                            marker.openPopup();
                        }
                        if (attrs.marker) {
                            scope.marker.lat = marker.getLatLng().lat;
                            scope.marker.lng = marker.getLatLng().lng;
                        }
                }

                    // Listen for map drags
                    var dragging_map = false;
                    map.on("dragstart", function(e) {
                        dragging_map = true;
                    });

                map.on("drag", function (e) {
                  scope.$apply(function (s) {
                    s.center.lat = map.getCenter().lat;
                    s.center.lng = map.getCenter().lng;
                  });
                });

                    map.on("dragend", function(e) {
                        dragging_map= false;
                    });

                    scope.$watch("center.lng", function (newValue, oldValue) {
                        if (dragging_map) return;
                        map.setView(new L.LatLng(map.getCenter().lat, newValue), map.getZoom());
                    });

                    scope.$watch("center.lat", function (newValue, oldValue) {
                        if (dragging_map) return;
                        map.setView(new L.LatLng(newValue, map.getCenter().lng), map.getZoom());
                    });

                    // Listen for zoom
                    scope.$watch("zoom", function (newValue, oldValue) {
                        map.setZoom(newValue);
                    });

                map.on("zoomend", function (e) {
                  scope.zoom = map.getZoom();
                  scope.$apply();
                });

                    if (attrs.marker) {

                        var dragging_marker = false;

                    // Listen for marker drags
                  (function () {

                            marker.on("dragstart", function(e) {
                                dragging_marker = true;
                            });

                    marker.on("drag", function (e) {
                      scope.$apply(function (s) {
                        s.marker.lat = marker.getLatLng().lat;
                        s.marker.lng = marker.getLatLng().lng;
                      });
                    });

                            marker.on("dragend", function(e) {
                                marker.openPopup();
                                dragging_marker = false;
                            });

                            map.on("click", function(e) {
                                marker.setLatLng(e.latlng);
                                marker.openPopup();
                      scope.$apply(function (s) {
                        s.marker.lat = marker.getLatLng().lat;
                        s.marker.lng = marker.getLatLng().lng;
                      });
                            });

                            scope.$watch("marker.lng", function (newValue, oldValue) {
                                if (dragging_marker) return;
                                marker.setLatLng(new L.LatLng(marker.getLatLng().lat, newValue));
                            });

                            scope.$watch("marker.lat", function (newValue, oldValue) {
                                if (dragging_marker) return;
                                marker.setLatLng(new L.LatLng(newValue, marker.getLatLng().lng));
                            });

                  }());

                }

                });

            }
    };
  });
