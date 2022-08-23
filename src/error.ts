export class NetworkError extends Error {
  constructor() {
    super('A network error occurred. Please check your connection and try again.');
  }
}
