// Definición del mapa.

let map = L.map('map').setView([43.2708, -2.9375], 11)

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Crea un objeto GeoJSON que representa el círculo
var circle = {
  type: 'Feature',
  geometry: {
    type: 'Point',
    coordinates: [-2.98, 43.33]
  },
  properties: {
    radius: 10000
  }
};



// Agrega el círculo al mapa utilizando L.geoJSON()
var circleLayer = L.geoJSON(circle, {
  pointToLayer: function (feature, latlng) {
    // Crea un círculo utilizando L.circle()
    return L.circle(latlng, feature.properties);
  }
}).addTo(map);


// Geolocalización del usuario.
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {

        var lat = position.coords.latitude;
        var lon = position.coords.longitude;
        var userMarker = L.marker([lat, lon]).addTo(map);
        // Mostrar ventana emergente.
        userMarker.bindPopup('¡Estás aquí!').openPopup();

        // Centrar el mapa en la ubicación del usuario.
        map.setView([lat, lon], 13);
        circleLayer.on('click', function(e){
          
          var circleCoords = circle.geometry.coordinates;
          var circleLatLng = L.latLng(circleCoords[1], circleCoords[0]);

          var control = L.Routing.control({
            waypoints:[
            L.latLng(lat, lon),
            L.latLng(circleLatLng)
            ]
          }).addTo(map);
        });
        

    }, function(error) {
      console.error('Error obteniendo la geolocalización:', error);
    });
  } else {
    console.error('Geolocalización no soportada por el navegador');
  };

  
// Get al MVE para obtener la superficie de las campañas.

fetch('http://127.0.0.1:8001/hives/1/campaigns/')
  .then(function(response){
    return response.json();
  })
  .then(function(geojson){
    L.geoJSON(geojson).addTo(map);
  })
  .catch(function(error){
    console.error('Error obteniendo el GeoJSON:', error);
  });


// Dividir en cuadrados

var circleCoords = circle.geometry.coordinates;
var circleLatLng = L.latLng(circleCoords[1], circleCoords[0]);
var radius = circle.properties.radius;
var squareSize = 1000;
var squares = [];

var startX = circleLatLng.lng - radius;
var startY = circleLatLng.lat - radius;


// Avanza horizontalmente y verticalmente en incrementos de squareSize
for (var x = startX; x < circleLatLng.lng + radius; x += squareSize) {
  for (var y = startY; y < circleLatLng.lat + radius; y += squareSize) {
    // Comprueba si el punto está dentro del círculo
    var point = L.latLng(y + squareSize / 2, x + squareSize / 2);
    if (circleLatLng.distanceTo(point) <= radius) {
      // Añade el cuadrado a la matriz squares
      squares.push(L.rectangle([[y, x], [y + squareSize, x + squareSize]]));
    }
  }
}

// Añade los cuadrados al mapa
for (var i = 0; i < squares.length; i++) {
  squares[i].addTo(map);
}