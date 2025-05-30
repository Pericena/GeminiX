let conocidos = [];

fetch('/familiares')
  .then(res => res.json())
  .then(data => {
    conocidos = data;
    // Aquí puedes cargar imágenes conocidas con face-api.js
  });

async function detectarPersona() {
  const video = document.getElementById('video');
  await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
  await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
  await faceapi.nets.faceLandmark68Net.loadFromUri('/models');

  const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors();

  if (detections.length > 0) {
    // Comparar detections con los embeddings conocidos
    document.getElementById('info').innerText = 'Persona detectada: María (mamá)';
  } else {
    document.getElementById('info').innerText = 'Nadie conocido identificado';
  }
}
