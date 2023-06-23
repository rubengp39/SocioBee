var lat, lon, cellLat, cellLon;
var routingControl = null;
var selectedSquareLayer = null;


// Importar de coordinates.js

import { squareCoordinates } from './savedSquare.js';

console.log(squareCoordinates);

const divisions = 50;


var colors = ['white', 'blue', 'green', 'yellow', 'orange', 'purple', 'cyan', 'magenta'];
var colorIndex = 0;

function getCurrentDateTime() {
  var currentDateTime = new Date();
  
  // Get date components
  var year = currentDateTime.getFullYear();
  var month = padZero(currentDateTime.getMonth() + 1); // Month starts from 0
  var day = padZero(currentDateTime.getDate());
  
  // Get time components
  var hours = padZero(currentDateTime.getHours());
  var minutes = padZero(currentDateTime.getMinutes());
  var seconds = padZero(currentDateTime.getSeconds());
  var milliseconds = currentDateTime.getMilliseconds();
  
  // Format the date and time as a string
  var formattedDateTime = year + '-' + month + '-' + day + 'T' + hours + ':' + minutes + ':' + seconds + '.' + milliseconds + 'Z';
  
  return formattedDateTime;
}

// Helper function to pad single digit numbers with a leading zero
function padZero(number) {
  return (number < 10 ? '0' : '') + number;
}


// Posición del usuario.
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(position) {
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    var userMarker = L.marker([lat, lon]).addTo(map);
    // Mostrar ventana emergente.
    userMarker.bindPopup('¡Estás aquí!').openPopup();

    // Centrar el mapa en la ubicación del usuario.
    map.setView([lat, lon], 13);

  
  }, function(error) {
    console.error('Error obteniendo la geolocalización:', error);
  });
} else {
  console.error('Geolocalización no soportada por el navegador');
}    


function divideSquareToGeoJSON(squareCoordinates, divisions) {
  // Función para dividir un cuadrado en cuadrados más pequeños
  function divideSquareIntoSmallerSquares(squareCoordinates, divisions) {
    const [minX, minY, maxX, maxY] = getBoundingBox(squareCoordinates);
    const width = maxX - minX;
    const height = maxY - minY;
    const divisionWidth = width / divisions;
    const divisionHeight = height / divisions;

    const smallerSquares = [];

    for (let i = 0; i < divisions; i++) {
      for (let j = 0; j < divisions; j++) {
        const x1 = minX + i * divisionWidth;
        const y1 = minY + j * divisionHeight;
        const x2 = x1 + divisionWidth;
        const y2 = y1 + divisionHeight;

        const center = [(x1 + x2) / 2, (y1 + y2) / 2];

        const smallerSquare = [
          [x1, y1],
          [x1, y2],
          [x2, y2],
          [x2, y1],
          [x1, y1]
        ];

        smallerSquares.push({
          coordinates: smallerSquare,
          center: center
        });
      }
    }

    return smallerSquares;
  }

  // Función para obtener las coordenadas de la caja delimitadora (bounding box)
  function getBoundingBox(coordinates) {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (const [x, y] of coordinates) {
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }

    return [minX, minY, maxX, maxY];
  }

  // Dividir el cuadrado original en cuadrados más pequeños
  const smallerSquares = divideSquareIntoSmallerSquares(squareCoordinates, divisions);

  // Crear un objeto GeoJSON con los cuadrados más pequeños
  const geojson = {
    type: "FeatureCollection",
    features: smallerSquares.map((square) => ({
      type: "Feature",
      properties: {
        center: square.center
      },
      geometry: {
        type: "Polygon",
        coordinates: [square.coordinates]
      }
    }))
  };

  return geojson;
}

// Función para crear varios cuadrados a partir de las coordenadas proporcionadas
function createSquaresFromCoordinates(coordinates, divisions) {
  const geojsonFeatures = [];

  for (const squareCoordinates of coordinates) {
    const geojson = divideSquareToGeoJSON(squareCoordinates, divisions);
    var color = colors[colorIndex % colors.length];
    const fillColor = "red";

        // Asignar el color a cada rectángulo
        geojson.features.forEach((feature) => {
          feature.properties.color = color;
          feature.properties.fillColor = fillColor;
        });
        
    geojsonFeatures.push(...geojson.features);
    colorIndex++;
  }

  return {
    type: "FeatureCollection",
    features: geojsonFeatures
  };
}


const geojson = createSquaresFromCoordinates(squareCoordinates, divisions);



// Crear función para el contenido del popup con botón
function createPopupContent(layer) {
  var content = document.createElement('div');

  // Crear botón personalizado
  var button = L.DomUtil.create('button', 'custom-button');
  button.innerHTML = 'Seleccionar esta celda';    

  

  function handleClick() {
    cellLat = layer.feature.properties.center[1];
    cellLon = layer.feature.properties.center[0];


    if (selectedSquareLayer !== null) {
      // Restaurar el color original del cuadrado previamente seleccionado solo si no es verde
      if (selectedSquareLayer.options.fillColor !== 'green') {
        selectedSquareLayer.setStyle({
          fillColor: "red"
        });
      }
    }

    selectedSquareLayer = layer;
    selectedSquareLayer.setStyle({
      fillColor: "yellow"
    });
           
    // Eliminar la ruta anterior si existe
    
    if (routingControl  !== null) {
    
      routingControl .remove();
    
    }
        routingControl  = L.Routing.control({
          waypoints: [
            L.latLng(lat, lon),
            L.latLng(cellLat, cellLon)
          ], 
          profile: 'car',
          collapsible: true,
          lineOptions: {
            styles: [
              { color: 'blue', opacity: 0.6, weight: 4}
            ]
          }
        }).addTo(map);
        
        
        document.getElementById('position').value = cellLat + ', ' + cellLon;
      }
    

  // Asignar la función al evento click del botón
  button.addEventListener('click', handleClick);

  // Agregar información de coordenadas al contenido del popup
  var coordinates = "Las coordenadas de este cuadrado son:<br/>Lat = " + layer.feature.properties.center[1] + "<br/>Long = " + layer.feature.properties.center[0] + "<br/>";
  content.innerHTML = coordinates;
  content.appendChild(button);

  return content;
};


function handleSubmit(event) {
  event.preventDefault();

  // Obtener los valores del formulario
  var no2 = document.getElementById('no2').value;
  var co2 = document.getElementById('co2').value;
  var o3 = document.getElementById('o3').value;
  var so2 = document.getElementById('so2').value;
  var pm10 = document.getElementById('pm10').value;
  var pm25 = document.getElementById('pm25').value;
  var pm1 = document.getElementById('pm1').value;
  var benzene = document.getElementById('benzene').value;

  var data = {
    datetime: getCurrentDateTime(),
    location: {
      Longitude: cellLon,
      Latitude: cellLat
    },
    no2: no2,
    co2: co2,
    o3: o3,
    so02: so2,
    pm10: pm10,
    pm25: pm25,
    pm1: pm1,
    benzene: benzene
  };

    // Cambiar el color del cuadrado seleccionado
    if (selectedSquareLayer !== null) {
      if (selectedSquareLayer.feature.properties.colorOriginal !== 'green') {
        selectedSquareLayer.setStyle({
          fillColor: "green"
        });
      }
    }

  // Actualmente el MVE está en proceso de cambio asi que puede que de error.

  // Realizar la solicitud a la API utilizando fetch
  fetch("127.0.1:8001/members/0/measurements", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(result => {
      // Notificar al usuario que el formulario ha sido enviado
      alert('El formulario ha sido enviado correctamente');

      // Restablecer el formulario
      document.getElementById('dataForm').reset();
    })
    .catch(error => {
      // Manejar cualquier error ocurrido durante la solicitud
      console.error('Error al enviar el formulario:', error);
    });

  // Restablecer el formulario
  document.getElementById('dataForm').reset();

  alert('El formulario ha sido enviado.');
}

// Asignar el manejador de eventos al formulario
document.getElementById('dataForm').addEventListener('submit', handleSubmit);



   
 // Crear capa de geoJSON y añadir al mapa con el bindPopup personalizado
L.geoJSON(geojson, {
  style: function (feature) {
    return {
    color: feature.properties.color,
    fillColor: feature.properties.fillColor,
    fillOpacity: 0.2
  };}
}).bindPopup(createPopupContent).addTo(map);


