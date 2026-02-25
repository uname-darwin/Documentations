//Tuples are arrays with fixed length and types:

// Tuple with 2 elements: string and number
let person: [string, number];
person = ["Alice", 25];
console.log(person);

// Access elements
let x1 = person[0];        // "Alice" (string)
let x2 = person[1];         // 25 (number)

// person = [25, "Alice"];   // Error: wrong order
// person = ["Alice"];       // Error: wrong length

// More examples
let coordinate: [number, number] = [10, 20]; 
let userData: [number, string, boolean] = [1, "John", true]; 
