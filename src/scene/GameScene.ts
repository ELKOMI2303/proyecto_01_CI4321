import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  AmbientLight,
  DirectionalLight,
  Box3,
  Sphere,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Vehicle from "../entyties/Vehicle";
import cube from "../shapes/Cube";
import skybox from "../shapes/Skybox";
import plane from "../shapes/plane";

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
  private cubeHits: number = 0;

  // Bounding Box para el cubo
  private cubeBoundingBox: Box3;

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
    directionalLight.position.set(10, 5, 15);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
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

    // Añadir el cubo y calcular su Bounding Box
    this._scene.add(cube);
    cube.position.set(0, 1.5, 10);
    this.cubeBoundingBox = new Box3().setFromObject(cube);

    // Añadir el cielo y el plano
    this._scene.add(skybox);
    this._scene.add(plane);
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
    cube.position.set(0, 1.5, 10); // Mueve el cubo en la escena según lo necesites
  };

  private onKeyDown = (event: KeyboardEvent) => {
    const delta = 0.016;

    switch (event.key.toLowerCase()) {
      case "arrowup":
        this._vehicle.rotateCannonPitch(-0.1);
        break;
      case "arrowdown":
        this._vehicle.rotateCannonPitch(0.1);
        break;
      case "arrowleft":
        this._vehicle.rotateCannonYaw(0.1);
        break;
      case "arrowright":
        this._vehicle.rotateCannonYaw(-0.1);
        break;
      case "w":
        this._vehicle.moveForward(delta);
        break;
      case "s":
        this._vehicle.moveBackward(delta);
        break;
      case "a":
        this._vehicle.rotateLeft(delta);
        break;
      case "d":
        this._vehicle.rotateRight(delta);
        break;
      case " ":
        this._vehicle.shoot(this.shootMode);
        break;
      case "1":
        this.shootMode = "rectilinear";
        console.log("Modo de disparo: Rectilíneo");
        break;
      case "2":
        this.shootMode = "parabolic";
        console.log("Modo de disparo: Parabólico");
        break;
    }
  };

  public render = (time: number) => {
    requestAnimationFrame(this.render);
    const delta = (time - this.lastTime) / 1000;
    this.lastTime = time;

    // Actualizar y verificar colisiones
    this._vehicle.update(delta);

    // Obtener proyectiles desde el vehículo
    const projectiles = this._vehicle.getProjectiles();
    projectiles.forEach((projectile) => {
      // Si el cubo está destruido, ignora las colisiones
      if (this.cubeHits >= 3) {
        // Desactiva el proyectil si el cubo ya está destruido
        // projectile.deactivate();
        return;
      }

      // Crear una esfera de colisión para el proyectil
      const projectileBoundingSphere = new Sphere(
        projectile.mesh.position,
        projectile.radius
      );

      // Verificar colisión entre el proyectil y el cubo
      if (
        projectile.active &&
        projectileBoundingSphere.intersectsBox(this.cubeBoundingBox)
      ) {
        console.log("¡Impacto en el cubo!");
        this.cubeHits += 1; // Incrementa la vida del cubo

        // Cambia el color del cubo al recibir un impacto
        cube.material.color.setHex(0xff0000);

        // Elimina o desactiva el proyectil
        this._scene.remove(projectile.mesh);
        projectile.deactivate();

        // Restablece el color del cubo después de un corto tiempoa verde
        setTimeout(() => {
          if (this.cubeHits < 3) {
            cube.material.color.setHex(0x00ff00); // Solo cambia el color si no está destruido
          }
        }, 200);

        // Si la vida llega a 3, elimina el cubo
        if (this.cubeHits >= 3) {
          this._scene.remove(cube);
          console.log("¡Cubo destruido!");
        }
      }

      // Verificar si el proyectil ha impactado con el suelo
      else if ( projectile.active && projectile.mesh.position.y <= 0) {
        // Suponiendo que el suelo está en y = 0
        console.log("¡Impacto en el suelo!");
        this._scene.remove(projectile.mesh); // Remover el proyectil
        projectile.deactivate(); // Desactivar el proyectil
      }
    });

    this._controls.update();
    this._renderer.render(this._scene, this._camera);
  };
}

export default GameScene;
