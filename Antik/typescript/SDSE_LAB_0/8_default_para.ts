function greet1(name: string, greeting: string = "Hello"): string {
  return `${greeting}, ${name}!`;
}

console.log(greet1("Alice"));
console.log(greet1("Alice", "Good morning")); 