let map;
let directionsService;
let directionsRenderer;

// commented this variable out as it isn't being used currently
// var jamBtn = document.getElementById("jamBtn");

// $(".btn1").click(initMap);

// $(".btn1").keyup(function(event){
//     if(event.keyCode === 13){
        
//         initMap();
//     }
// });

// function redirect() {
//     var url = "trafficjam.html";
//     window.location(url);
// };

function initMap() {
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    map = new google.maps.Map(document.getElementById("map-display"), {
        zoom: 7,    // how zoomed in the map opens to by default
        center: { lat: 39.0997, lng: -94.5786 } // coords to center on kansas city by default
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
            logEvents(end);  // Fetches events for the destination city here
        } else {
            alert('Directions request failed due to ' + status);
        }
    });
}

function logEvents(destinationCity) {
    var currentDate = new Date();
    var startDateTime = dayjs(currentDate).format('YYYY-MM-DDTHH:mm:ss[Z]'); // created a start and end time for consistent results
    var endDateTime = dayjs(currentDate).add(5, 'day').format('YYYY-MM-DDTHH:mm:ss[Z]');

    var apiUrl = 'https://app.ticketmaster.com/discovery/v2/events.json?apikey=7HwTMtBK3dWlMhriu6lhzXhwYy9AjgIK&locale=*&startDateTime=' + startDateTime + '&endDateTime=' + endDateTime + '&city=' + destinationCity + '&size=10&sort=date,asc';

    fetch(apiUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            if (!data || !data._embedded || !data._embedded.events) {
                alert('No events found for this city within the next 5 days.');
                return;
            }
            displayEvents(data._embedded.events);
        })
        .catch(function(error) {
            console.error('Error fetching events:', error);
            alert('Failed to fetch events. Please try again later.');
        });
}

function displayEvents(events) {
    var eventsContainer = document.getElementById('events-container');
    if (!eventsContainer) {
        eventsContainer = document.createElement('ul');
        eventsContainer.id = 'events-container';
        document.querySelector('.inner-box2').appendChild(eventsContainer); 
    }
    
    eventsContainer.innerHTML = ''; // Clears previous results

    events.forEach(function(event) {
        var anchor = document.createElement('a');
        anchor.href = event.url;
        anchor.textContent = event.name;
        anchor.target = "_blank"; // Opens in new tab

        var listItem = document.createElement('li');
        listItem.appendChild(anchor);
        eventsContainer.appendChild(listItem);
    });
}

initMap();

