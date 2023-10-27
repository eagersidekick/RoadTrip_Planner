//Const Key = "AIzaSyDbC_Uzl7VrAEB6Mnc-h5xjmCiR9qNUREs"

let map;

async function initMap() {
    const { Map } = await google.maps.importLibrary("maps");
  
    map = new Map(document.getElementById("map"), {
      center: { lat: -34.397, lng: 150.644 },
      zoom: 8,
    });
  }

// function initMap(){
//     map = new google.maps.Map(document.getElementById('map'),{
//         center: { lat: 37.7749, lng: -122.4194},
//         zoom: 13,
//     })
//     google.maps.event.addListener(map, "click", function (event){
//         this.setOptions({scrollWheel:true})
//     });
// }

initMap();