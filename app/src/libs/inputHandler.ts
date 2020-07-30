/*
  Handles our I/O from the discord client to our backend scripts and services
*/

export class inputHandler {
  constructor() {

  }

  handler(message: string) {
    switch (message) {
      case 'new':
        // Create an instance of a new embed
        break;


      case 'add':
        // Handle getting input on which field to add.
        break;

      case 'preview':
        break;

      default:
        break;
    }
  }
}