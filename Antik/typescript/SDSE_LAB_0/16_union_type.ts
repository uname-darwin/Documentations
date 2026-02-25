//A value can be one of several types
// Can be string OR number
let id: string | number;

id = "ABC123";
id = 12345;
// id = true;   // Error - boolean not allowed

// Function that accepts multiple types
function printId(id: string | number): void {
  console.log(`Your ID is: ${id}`);
}

printId("ABC123");
printId(12345);
