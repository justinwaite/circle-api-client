import { AxiosInstance } from 'axios';
import { CardSuccessResponse, CreateCardParams } from '../circle.types';
import { createResourceUrl } from '../create-resource-url';
import { handleError } from '../error';

export class CardClient {
  static resourceBaseUrl = 'cards';
  static createResourceUrl = (urlParts?: string[]) =>
    createResourceUrl([CardClient.resourceBaseUrl, ...(urlParts ?? [])]);

  constructor(private client: AxiosInstance) {}

  public async createCard(params: CreateCardParams): Promise<CardSuccessResponse> {
    try {
      const response = await this.client.post<CardSuccessResponse>(CardClient.resourceBaseUrl, params);

      return response.data;
    } catch (e) {
      throw handleError(e);
    }
  }
}
