import { CubeTextureLoader } from 'three';

// Cargar las 6 texturas del Skybox
const loader = new CubeTextureLoader();
const Skybox = loader.load([
  '/right.png',   // Derecha
  '/left.png',    // Izquierda
  '/top.png',     // Arriba
  '/bottom.png',  // Abajo
  '/front.png',   // Frente
  '/back.png',    // Atrás
]);

export default Skybox;
