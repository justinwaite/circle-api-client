import { AxiosInstance } from 'axios';
import { createResourceUrl } from '../create-resource-url';
import { PublicKeyResponse } from '../circle.types';
import { handleError } from '../error';

export class EncryptionClient {
  static resourceBaseUrl = 'encryption';
  static createResourceUrl = (urlParts?: string[]) =>
    createResourceUrl([EncryptionClient.resourceBaseUrl, ...(urlParts ?? [])]);

  constructor(private readonly client: AxiosInstance) {}

  public async getPublicKey() {
    try {
      const response = await this.client.get<PublicKeyResponse>(EncryptionClient.createResourceUrl(['public']));

      return response.data;
    } catch (e) {
      handleError(e);
    }
  }
}
