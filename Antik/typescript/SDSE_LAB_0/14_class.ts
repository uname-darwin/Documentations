// class Person {
//   // Properties
//   name: string;
//   age: number;

//   // Constructor - runs when creating a new Person
//   constructor(name: string, age: number) {
//     this.name = name;
//     this.age = age;
//   }

//   // Method
//   greet(): string {
//     return `Hello, my name is ${this.name}`;
//   }
//   antik(): string {
//     return `age vhi bata duuun ${this.age}`;
//   }
// }

// // Create instances
// // let person1 = new Person("Alice", 25);
// let person2 = new Person("Bob", 30);

// // console.log(person1.greet());
// console.log(`Hello, name is ${person2.name} and Age is  ${person2.age}`);

// //2
// console.log()

//------------------------------------------------------------------------------------------------------



// class Student {
//   name: string;
//   age: number;
//   //properties
//   constructor(name: string, age?: number) {
//     this.name = name;
//     this.age = age || 12;
//   }

//   setName(name: string): void {
//     this.name = name;
//   }
//   setAge(age: number): void {
//     this.age = age;
//   }
//   getAge(): string {
//     return `Age is ${this.age}`;
//   }
//   getName(): string {
//     return this.name;
//   }
// }

// let student1 = new Student("Antik", 22);
// let student2 = new Student("Biki");

// // console.log(student1.getName());
// console.log(student2.getAge());
// console.log(student2.getName());







//------------------------------------------------------------------------------------------------------
///////////////////////// new example of inheritance where super is not used here.
// 1 no class
class BankAccount {
  balance: number;
  constructor(initialBalance: number) {
    this.balance = initialBalance;
  }

  getBalance(): number {
    return this.balance;
  }
}
// 2 no class
class SavingsAccount extends BankAccount {
  // constructor (){         // idar constructor nahi hai so super ki koi zarurat nahi hai 
  //                         // and onw more question idhar kuuu zarurat nahi hai constructor ki ? Ans - 
  // }
  deposit(amount: number): void {
    if (amount > 0) {
      this.balance += amount
      console.log(`Deposited: ${amount}`)
    } else {
      console.log("Error: Deposit amount must be positive");
    }
  }

  withdraw(amount: number): void {
    if (amount <= 0) {
      console.log(`Error: Withdrawal amount must be positive`)
    } else if (amount > this.balance) {
      console.log(`Error: Insufficient balance`)
    } else {
      this.balance -= amount
      console.log(`Withdrawn: ${amount}`)
    }
  }
}


//////////////////////////////////////new example of inheritance where super is used
class Device {
  model: string;

  constructor(model: string) {
    this.model = model;
  }
}

class Computer extends Device {
  hasKeyboard: boolean;

  constructor(model: string, hasKeyboard: boolean) {
    super(model)
    this.hasKeyboard = hasKeyboard;
  }
  //
}

class Laptop extends Computer {
  batteryLife: number
  constructor(model: string, hasKeyboard: boolean, batteryLife: number) {
    super(model, hasKeyboard)
    this.batteryLife = batteryLife;

  }
  // add the methods(printDetails()) here
  printDetails(): void {
    console.log(`Model: ${this.model}`)
    console.log(`Has Keyboard: ${this.hasKeyboard}`)
    console.log(`Battery Life: ${this.batteryLife}`)
  }


}




