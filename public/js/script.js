// const socket = io();


// if(navigator.geolocation){
//     navigator.geolocation.watchPosition((position) => {
//         const {latitude, longitude} = position.coords;
//         socket.emit("send-location", {latitude, longitude})
//     }, (error) => {
//         console.error(error)
//     },
//     {
//         enableHighAccuracy: true,
//         timeout: 5000,
//         maximumAge: 0
//     }
// )
// }

// const map = L.map("map").setView([0, 0], 16);

// L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//     attribution: "Ankan"
// }).addTo(map)

// const markers = {};

// socket.on("receive-location", (data) => {
//     const {id, latitude, longitude} = data;
//     // map.setView([latitude, longitude]);
//     if(markers[id]){
//         markers[id].setLanLng([latitude, longitude])
//     }
//     else{
//         markers[id] = L.marker([latitude, longitude]).addTo(map)
//     }
// })

// socket.on("user-disconnet", (id) => {
//     if(markers[id]){
//         map.removeLayer(markers[id]);
//         delete markers[id]
//     }
// })


// const socket = io();
// const map = L.map("map").setView([0, 0], 16); // Temporary initial position
// let currentUserMarker = null;

// L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//     attribution: "Ankan"
// }).addTo(map);

// if (navigator.geolocation) {
//     navigator.geolocation.watchPosition(
//         (position) => {
//             const { latitude, longitude } = position.coords;
//             socket.emit("send-location", { latitude, longitude });
            
//             // Update map view to current user's location
//             map.setView([latitude, longitude], 16);
            
//             // Add/update current user's marker
//             if (!currentUserMarker) {
//                 currentUserMarker = L.marker([latitude, longitude]).addTo(map);
//             } else {
//                 currentUserMarker.setLatLng([latitude, longitude]);
//             }
//         },
//         (error) => {
//             console.error(error);
//         },
//         {
//             enableHighAccuracy: true,
//             timeout: 5000,
//             maximumAge: 0
//         }
//     );
// }

// const markers = {};

// socket.on("receive-location", (data) => {
//     const { id, latitude, longitude } = data;
//     if (markers[id]) {
//         markers[id].setLatLng([latitude, longitude]); // Corrected method name
//     } else {
//         markers[id] = L.marker([latitude, longitude]).addTo(map);
//     }
// });

// socket.on("user-disconnected", (id) => { // Corrected event name
//     if (markers[id]) {
//         map.removeLayer(markers[id]);
//         delete markers[id];
//     }
// });


const socket = io();
const map = L.map("map").setView([0, 0], 16);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "Ankan"
}).addTo(map);

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            socket.emit("send-location", { latitude, longitude });
            map.setView([latitude, longitude], 16);
        },
        (error) => {
            console.error(error);
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        }
    );
}

const markers = {};

socket.on("receive-location", (data) => {
    const { id, latitude, longitude } = data;
    
    if (markers[id]) {
        markers[id].setLatLng(getOffsetPosition([latitude, longitude]));
    } else {
        // New marker added
        console.log(`New user connected with ID: ${id}`);
        alert(`New user joined the map! ID: ${id}`); // Optional alert
        
        // Create a new marker with a custom icon
        const markerIcon = L.icon({
            iconUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-icon.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            tooltipAnchor: [16, -28]
        });
        
        markers[id] = L.marker(getOffsetPosition([latitude, longitude]), { icon: markerIcon })
            .addTo(map)
            .bindPopup(`User   ID: ${id}`); // Add popup with ID
    }
});

socket.on("user-disconnected", (id) => {
    if (markers[id]) {
        console.log(`User   disconnected: ${id}`);
        alert(`User   left the map: ${id}`); // Optional alert
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});

// Helper function to get an offset position
function getOffsetPosition(position) {
    const offset = 0.0001; // adjust this value to change the offset distance
    const randomOffset = Math.random() * offset * 2 - offset;
    return [position[0] + randomOffset, position[1] + randomOffset];
}