import type { AxiosError } from 'axios';
import axios from 'axios';

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
  if (axios.isAxiosError(e) && e.response) {
    return new CircleError(e.response.data as { code: number; message: string });
  } else if (axios.isAxiosError(e) && e.request) {
    return new NetworkError();
  } else {
    return new Error('An unknown error occurred');
  }
}
