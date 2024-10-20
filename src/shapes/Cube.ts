import { BoxGeometry, Mesh, MeshBasicMaterial, TextureLoader } from "three";

// Cargar la textura
const textureLoader = new TextureLoader();
const texture = textureLoader.load('/texturas.png'); // Cambia 'ruta_de_la_textura.jpg' por la ruta de tu imagen

// Crear la geometría del cubo
const geometry = new BoxGeometry(5, 5, 5);

// Crear el material con la textura
const material = new MeshBasicMaterial({ map: texture });

// Crear el cubo con la geometría y el material
const cube = new Mesh(geometry, material);

export default cube;
