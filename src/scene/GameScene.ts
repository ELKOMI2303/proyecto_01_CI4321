import { PerspectiveCamera, Scene, WebGLRenderer, AmbientLight, DirectionalLight } from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Vehicle from "../entyties/Vehicle";
import cube from "../shapes/Cube";

class GameScene {
    private static _instance = new GameScene();
    public static get instance() {
        return this._instance;
    }

    private _width: number;
    private _height: number;
    private _redenrer: WebGLRenderer;
    private _camera: PerspectiveCamera;
    private readonly _scene = new Scene();
    private _vehicle: Vehicle;
    private _controls: OrbitControls;  // Añadir controles de órbita

    private constructor() {
        this._width = window.innerWidth;
        this._height = window.innerHeight;
        this._redenrer = new WebGLRenderer({
            alpha: true,
            antialias: true
        });
        this._redenrer.setPixelRatio(window.devicePixelRatio);
        this._redenrer.setSize(this._width, this._height);

        const targetElement = document.querySelector<HTMLDivElement>("#app");
        if (!targetElement) {
            throw "unable to find target element";
        }

        targetElement.appendChild(this._redenrer.domElement);

        const aspectRatio = this._width / this._height;
        this._camera = new PerspectiveCamera(45, aspectRatio, 0.1, 1000);
        this._camera.position.set(10, 10, 10);
        this._camera.lookAt(0, 0, 0);

        window.addEventListener("resize", this.resize, false);
        window.addEventListener("keydown", this.onKeyDown, false);

        // Iluminación
        const ambientLight = new AmbientLight(0x404040); // Luz ambiental
        this._scene.add(ambientLight);

        const directionalLight = new DirectionalLight(0xffffff, 1);
        directionalLight.position.set(10, 10, 10);
        this._scene.add(directionalLight);

        // Crear controles de órbita
        this._controls = new OrbitControls(this._camera, this._redenrer.domElement);
        this._controls.enableDamping = true;  // Permitir movimiento suave
        this._controls.dampingFactor = 0.05;  // Factor de suavidad
        this._controls.screenSpacePanning = false;  // Deshabilitar movimiento en espacio de pantalla
        this._controls.maxPolarAngle = Math.PI / 2;  // Limitar rotación vertical
        this._controls.minDistance = 5;  // Zoom mínimo
        this._controls.maxDistance = 50;  // Zoom máximo

        // Crear y añadir el vehículo
        this._vehicle = new Vehicle();
        this._scene.add(this._vehicle.group);
    }

    private resize = () => {
        this._width = window.innerWidth;
        this._height = window.innerHeight;
        this._redenrer.setSize(this._width, this._height);
        this._camera.aspect = this._width / this._height;
        this._camera.updateProjectionMatrix();
    }

    public load = () => {
      //  this._scene.add(cube);
    };


    private onKeyDown = (event: KeyboardEvent) => {
        switch (event.code) {
            case 'ArrowUp': // Mover el cañón hacia arriba
                this._vehicle.rotateCannonPitch(0.1); // Ajustar el valor para la velocidad de inclinación
                break;
            case 'ArrowDown': // Mover el cañón hacia abajo
                this._vehicle.rotateCannonPitch(-0.1); // Ajustar el valor para la velocidad de inclinación
                break;
            case 'ArrowLeft': // Rotar el cañón a la izquierda
                this._vehicle.rotateCannonYaw(0.1); // Ajustar el valor para la velocidad de rotación
                break;
            case 'ArrowRight': // Rotar el cañón a la derecha
                this._vehicle.rotateCannonYaw(-0.1); // Ajustar el valor para la velocidad de rotación
                break;
        }
    }


    public render = () => {
        requestAnimationFrame(this.render);
        this._controls.update();  // Actualizar controles de órbita
        this._redenrer.render(this._scene, this._camera);
    }
}

export default GameScene;