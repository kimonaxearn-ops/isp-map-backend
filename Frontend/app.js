const API = "https://your-render-backend-url.onrender.com/api/devices";

const map = L.map("map").setView([22.7196, 75.8577], 12);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
}).addTo(map);

// Load Existing Markers
async function loadMarkers() {
  const res = await fetch(API);
  const data = await res.json();

  data.forEach(d => {
    L.marker([d.latitude, d.longitude])
      .addTo(map)
      .bindPopup(`<b>${d.name}</b><br>${d.type}<br>${d.description}`);
  });
}
loadMarkers();

// Add Device
async function addDevice() {
  const payload = {
    name: document.getElementById("name").value,
    type: document.getElementById("type").value,
    latitude: parseFloat(document.getElementById("latitude").value),
    longitude: parseFloat(document.getElementById("longitude").value),
    description: document.getElementById("description").value,
  };

  await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  alert("Device Added");
  location.reload();
}
