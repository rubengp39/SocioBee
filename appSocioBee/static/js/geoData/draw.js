import { squareCoordinates } from './savedSquare.js';
const transposedCoordinates = [];

for (let i = 0; i < squareCoordinates.length; i++) {
  const coordinates = squareCoordinates[i];
  const transposed = coordinates.map(coords => [coords[1], coords[0]]);
  transposedCoordinates.push(transposed);
}



var drawnItems = new L.FeatureGroup().addTo(map);

var drawControl = new L.Control.Draw({
  draw: {
    rectangle: true,
    polygon: false,
    circle: false,
    marker: false,
    polyline: false
  },
  edit: {
    featureGroup: drawnItems
  }
});

map.addControl(drawControl);

map.on("draw:created", function(event) {
  var layer = event.layer;
  drawnItems.addLayer(layer);

  // Obtén las coordenadas del rectángulo dibujado
  var rectangleCoordinates = layer.getLatLngs()[0];

  // Actualiza la variable squareCoordinates con las nuevas coordenadas
  var updatedCoordinates = [
    
      [
        rectangleCoordinates[0].lng,
        rectangleCoordinates[0].lat
      ],
      [
        rectangleCoordinates[1].lng,
        rectangleCoordinates[1].lat
      ],
      [
        rectangleCoordinates[2].lng,
        rectangleCoordinates[2].lat
      ],
      [
        rectangleCoordinates[3].lng,
        rectangleCoordinates[3].lat
      ],
      [
        rectangleCoordinates[0].lng,
        rectangleCoordinates[0].lat
      ]
    
  ];

  // Añade las nuevas coordenadas al arreglo existente
  squareCoordinates.push(updatedCoordinates);
  
console.log(squareCoordinates);
});


function sendModifiedData(){
  $.ajax({
    url: '',
    type: 'POST',
    data: JSON.stringify({ squareData: squareCoordinates }),
    contentType: 'application/json',
    success: function(response) {
      console.log('Los datos del cuadrado se han guardado exitosamente');
    },
    error: function(xhr, status, error) {
      console.error('Error al guardar los datos del cuadrado:', error);
    }
  });
};

// Obtén el formulario por su ID o cualquier otro selector
var form = document.getElementById('form');

// Agrega un evento de escucha al evento "submit" del formulario
form.addEventListener('submit', function(event) {
  event.preventDefault(); // Evita que el formulario se envíe de forma predeterminada
  
  // Llama a la función sendModifiedData()
  sendModifiedData();
});


  var polygonStyle = {
    color: 'red',
    fillColor: 'blue',
    fillOpacity: 0.2
  };

  // Itera sobre las coordenadas de los polígonos
for (var i = 0; i < transposedCoordinates.length; i++) {
    var polygon = L.polygon(transposedCoordinates[i], polygonStyle).addTo(map);
    console.log(transposedCoordinates[i])
  }
  
  