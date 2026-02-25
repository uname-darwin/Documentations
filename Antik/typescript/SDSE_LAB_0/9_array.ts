// Array of numbers
let numbers: number[] = [1, 2, 3, 4, 5];

// Array of strings
let fruits: string[] = ["apple", "banana", "orange"];

// Empty arrays
let emptyNumbers: number[] = [];

//Working with Arrays
let scores: number[] = [85, 90, 78, 92];

// Access elements
let firstScore = scores[0];

// Array methods
scores.push(88);             // Add to end
scores.pop();                // Remove from end
let len = scores.length;  // Get length

// Loop through array
for (let score of scores) {
  console.log(score);
}

