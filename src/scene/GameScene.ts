import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  AmbientLight,
  DirectionalLight,
  PlaneGeometry,
  MeshBasicMaterial,

  Mesh,

} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Vehicle from "../entyties/Vehicle";
import cube from "../shapes/Cube";
import skybox from "../shapes/skybox";
import plane from "../shapes/plane";

// import Skybox from "../shapes/Skybox";

class GameScene {
  private static _instance = new GameScene();
  public static get instance() {
    return this._instance;
  }

  private _width: number;
  private _height: number;
  private _renderer: WebGLRenderer;
  private _camera: PerspectiveCamera;
  private readonly _scene = new Scene();
  private _vehicle: Vehicle;
  private _controls: OrbitControls;

  private lastTime: number = 0;

  // Estado para el modo de disparo
  private shootMode: "rectilinear" | "parabolic" = "rectilinear";

  private constructor() {
    this._width = window.innerWidth;
    this._height = window.innerHeight;
    this._renderer = new WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    this._renderer.setPixelRatio(window.devicePixelRatio);
    this._renderer.setSize(this._width, this._height);

    const targetElement = document.querySelector<HTMLDivElement>("#app");
    if (!targetElement) {
      throw "unable to find target element";
    }

    targetElement.appendChild(this._renderer.domElement);

    const aspectRatio = this._width / this._height;
    this._camera = new PerspectiveCamera(45, aspectRatio, 0.1, 30000);
    this._camera.position.set(10, 10, 10);
    this._camera.lookAt(0, 0, 0);

    window.addEventListener("resize", this.resize, false);
    window.addEventListener("keydown", this.onKeyDown, false);

    // Iluminación
    const ambientLight = new AmbientLight(0x404040);
    this._scene.add(ambientLight);

    const directionalLight = new DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(10, 10, 10);
    // Habilitar sombras
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024; // Tamaño de las sombras
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 500;
    this._scene.add(directionalLight);

    // Crear controles de órbita
    this._controls = new OrbitControls(this._camera, this._renderer.domElement);
    this._controls.enableDamping = true;
    this._controls.dampingFactor = 0.05;
    this._controls.screenSpacePanning = false;
    this._controls.maxPolarAngle = Math.PI / 2;
    this._controls.minDistance = 5;
    this._controls.maxDistance = 50;

    // Crear y añadir el vehículo
    this._vehicle = new Vehicle();
    this._scene.add(this._vehicle.group);

    // Asignar el Skybox como fondo de la escena
    // this._scene.background = Skybox; // Aquí se agrega el Skybox
  }

  private resize = () => {
    this._width = window.innerWidth;
    this._height = window.innerHeight;
    this._renderer.setSize(this._width, this._height);
    this._camera.aspect = this._width / this._height;
    this._camera.updateProjectionMatrix();
  };

  public load = () => {


    this._scene.add(skybox);
    skybox.position.set(0, 0, 0);


    this._scene.add(plane);


    // Añadir el cubo a la escena
    this._scene.add(cube);

    // Opcional: Ajustar la posición del cubo si es necesario
    cube.position.set(0, 3, 10); // Mueve el cubo en la escena según lo necesites
  };

  private onKeyDown = (event: KeyboardEvent) => {
    const delta = 0.016; // Asumir ~60 FPS, 16ms por frame

    switch (event.key.toLowerCase()) {
      case "arrowup": // Mover el cañón hacia arriba
        this._vehicle.rotateCannonPitch(-0.1);
        break;
      case "arrowdown": // Mover el cañón hacia abajo
        this._vehicle.rotateCannonPitch(0.1);
        break;
      case "arrowleft": // Rotar el cañón a la izquierda
        this._vehicle.rotateCannonYaw(0.1);
        break;
      case "arrowright": // Rotar el cañón a la derecha
        this._vehicle.rotateCannonYaw(-0.1);
        break;
      case "w": // Adelante
        this._vehicle.moveForward(delta);
        break;
      case "s": // Atrás
        this._vehicle.moveBackward(delta);
        break;
      case "a": // Rotar a la izquierda
        this._vehicle.rotateLeft(delta);
        break;
      case "d": // Rotar a la derecha
        this._vehicle.rotateRight(delta);
        break;
      case " ": // Disparar
        this._vehicle.shoot(this.shootMode);
        break;
      case "1": // Cambiar a disparo rectilíneo
        this.shootMode = "rectilinear";
        console.log("Modo de disparo: Rectilíneo");
        break;
      case "2": // Cambiar a disparo parabólico
        this.shootMode = "parabolic";
        console.log("Modo de disparo: Parabólico");
        break;
    }
  };

  public render = (time: number) => {
    requestAnimationFrame(this.render);
    const delta = (time - this.lastTime) / 1000; // delta en segundos
    this.lastTime = time;

    this._vehicle.update(delta);
    this._controls.update();
    this._renderer.render(this._scene, this._camera);
  };
}

export default GameScene;
