
let map;
let directionsService;
let directionsRenderer;
function initMap() {
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 6,
        center: { lat: 39.0997, lng: -94.5786 }
    });
    directionsRenderer.setMap(map);
}
function calcRoute() {
    let start = document.getElementById("start").value;
    let end = document.getElementById("destination").value;
    let request = {
        origin: start,
        destination: end,
        travelMode: 'DRIVING'
    };
    directionsService.route(request, function(result, status) {
        if (status == 'OK') {
            directionsRenderer.setDirections(result);
        } else {
            alert('Directions request failed due to ' + status);
        }
    });
}