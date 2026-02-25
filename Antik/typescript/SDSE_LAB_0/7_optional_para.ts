//Use ? to make a parameter optional
function introduce(name: string, age?: number): string {
  if (age) {
    return `My name is ${name} and I'm ${age} years old`;
  }
  return `My name is ${name}`;
}

console.log(introduce("Bob"));
console.log(introduce("Bob", 30));



