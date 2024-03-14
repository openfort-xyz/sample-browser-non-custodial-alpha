/**
 * Prompts the user to input a PIN and validates it.
 * The function ensures the PIN is a string of at least four digits.
 * It will prompt repeatedly until a valid PIN is entered.
 * @returns A valid PIN string.
 */
export function requestPin(): string {
  let pin: string | null = "";
  const pinRegex = /^\d{4,}$/; // Regular expression to check for at least four digits

  while (!pinRegex.test(pin)) {
    pin = prompt("Input your PIN (must be at least four digits):", "");
    if (pin === null) {
      // User pressed cancel, you can handle this case as you want.
      // Here, we're just throwing an error. You might want to return null or a default value.
      throw new Error("PIN entry cancelled by the user.");
    }
  }

  return pin;
}
