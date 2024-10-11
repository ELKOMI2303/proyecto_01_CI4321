
import { PerspectiveCamera, Scene, WebGLRenderer} from "three";
import cube from "../shapes/Cube";

class GameScene{
    private static _instance = new GameScene();
    public static get instance(){
        return this._instance;
    }



    private _width: number;
    private _height: number;
    private _redenrer: WebGLRenderer;
    private _camera: PerspectiveCamera;

    private readonly _scene = new Scene();

    private constructor(){
        this._width = window.innerWidth;
        this._height = window.innerHeight;
        this._redenrer = new WebGLRenderer({
            alpha: true,
            antialias: true
        });
        this._redenrer.setPixelRatio(window.devicePixelRatio);
        this._redenrer.setSize(this._width,this._height);

        const targetElement = document.querySelector<HTMLDivElement>("#app");
        if(!targetElement){
            throw "unable to find target element";
        }

        targetElement.appendChild(this._redenrer.domElement);

        const aspectRatio = this._width/this._height;
        this._camera = new PerspectiveCamera(45,aspectRatio,0.1,1000);
        this._camera.position.set(5,5,5);
        this._camera.lookAt(cube.position);


      window.addEventListener("resize",this.resize,false);
    }

    private resize = () =>{
        this._width =window.innerWidth;
        this._height = window.innerHeight;
        this._redenrer.setSize(this._width,this._height);
        this._camera.aspect = this._width/this._height;
        this._camera.updateProjectionMatrix();
    }

    public load = ()=>{
        this._scene.add(cube);
    };


    public render = () =>{
        requestAnimationFrame(this.render);
        this._redenrer.render(this._scene,this._camera);
        
    }

   
}


export default GameScene;