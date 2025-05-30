function hablar(texto) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = 'es-ES';
    speechSynthesis.speak(utterance);
  }
}

document.getElementById('btnUbicacion').addEventListener('click', () => {
  const instrucciones = document.getElementById('instrucciones');

  if (!navigator.geolocation) {
    instrucciones.textContent = "Geolocalización no soportada.";
    hablar("Geolocalización no soportada.");
    return;
  }

  navigator.geolocation.getCurrentPosition(pos => {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;

    fetch('/ruta', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lat, lon })
    })
      .then(res => res.json())
      .then(data => {
        instrucciones.textContent = data.instrucciones.join(' ');
        hablar(data.instrucciones.join('. '));
        mostrarMapa(lat, lon);
      });
  });
});

function mostrarMapa(lat, lon) {
  mapboxgl.accessToken = mapboxToken;
  const mapa = new mapboxgl.Map({
    container: 'mapa',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [lon, lat],
    zoom: 15
  });

  new mapboxgl.Marker().setLngLat([lon, lat]).addTo(mapa);
}
