import {
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
    AmbientLight,
    DirectionalLight,
    PlaneGeometry,
    MeshBasicMaterial,
    BackSide,
    Mesh,
    SphereGeometry,
  } from "three";
  import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
  import Vehicle from "../entyties/Vehicle";
  
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
      this._camera = new PerspectiveCamera(45, aspectRatio, 0.1, 1000);
      this._camera.position.set(10, 10, 10);
      this._camera.lookAt(0, 0, 0);
  
      window.addEventListener("resize", this.resize, false);
      window.addEventListener("keydown", this.onKeyDown, false);
  
      // Iluminación
      const ambientLight = new AmbientLight(0x404040);
      this._scene.add(ambientLight);
  
      const directionalLight = new DirectionalLight(0xffffff, 1.5);
      directionalLight.position.set(10, 10, 10);
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
    }
  
    private resize = () => {
      this._width = window.innerWidth;
      this._height = window.innerHeight;
      this._renderer.setSize(this._width, this._height);
      this._camera.aspect = this._width / this._height;
      this._camera.updateProjectionMatrix();
    };
  
    public load = () => {
      // Suelo
      const groundGeometry = new PlaneGeometry(200, 200);
      const groundMaterial = new MeshBasicMaterial({ color: 0x228b22 });
      const plane = new Mesh(groundGeometry, groundMaterial);
      plane.rotation.x = -Math.PI / 2;
      plane.position.y = 0.5;
      this._scene.add(plane);
  
      // Cielo
      const skyGeometry = new SphereGeometry(500, 32, 32);
      const skyMaterial = new MeshBasicMaterial({ color: 0x87ceeb, side: BackSide });
      const sky = new Mesh(skyGeometry, skyMaterial);
      this._scene.add(sky);
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