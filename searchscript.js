var restaurant = [];
var map;
var markers = [];
var table;

function initMap() {
var options = {
    center: {lat: 1.3483, lng: 103.6831}, // Default is NTU
    zoom: 15,
    styles: [
        {
            "featureType": "poi",
            "stylers": [
                {"visibility": "off"} // Hide points of interest
            ]
        }
    ]
};

map = new google.maps.Map(document.getElementById('map'), options);

autocomplete = new google.maps.places.Autocomplete(
    document.getElementById('autocomplete'),
    {types: ['geocode']}
);

autocomplete.addListener('place_changed', searchNearbyPlaces);
}

function searchNearbyPlaces() {
clearMarkers();

var place = autocomplete.getPlace();
console.log(place);

if (!place.geometry || !place.geometry.location) {
    alert("No details available for input: '" + place.name + "'");
    return;
}

map.setCenter(place.geometry.location);

var service = new google.maps.places.PlacesService(map);
service.nearbySearch({
    location: place.geometry.location,
    radius: '500',
    type: ['restaurant']
}, callback);
}

function callback(results, status) {
if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
        createMarker(results[i]);
    }
}
}

function createMarker(place) {
var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location,
    title: place.name,
    icon: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png' // Custom marker icon
});

markers.push(marker);

var infowindow = new google.maps.InfoWindow({
    content: '<strong>' + place.name + '</strong><br>' +
        'Rating: ' + (place.rating || 'Not available') + '<br>' +
        'Address: ' + (place.vicinity || 'Not available') + '<br>' +
        'Price Level: ' + (place.price_level !== undefined ? '$'.repeat(place.price_level + 1) : 'Not available') + '<br>' 
});

marker.addListener('click', function () {
    infowindow.open(map, marker);
});

// Append restaurant information to the table
var table = document.getElementById("places");
var row = table.insertRow();
var cell1 = row.insertCell(0);
//var cell2 = row.insertCell(1);
//var cell3 = row.insertCell(2);
//var cell4 = row.insertCell(3);
cell1.innerHTML = place.name;
if (place.photos) {
    var photoUrl = place.photos[0].getUrl();
    var cell2 = row.insertCell(1);
    cell2.innerHTML = '<img width="500" height="500" src="' + photoUrl + '">';
} else {
    var photoUrl = "https://via.placeholder.com/150";
    var cell2 = row.insertCell(1);
    cell2.innerHTML = '<img width="500" height="500" src="' + photoUrl + '">';
}
//cell2.innerHTML = place.rating || 'Not available';
//cell3.innerHTML = place.vicinity || 'Not available';
//cell4.innerHTML = place.price_level !== undefined ? '$'.repeat(place.price_level + 1) : 'Not available';
/* if (place.photos && place.photos.length > 0) {
    var photoUrl = place.photos[0].getUrl();
    cell4.innerHTML = '<img src="' + photoUrl + '" width="100" height="100">';
} else {
    cell4.innerHTML = 'No photo available';
}*/
}

function clearMarkers() {
for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
}
markers = [];
}






/*
function initMap(){
var options = {
    zoom:16,
    center:{lat:1.3483,lng:103.6831}
}

let map = new google.maps.Map(document.getElementById('map'),options);

let markerOptions = {
    position: new google.maps.LatLng(1.3483,103.6831),
    map: map
    
}

let marker = new google.maps.Marker(markerOptions)




} */

function pickRandomRestaurant() {
    var table = document.getElementById("places");
    var rowCount = table.rows.length;
    if (rowCount > 0) {
        var randomIndex = Math.floor(Math.random() * rowCount);
        var randomRow = table.rows[randomIndex];
        var randomRestaurantName = randomRow.cells[0].innerText;
        document.getElementById("randomRestaurant").innerText = "Randomly selected restaurant: " + randomRestaurantName;
    } else {
        document.getElementById("randomRestaurant").innerText = "No restaurants found nearby.";
    }
}
