class BankAccount {
  public accountNumber: string;    // Accessible everywhere
  private balance: number;         // Only accessible inside this class
  
  constructor(accountNumber: string) {
    this.accountNumber = accountNumber;
    this.balance = 0;
  }

  // Public method to deposit money
  deposit(amount: number): void {
    this.balance += amount;
  }

  // Public method to check balance
  getBalance(): number {
    return this.balance;
  }
}

let account = new BankAccount("123456");
console.log(account.accountNumber);  // OK
account.deposit(100);                // OK
console.log(account.getBalance());   // OK - returns 100
// console.log(account.balance);     // Error - balance is private
