const reconocimiento = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
reconocimiento.lang = 'es-ES';
reconocimiento.continuous = true;

reconocimiento.onresult = (e) => {
  const comando = e.results[e.results.length - 1][0].transcript.trim().toLowerCase();
  console.log('Comando:', comando);

  if (comando.includes("dónde estoy")) {
    document.getElementById('btnUbicacion').click();
  } else if (comando.includes("quién está adelante")) {
    detectarPersona();
  }
};

reconocimiento.start();
