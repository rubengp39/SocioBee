let map = L.map('map').setView([43.2708, -2.9375], 6)

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Initialise the FeatureGroup to store editable layers
var editableLayers = new L.FeatureGroup();
map.addLayer(editableLayers);

var options = {
    position: 'topleft',
    draw: {
        polygon: {
            allowIntersection: false, // Restricts shapes to simple polygons
            drawError: {
                color: '#e1e100', // Color the shape will turn when intersects
                message: '<strong>Oh snap!<strong> you can\'t draw that!' // Message that will show when intersect
            },
            shapeOptions: {
                color: '#97009c'
            }
        },
        polyline: {
            shapeOptions: {
                color: '#f357a1',
                weight: 10
            }
        },
        // disable toolbar item by setting it to false
        polyline: true,
        circle: true, // Turns off this drawing tool
        polygon: true,

        marker: false,
        rectangle: true,
    },
    edit: {
        featureGroup: editableLayers, //REQUIRED!!
        remove: true
    }
};

// Initialise the draw control and pass it the FeatureGroup of editable layers
var drawControl = new L.Control.Draw(options);
map.addControl(drawControl);

var editableLayers = new L.FeatureGroup();
map.addLayer(editableLayers);

map.on('draw:created', function(e) {
    var type = e.layerType,
        layer = e.layer;

    var c = getCorners(layer)

    if (type === 'polyline') {
        layer.bindPopup('A polyline!');
    } else if (type === 'polygon') {
        layer.bindPopup('A polygon!');
    } else if (type === 'marker') { layer.bindPopup('marker!'); } else if (type === 'circle') { layer.bindPopup('A circle!'); } else if (type === 'rectangle') { layer.bindPopup("NW:" + c[0].toString() + " NE:" + c[1].toString() + " SE:" + c[2].toString() + " SW:" + c[3].toString()); }


    editableLayers.addLayer(layer);
});


// Console coordinates in mouse click.
/* map.on('click', function(e) {
    var coord = e.latlng;
    var lat = coord.lat;
    var lng = coord.lng;
    console.log("You clicked the map at latitude: " + lat + " and longitude: " + lng);
}); */

// Get coordinates of a layer.
function getCorners(layer) {
    const corners = layer.getBounds();

    const northwest = corners.getNorthWest();
    const northeast = corners.getNorthEast();
    const southeast = corners.getSouthEast();
    const southwest = corners.getSouthWest();

    return [northwest, northeast, southeast, southwest];
};

function onEachFeature(feature, layer) {
    //bind click
    layer.on('click', function(e) {
        e = layer._latlngs
        console.log(e);
        // You can make your ajax call declaration here
        //$.ajax(... 
    });

}


// Static geoJson draw

var geo1 = {
    "type": "FeatureCollection",
    "features": [{
        "type": "Feature",
        "properties": { "id": 0 },
        "geometry": {
            "type": "Polygon",
            "coordinates": [
                [
                    [-11.605074, 44.119142],
                    [-6.352703, 46.830134],
                    [-6.528513, 42.407235],
                    [-11.605074, 44.119142]
                ]
            ]
        }
    }, {
        "type": "Feature",
        "properties": { "id": 1 },
        "geometry": {
            "type": "Polygon",
            "coordinates": [
                [
                    [-4.462741, 42.293564],
                    [-4.990173, 42.924252],
                    [-4.023216, 43.628123],
                    [-3.561713, 42.827639],
                    [-3.979263, 42.5207],
                    [-4.35286, 42.293564],
                    [-4.462741, 42.293564]
                ]
            ]
        }
    }, {
        "type": "Feature",
        "properties": { "id": 2 },
        "geometry": {
            "type": "Polygon",
            "coordinates": [
                [
                    [-3.067381, 43.265706],
                    [-3.067381, 43.369119],
                    [-2.824268, 43.369119],
                    [-2.824268, 43.265706],
                    [-3.067381, 43.265706]
                ]
            ]
        }
    }]
};
var geojson1 = L.geoJson(geo1, {

    onEachFeature: onEachFeature
}).addTo(map);

var geo2 = {
    "type": "FeatureCollection",
    "features": [{
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [2.9466, 43.3167],
                        [2.9466, 43.33920002250002],
                        [2.9775247700472898, 43.33920002250002],
                        [2.9775247700472898, 43.3167],
                        [2.9466, 43.3167]
                    ]
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [2.9775247700472898, 43.33920002250002],
                        [2.9775247700472898, 43.3167],
                        [3.0084495400945794, 43.3167],
                        [3.0084495400945794, 43.33920002250002],
                        [2.9775247700472898, 43.33920002250002],
                    ]
                ]
            }
        }, {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [2.9466, 43.33920002250002],
                        [2.9466, 43.36170004500004],
                        [2.9775247700472898, 43.36170004500004],
                        [2.9775247700472898, 43.33920002250002],
                        [2.9466, 43.33920002250002]
                    ]
                ]
            }
        }, {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [2.9775247700472898, 43.36170004500004],
                        [2.9775247700472898, 43.33920002250002],
                        [3.0084495400945794, 43.33920002250002],
                        [3.0084495400945794, 43.36170004500004],
                        [2.9775247700472898, 43.36170004500004]
                    ]
                ]
            }
        }
    ]
};

geojson2 = L.geoJson(geo2, {

    onEachFeature: onEachFeature
}).addTo(map);

//TODO
/*
const myJSON = '{ "coordX": [43.104994, -2.488403], "coordY": [43.492783, -3.015747], "cells": [{ "coordX11": [43.104994, -2.488403], "coordY11": [44.0049949000009, -1.2556985090040746] }, { "coordX21": [44.0049949000009, -1.2556985090040746], "coordY21": [44.0049949000009, -0.022994018008149247] }, { "coordX31": [44.0049949000009, -0.022994018008149247], "coordY31": [44.0049949000009, 1.2097104729877761] }, { "coordX41": [44.0049949000009, 1.2097104729877761], "coordY41": [44.0049949000009, 2.4424149639837016] }, { "coordX51": [44.0049949000009, 2.4424149639837016], "coordY51": [44.0049949000009, 3.675119454979627] }] }'
const myArray = JSON.parse(myJSON)
for (var key in myArray.cells) {
    for (var key2 in myArray.cells[key]) {
        var newArray = myArray.cells[key][key2].concat();

    }


}
console.log(newArray)
*/


// Export GJSON https://github.com/anshori/leaflet-draw-to-geojson-file/blob/master/assets/js/app.js

var showExport = '<a href="#" onclick="geojsonExport()" title="Export to GeoJSON File" type="button" class="btn btn-danger btn-sm text-light"><i class="fa fa-file-code-o" aria-hidden="true"></i> Export</a>';

var showExportButton = new L.Control({ position: "topright" });
showExportButton.onAdd = function(map) {
    this._div = L.DomUtil.create('div');
    this._div.innerHTML = showExport
    return this._div;
};
showExportButton.addTo(map);

// Export to GeoJSON File
function geojsonExport() {
    let nodata = '{"type":"FeatureCollection","features":[]}';
    let jsonData = (JSON.stringify(editableLayers.toGeoJSON()));
    let dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(jsonData);
    let datenow = new Date();
    let datenowstr = datenow.toLocaleDateString('en-GB');
    let exportFileDefaultName = 'export_draw_' + datenowstr + '.geojson';
    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    if (jsonData == nodata) {
        alert('No features are drawn');
    } else {
        linkElement.click();
    }
};