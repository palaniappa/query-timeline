/**
 * Will return message with passed in parameter.
 * @param {string} [name="You"]
 */
export function setMessage(name = 'Trino'): string {
  return `Hello World and ${name}!`;
}
