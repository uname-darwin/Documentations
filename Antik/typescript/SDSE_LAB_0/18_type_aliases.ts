//Give a name to any type:

// Instead of writing this repeatedly
let ind1: string | number;
let ind2: string | number;
let ind3: string | number;

// Create a type alias
type ID = string | number;

let id1: ID;
let id2: ID;
let id3: ID;


// Alias for object shape
type Point = {
  x: number;
  y: number;
};
let point1: Point = { x: 10, y: 20 };
let point2: Point = { x: 5, y: 15 };