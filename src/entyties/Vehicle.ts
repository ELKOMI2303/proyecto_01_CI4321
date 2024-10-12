import { Group, Mesh, MeshBasicMaterial, BoxGeometry, CylinderGeometry, SphereGeometry, Object3D } from "three";

class Vehicle {
    public group: Group;
    private cannon: Object3D;
    private cannonSphere: Mesh; // Referencia a la esfera del cañón
    private cannonBarrelContainer: Object3D; // Contenedor para el barril del cañón
    private cannonBarrel: Mesh; // Referencia al barril del cañón

    constructor() {
        this.group = new Group();

        // Cuerpo del vehículo (paralelepípedo)
        const bodyGeometry = new BoxGeometry(4.5, 2, 6);
        const bodyMaterial = new MeshBasicMaterial({ color: 0x555555 });
        const body = new Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 1;  // Posición en Y para que esté sobre el suelo
        this.group.add(body);

        // Ruedas (cilindros)
        const wheelGeometry = new CylinderGeometry(1, 1, 0.5, 32);
        const wheelMaterial = new MeshBasicMaterial({ color: 0x333333 });

        // Posiciones de las ruedas
        const wheelPositions = [
            [-2.5, 0.5, -2],  // Trasera izquierda
            [2.5, 0.5, -2],   // Trasera derecha
            [-2.5, 0.5, 2],   // Delantera izquierda
            [2.5, 0.5, 2]     // Delantera derecha
        ];

        // Añadir ruedas completas
        wheelPositions.forEach(pos => {
            const wheel = new Mesh(wheelGeometry, wheelMaterial);
            wheel.rotation.z = Math.PI / 2;  // Rotar la rueda para que quede de lado
            wheel.position.set(pos[0], pos[1], pos[2]);
            this.group.add(wheel);

            // Paralelepípedo dentro del cilindro (parte central de la rueda)
            const centerGeometry = new BoxGeometry(0.6, 0.6, 0.6); // Ajusta el tamaño
            const centerMaterial = new MeshBasicMaterial({ color: 0xff0000 });
            const wheelCenter = new Mesh(centerGeometry, centerMaterial);
            // Ajustar la posición del paralelepípedo central
            wheelCenter.position.set(pos[0], pos[1], pos[2]);  // Centrarlo en la rueda
            this.group.add(wheelCenter);
        });

        // Cañón
        this.cannon = new Object3D();

        // Esfera (base del cañón)
        const cannonSphereGeometry = new SphereGeometry(1.8, 32, 32);
        const cannonSphereMaterial = new MeshBasicMaterial({ color: 0xff0000 });
        this.cannonSphere = new Mesh(cannonSphereGeometry, cannonSphereMaterial);
        this.cannonSphere.position.set(0, 0, -3);  // Posición centrada en el cuerpo del vehículo
        this.cannon.add(this.cannonSphere);

        // Contenedor para el barril del cañón
        this.cannonBarrelContainer = new Object3D();
        this.cannonBarrelContainer.position.set(0, 0, -3); // Coloca el contenedor en el borde de la esfera

        // Barril del cañón (paralelepípedo)
        const cannonBarrelGeometry = new BoxGeometry(0.5, 0.5, 3);
        const cannonBarrelMaterial = new MeshBasicMaterial({ color: 0x000000 });
        this.cannonBarrel = new Mesh(cannonBarrelGeometry, cannonBarrelMaterial);
        
        // Ajustar la posición del barril para que sobresalga de la esfera
        this.cannonBarrel.position.set(0, 1, -1.5); // Colocar el barril en la posición correcta
        this.cannonBarrelContainer.add(this.cannonBarrel); // Agregar el barril al contenedor
        this.cannon.add(this.cannonBarrelContainer); // Agregar el contenedor al cañón

        this.cannon.position.set(0, 2, 3);  // Ajusta la posición general del cañón
        this.group.add(this.cannon);
    }

    /**
     * Rota el barril del cañón horizontalmente (izquierda y derecha)
     * @param angle En radianes
     */
    public rotateCannonYaw(angle: number) {
        this.cannonBarrelContainer.rotation.y += angle; // Rota el contenedor sobre el eje Y
    }

    /**
     * Rota el barril del cañón verticalmente (hacia arriba y hacia abajo)
     * @param angle En radianes
     */
    public rotateCannonPitch(angle: number) {
        const newRotationX = this.cannonBarrel.rotation.x + angle;

        // Limitar la rotación vertical (pitch)
        if (newRotationX > Math.PI / 4) {
            this.cannonBarrel.rotation.x = Math.PI / 4; // Limitar hacia arriba
        } else if (newRotationX < 0) { // Verificar si está en la posición inicial
            this.cannonBarrel.rotation.x = 0; // Mantener en la posición inicial
        } else {
            this.cannonBarrel.rotation.x = newRotationX;
        }
    }
}

export default Vehicle;
