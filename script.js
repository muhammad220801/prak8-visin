// Inisialisasi peta
var map = new ol.Map({
    target: 'map',
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM()
        })
    ],
    view: new ol.View({
        center: ol.proj.fromLonLat([0, 0]),
        zoom: 2
    })
});

// Memuat data gempa dari file CSV
fetch('earthquake.csv')
    .then(response => response.text())
    .then(data => {
        // Parsing data CSV menjadi array objek
        var features = [];
        var rows = data.trim().split('\n');
        for (var i = 1; i < rows.length; i++) {
            var row = rows[i].split(',');
            var tgl = row[0];
            var ot = parseFloat(row[1]);
            var lat = parseFloat(row[2]);
            var lon = parseFloat(row[3]);
            var depth = parseFloat(row[4]);
            var mag = parseFloat(row[5]);
            var remark = row[6];

            // Membuat fitur marker untuk setiap gempa
            var marker = new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.fromLonLat([lon, lat])),
                tgl: tgl,
                ot: ot,
                lat: lat,
                lon: lon,
                depth: depth,
                mag: mag,
                remark: remark
            });
            features.push(marker);
        }

        // Membuat layer vector untuk menampilkan marker
        var vectorSource = new ol.source.Vector({
            features: features
        });
        var vectorLayer = new ol.layer.Vector({
            source: vectorSource
        });
        map.addLayer(vectorLayer);

        // Menambahkan fungsi event click pada marker
        map.on('click', function (event) {
            map.forEachFeatureAtPixel(event.pixel, function (feature) {
                var properties = feature.getProperties();
                var content = '<h2>Informasi Gempa</h2>' +
                    '<p><strong>Tanggal:</strong> ' + properties.tgl + '</p>' +
                    '<p><strong>On Time:</strong> ' + properties.ot + '</p>' +
                    '<p><strong>Latitude:</strong> ' + properties.lat + '</p>' +
                    '<p><strong>Longitude:</strong> ' + properties.lon + '</p>' +
                    '<p><strong>Depth:</strong> ' + properties.depth + '</p>' +
                    '<p><strong>Magnitudo:</strong> ' + properties.mag + '</p>' +
                    '<p><strong>Lokasi:</strong> ' + properties.remark + '</p>';

                // Tampilkan info marker menggunakan library pop-up
                var element = document.getElementById('popup');
                var popup = new ol.Overlay({
                    element: element,
                    positioning: 'bottom-center',
                    stopEvent: false
                });
                map.addOverlay(popup);
                popup.setPosition(event.coordinate);
                element.innerHTML = content;
            });
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
