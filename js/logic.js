

var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

const markerSize = mag => mag < 1 ? 1 : mag * 3

const markerColor =  mag => {
  return mag > 7 ? "#FF0000":
  mag > 6 ? "#FF3400":
  mag > 5 ? "#FF6900":
  mag > 4 ? "#FF9E00":
  mag > 3 ? "#FFC100":
  mag > 2 ? "#FFE400":
  mag > 1 ? "#F7FF00":
              "#47FF00"
}

d3.json(queryUrl, function(data) {
  console.log(data);
  createFeatures(data.features);
});


function createFeatures(earthquakeData) {

  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "<br>"
      + `Magnitude: ${feature.properties.mag}`);
  }

  var earthquakes =  L.geoJSON(earthquakeData, {
    pointToLayer: ((feature, latlng) => {
        return L.circleMarker(latlng, {

            radius: markerSize(feature.properties.mag),
            fillOpacity: 0.5,
            opacity: .8,
            color: 'black',
            fillColor: markerColor(feature.properties.mag),
            weight: 0.4,
        });

    }),
    onEachFeature: onEachFeature
})

  createMap(earthquakes);
  
}

function createMap(earthquakes) {

  var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 12,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets-satellite",
    accessToken: API_KEY
  });


  var baseMaps = {
    "Street Map": lightmap,
    "Satellite Map": satellitemap
  };

  var overlayMaps = {
    Earthquakes: earthquakes
  };

  var myMap = L.map("map", {
    center: [33.886917,9.537499],
    zoom: 1.6,
    layers: [lightmap, earthquakes]
    // layers: [lightmap]

  });

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  var info = L.control({
    position: "bottomright"
  });

    var info = L.control({position: 'bottomright'});

    info.onAdd = function () {

      var div = L.DomUtil.create('div', 'legend')
      var mags = [0, 1, 2, 3, 4, 5, 6, 7]

      for (var i = 0; i < mags.length; i++) {
        div.innerHTML +=
          '<b style="background:' + markerColor(mags[i]) + '">&nbsp;&nbsp;&nbsp;&nbsp;</b> ' +
            mags[i] + (mags[i + 1] ? '&ndash;' + mags[i + 1] + '<br>' : '+');
      }
    
      return div;
    };
    
    info.addTo(myMap);  
  
  };

