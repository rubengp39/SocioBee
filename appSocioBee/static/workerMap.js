let map = L.map('map').setView([43.2708, -2.9375], 6)

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Console coordinates in mouse click.
map.on('click', function(e) {
    var coord = e.latlng;
    var lat = coord.lat;
    var lng = coord.lng;
    console.log("You clicked the map at latitude: " + lat + " and longitude: " + lng);
});

// Get coordinates of a layer.
function getCorners(layer) {
    const corners = layer.getBounds();

    const northwest = corners.getNorthWest();
    const northeast = corners.getNorthEast();
    const southeast = corners.getSouthEast();
    const southwest = corners.getSouthWest();

    return [northwest, northeast, southeast, southwest];
};

var prevLayerClicked = null

function onEachFeature(feature, layer) {
    //bind click
    layer.on('click', function(e) {
        /* console.log(layer._latlngs); */

        if (prevLayerClicked !== null) {
            // Reset style
            prevLayerClicked.setStyle({
                weight: 2,
                opacity: 1,
                color: '#3c8dfe',
                dashArray: '',
                fillOpacity: 0.3,
                fillColor: "#3c8dfe"
            });
        }
        map.fitBounds(e.target.getBounds());
        var layer = e.target;
        layer.setStyle({
            weight: 2,
            color: 'green',
            dashArray: '',
            fillOpacity: 0.3,
            fillColor: 'gray'
        });
        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }
        //info.update(layer.feature.properties.availability);
        prevLayerClicked = layer;
    })
};


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