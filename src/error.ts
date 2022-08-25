import { AxiosError } from 'axios';

export class NetworkError extends Error {
  constructor() {
    super('A network error occurred. Please check your connection and try again.');
  }
}

export class CircleError extends Error {
  code: number;
  message: string;

  constructor({ code, message }: { code: number; message: string }) {
    super(message);
    this.code = code;
    this.message = message;
  }
}

export function handleError(e: AxiosError | Error | unknown): NetworkError | CircleError | Error {
  if (e instanceof AxiosError && e.response) {
    return new CircleError(e.response.data);
  } else if (e instanceof AxiosError && e.request) {
    return new NetworkError();
  } else {
    return new Error('An unknown error occurred');
  }
}
