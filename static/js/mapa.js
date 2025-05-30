mapboxgl.accessToken = MAPBOX_TOKEN;
const map = new mapboxgl.Map({
  container: 'mapa',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [-63.17, -17.78], // Santa Cruz ejemplo
  zoom: 12
});

document.getElementById('btnUbicacion').addEventListener('click', () => {
  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords;

    new mapboxgl.Marker().setLngLat([longitude, latitude]).addTo(map);
    map.setCenter([longitude, latitude]);

    fetch('/ruta', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ destino: "hospital" })
    })
    .then(res => res.json())
    .then(data => {
      document.getElementById('instrucciones').innerText = data.instrucciones;
    });
  });
});
