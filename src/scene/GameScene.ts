import { PerspectiveCamera, Scene, WebGLRenderer, AmbientLight, DirectionalLight, PlaneGeometry, MeshBasicMaterial, DoubleSide,BackSide, Mesh, SphereGeometry } from "three";
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
    
        const groundGeometry = new PlaneGeometry(200, 200); // Crear un plano de 200x200 unidades
        const groundMaterial = new MeshBasicMaterial({ color:0x228B22}); // Suelo de color verde
        const plane = new Mesh(groundGeometry, groundMaterial);
        plane.rotation.x = -Math.PI / 2; // Rotar para que quede plano sobre el eje XZ
        plane.position.y = 0.5; // Colocarlo a nivel del suelo
        this._scene.add(plane);


                // Crear una esfera grande para el cielo
        const skyGeometry = new SphereGeometry(500, 32, 32); // Una esfera grande
        const skyMaterial = new MeshBasicMaterial({ color: 0x87CEEB, side: BackSide }); // Azul claro tipo cielo
        const sky = new Mesh(skyGeometry, skyMaterial);
        this._scene.add(sky);


    };


    private onKeyDown = (event: KeyboardEvent) => {
        switch (event.key.toLowerCase()) {  // Asegurar que reconozca las teclas en minúsculas
            case 'arrowup': // Mover el cañón hacia arriba
                this._vehicle.rotateCannonPitch(0.1); 
                break;
            case 'arrowdown': // Mover el cañón hacia abajo
                this._vehicle.rotateCannonPitch(-0.1); 
                break;
            case 'arrowleft': // Rotar el cañón a la izquierda
                this._vehicle.rotateCannonYaw(0.1);
                break;
            case 'arrowright': // Rotar el cañón a la derecha
                this._vehicle.rotateCannonYaw(-0.1); 
                break;
            case 'w': // Adelante
                this._vehicle.moveForward();
                break;
            case 's': // Atrás
                this._vehicle.moveBackward();
                break;
            case 'a': // Rotar a la izquierda
                this._vehicle.rotateLeft();
                break;
            case 'd': // Rotar a la derecha
                this._vehicle.rotateRight();
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