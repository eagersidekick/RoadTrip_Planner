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
            logEvents(end);  // fetches events for the destination city
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

function displayEvents(events, destinationCity) {
    var eventsResultContainer = document.getElementById('events-result-container');
    var cityNameEl = document.getElementById('city-name');
    eventsResultContainer.innerHTML = '';   // clears previous results
    cityNameEl.textContent = destinationCity;   // sets name dynamically

    events.forEach(function(event) {
        var eventDiv = document.createElement('div');
        eventDiv.className = 'event-item';

        var anchor = document.createElement('a');
        anchor.href = event.url;
        anchor.textContent = event.name;
        anchor.target = "_blank";   // opens in a new tab
        eventDiv.appendChild(anchor);

        // created a button to call function to save event to local storage
        var saveButton = document.createElement('button');
        saveButton.textContent = '💾';  // save icon 
        saveButton.onclick = function() {
            saveEvent(event);
        };
        eventDiv.appendChild(saveButton);

        eventsResultContainer.appendChild(eventDiv);
    });
}

function saveEvent(event) {
    var savedEvents = JSON.parse(localStorage.getItem('savedEvents')) || [];
    savedEvents.push(event);
    localStorage.setItem('savedEvents', JSON.stringify(savedEvents));
    displaySavedEvents();
}

function displaySavedEvents() {
    var savedEvents = JSON.parse(localStorage.getItem('savedEvents')) || [];
    var eventsContainer = document.getElementById('events-container');
    eventsContainer.innerHTML = ''; // clears current list

    savedEvents.forEach(function(event) {
        var anchor = document.createElement('a');
        anchor.href = event.url;
        anchor.textContent = event.name;
        anchor.target = "_blank";

        var listItem = document.createElement('li');
        listItem.appendChild(anchor);
        eventsContainer.appendChild(listItem);
    });
}

// Load saved events on page load
window.onload = function() {
    displaySavedEvents();
};

initMap();