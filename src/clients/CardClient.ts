import { AxiosError, AxiosInstance } from 'axios';
import { CardSuccessResponse, CreateCardParams } from '../circle.types';
import { createResourceUrl } from '../create-resource-url';
import { NetworkError } from '../error';

export class CardError extends Error {
  code: number;
  message: string;

  constructor({ code, message }: { code: number; message: string }) {
    super(message);
    this.code = code;
    this.message = message;
  }
}

export class CardClient {
  static resourceBaseUrl = 'cards';
  static createResourceUrl = (urlParts?: string[]) =>
    createResourceUrl([CardClient.resourceBaseUrl, ...(urlParts ?? [])]);

  constructor(private client: AxiosInstance) {}

  public async createCard(params: CreateCardParams) {
    try {
      return await this.client.post<CardSuccessResponse>(CardClient.resourceBaseUrl, params);
    } catch (e: AxiosError | Error | unknown) {
      if (e instanceof AxiosError) {
        if (e.response) {
          console.log('[createCard]: Failed to create card:');
          console.error(e.response.data);
          console.error(e.response.status);
          console.error(e.response.headers);
          throw new CardError(e.response.data);
        } else if (e.request) {
          throw new NetworkError();
        }
        console.error(e.config);
      } else {
        console.error('[createCard]: Unknown error:', e);
        throw new Error('An unknown error occurred');
      }
    }
  }
}
