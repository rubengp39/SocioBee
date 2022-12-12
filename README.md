# SocioBee

# Tipo de datos de cells

## Actual
### Llamada a la api

http://localhost:7777/surfaces/?latX=43.3167&longX=2.9466&latY=43.3443&longY=3&distance=1000

![Llamada](https://github.com/rubengp39/SocioBee/blob/master/image.png)

### Resultado
```
  "{\"coordX\": [43.3167, 2.9466],
    \"coordY\": [43.3443, 3.0],
    \"cells\": [{
                \"coordX11\": [43.3167, 2.9466],
                \"coordY11\": [43.32570000900001, 2.9589699080189162]},

                {\"coordX21\": [43.32570000900001, 2.9589699080189162],
                \"coordY21\": [43.32570000900001, 2.971339816037832]},

                {\"coordX31\": [43.32570000900001, 2.971339816037832],
                \"coordY31\": [43.32570000900001, 2.983709724056748]},

                {\"coordX41\": [43.32570000900001, 2.983709724056748],
                \"coordY41\": [43.32570000900001, 2.9960796320756637]
                }]
  }"
```

## [GeoJSON](https://geojson.org)
Podemos ver que las coordenadas de GeoJSON se representan como longitud, latitud (al contrario de lo que habiamos hecho).

Es remarcable mencionar que los poligonos necesitan siempre un punto más que el número de sus lados, para cerrar el polígono. Por ejemplo, si tenemos un cuadrado tendrá 5 coordenadas.

```
  {
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
    }
    
```
