import {
    Group,
    Mesh,
    MeshBasicMaterial,
    BoxGeometry,
    CylinderGeometry,
    SphereGeometry,
    Object3D,
    Vector3,
  } from "three";
  
  class Vehicle {
    public group: Group;
    private cannon: Object3D;
    private cannonSphere: Mesh;
    private cannonBarrelContainer: Object3D;
    private cannonBarrel: Mesh;
    private speed: number;
    private rotationSpeed: number;
    private wheels: Mesh[] = []; // Referencia a las ruedas y sus centros
    private wheelCenters: Mesh[] = []; // Referencia a los cubos de las ruedas
  
    constructor() {
      this.group = new Group();
  
      // Cuerpo del vehículo (paralelepípedo)
      const bodyGeometry = new BoxGeometry(4.5, 2, 6);
      const bodyMaterial = new MeshBasicMaterial({ color: 0x555555 });
      const body = new Mesh(bodyGeometry, bodyMaterial);
      body.position.y = 1; // Posición en Y para que esté sobre el suelo
      this.group.add(body);
  
      // Ruedas (cilindros)
      const wheelGeometry = new CylinderGeometry(1, 1, 0.5, 32);
      const wheelMaterial = new MeshBasicMaterial({ color: 0x333333 });
  
      // Posiciones de las ruedas
      const wheelPositions = [
        [-2.5, 0.5, -2], // Trasera izquierda
        [2.5, 0.5, -2], // Trasera derecha
        [-2.5, 0.5, 2], // Delantera izquierda
        [2.5, 0.5, 2], // Delantera derecha
      ];
  
      // Añadir ruedas completas
      wheelPositions.forEach((pos) => {
        const wheel = new Mesh(wheelGeometry, wheelMaterial);
        wheel.rotation.z = Math.PI / 2; // Rotar la rueda para que quede de lado
        wheel.position.set(pos[0], pos[1], pos[2]);
        this.group.add(wheel);
        this.wheels.push(wheel); // Añadir la rueda a la lista
  
        // Paralelepípedo dentro del cilindro (parte central de la rueda)
        const centerGeometry = new BoxGeometry(0.6, 0.6, 0.6); // Ajusta el tamaño
        const centerMaterial = new MeshBasicMaterial({ color: 0xff0000 });
        const wheelCenter = new Mesh(centerGeometry, centerMaterial);
        wheelCenter.position.set(pos[0], pos[1], pos[2]); // Centrarlo en la rueda
        this.group.add(wheelCenter);
        this.wheelCenters.push(wheelCenter); // Añadir el centro de la rueda a la lista
      });
  
      // Cañón
      this.cannon = new Object3D();
  
      // Esfera (base del cañón)
      const cannonSphereGeometry = new SphereGeometry(1.8, 32, 32);
      const cannonSphereMaterial = new MeshBasicMaterial({ color: 0xff0000 });
      this.cannonSphere = new Mesh(cannonSphereGeometry, cannonSphereMaterial);
      this.cannonSphere.position.set(0, 0, -3); // Posición centrada en el cuerpo del vehículo
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
  
      this.cannon.position.set(0, 2, 3); // Ajusta la posición general del cañón
      this.group.add(this.cannon);
  
      this.group.position.y = 1;
  
      // Velocidad del vehículo
      this.speed = 0.1;
      this.rotationSpeed = 0.03;
    }
  
    public rotateCannonYaw(angle: number) {
      this.cannonBarrelContainer.rotation.y += angle; // Rota el contenedor sobre el eje Y
    }
  
    public rotateCannonPitch(angle: number) {
      const newRotationX = this.cannonBarrel.rotation.x + angle;
      if (newRotationX > Math.PI / 4) {
        this.cannonBarrel.rotation.x = Math.PI / 4; // Limitar hacia arriba
      } else if (newRotationX < 0) {
        this.cannonBarrel.rotation.x = 0; // Mantener en la posición inicial
      } else {
        this.cannonBarrel.rotation.x = newRotationX;
      }
    }
  
    private rotateWheels(angle: number) {
      this.wheels.forEach((wheel) => {
        wheel.rotation.x -= angle; // Girar las ruedas en la dirección contraria
      });
      this.wheelCenters.forEach((center) => {
        center.rotation.x -= angle; // Girar los cubos en la dirección contraria
      });
    }
  
    public moveForward() {
      const direction = new Vector3(0, 0, -1);
      direction.applyQuaternion(this.group.quaternion);
      this.group.position.add(direction.multiplyScalar(this.speed));
      this.rotateWheels(this.speed); // Girar las ruedas al moverse hacia adelante
    }
  
    public moveBackward() {
      const direction = new Vector3(0, 0, 1);
      direction.applyQuaternion(this.group.quaternion);
      this.group.position.add(direction.multiplyScalar(this.speed));
      this.rotateWheels(-this.speed); // Girar las ruedas al moverse hacia atrás (dirección inversa)
    }
  
    public rotateLeft() {
      this.group.rotation.y += this.rotationSpeed;
    }
  
    public rotateRight() {
      this.group.rotation.y -= this.rotationSpeed;
    }
  }
  
  export default Vehicle;
  