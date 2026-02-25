//What is OOPs?
// OOPs stands for Object-Oriented Programming. It is a programming paradigm that uses "objects" to design applications and programs. It allows developers to create modular, reusable, and organized code by encapsulating data and behavior into objects. 
// The main principles of OOPs are:
// 1. Encapsulation: This is the concept of bundling data (attributes) and methods (functions) that operate on the data into a single unit called a class. It also restricts direct access to some of the object's components, which is a means of preventing accidental interference and misuse of the data. *** In TypeScript, we can use access modifiers like private, protected, and public to achieve encapsulation. ***
// 2. Inheritance: This allows a new class (called a child or subclass) to inherit properties and behaviors (attributes and methods) from an existing class (called a parent or superclass). This promotes code reusability and establishes a natural hierarchical relationship between classes.
// 3. Polymorphism: This allows objects of different classes to be treated as objects of a common superclass. It enables a single interface to represent different underlying forms (data types). In TypeScript, we can achieve polymorphism through method overriding and interfaces.


// What is class in OOPs?
// A class is a blueprint or template for creating objects. It defines the structure and behavior of the objects that will be created from it. 
// A class typically contains attributes (also known as fields or properties) that represent the state of the object, 
// and methods (functions) that define the behavior of the object. In TypeScript, we can define a class using the `class` keyword, and we can create instances (objects) of that class using the `new` keyword.

// Class1 (Example).
class Car {
    // 1. ATTRIBUTES (also known as Fields or Properties)
    // These define the state of the object (data).
    brand: string;
    speed: number;
    private isEngineOn: boolean; // *** Private is Encapsulation. This attribute is only accessible within the class and cannot be accessed from outside the class. This can be used in Attributes or methods or both. This is a way to achieve Encapsulation in OOPs. Encapsulation is the concept of bundling data (attributes) and methods (functions) that operate on the data into a single unit called a class. It also restricts direct access to some of the object's components, which is a means of preventing accidental interference and misuse of the data. In TypeScript, we can use access modifiers like private, protected, and public to achieve encapsulation.

    // 2. CONSTRUCTOR
    // A special method used to initialize attributes when an object is created.
    // this.keyword refers to the current instance of the class.
    constructor(brand: string, speed: number) {
        this.brand = brand;
        this.speed = speed;
        this.isEngineOn = false; // Default value
    }

    // 3. METHODS (Functions)
    // These define the actions/behaviors of the object.
    accelerate(amount: number): void {
        this.speed += amount;
        console.log(`${this.brand} is now going ${this.speed} km/h.`);
    }
    // this is also a method but it is private method because it is only accessible inside the class and it is not accessible outside the class because it is private method(private is Encapsulation)
    turnOn(): void {
        this.isEngineOn = true;
        console.log(`${this.brand} engine turned on.`);
    }
}


// //Class 1 example is complete. We have defined a class called Car with attributes brand, speed, and isEngineOn. We have also defined a constructor to initialize these attributes and two methods: accelerate and turnOn. The isEngineOn attribute is private, which means it cannot be accessed from outside the class, demonstrating encapsulation.
// // --- Usage ---
// // Creating an instance (object) of the class
// const myCar = new Car("Toyota", 0); // here we dont need to pass the value of isEngineOn because it is already initialized in the constructor with a default value of false.

// // Accessing Attributes
// console.log(myCar.brand); // Output: Toyota

// // Calling Methods
// myCar.turnOn();           // Output: Toyota engine turned on.
// myCar.accelerate(50);     // Output: Toyota is now going 50 km/h.
// // myCar.isEngineOn; // Error: Property 'isEngineOn' is private and only accessible within class 'Car'. This is because isEngineOn is a private attribute and it cannot be accessed outside the class.
// // In summary, a class in OOPs is a blueprint for creating objects that encapsulates data and behavior, allowing for modular and reusable code.

// //-- Usage Complete --


// Inheritance and Composition in OOPs

// Inheritance is a fundamental principle of OOPs that allows a new class (called a child or subclass) to inherit properties and behaviors (attributes and methods) from an existing class (called a parent or superclass). This promotes code reusability and establishes a natural hierarchical relationship between classes. In TypeScript, we can use the `extends` keyword to create a subclass that inherits from a superclass.
// IS-A, One Sentence to understand this -> "A ElectricCar IS-A Car". This means that ElectricCar is a type of Car, and it inherits all the properties and behaviors of the Car class while also introducing its own specific attributes and methods.

// Example of Inheritance:
class ElectricCar extends Car {
    batteryCapacity: number;

    constructor(brand: string, speed: number, batteryCapacity: number) {
        super(brand, speed); // Call the constructor of the parent class (Car)
        this.batteryCapacity = batteryCapacity; // Initialize the new attribute specific to ElectricCar
    }

    chargeBattery(amount: number): void {
        console.log(`${this.brand} is charging the battery by ${amount} kWh.`);
    }
}

// Usage of Inheritance:
const myElectricCar = new ElectricCar("Tesla", 0, 100);
myElectricCar.turnOn();
myElectricCar.accelerate(60);
myElectricCar.chargeBattery(20);

// In this example, the ElectricCar class inherits from the Car class, meaning it has access to all the attributes and methods of the Car class (like brand, speed, turnOn, and accelerate) while also introducing its own attribute (batteryCapacity) and method (chargeBattery). This demonstrates how inheritance promotes code reusability and allows us to create more specific types of objects based on a general template.