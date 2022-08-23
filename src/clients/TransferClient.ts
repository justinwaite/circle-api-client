import { AxiosInstance } from 'axios';
import {
  CreateTransferData,
  ResourceListResponse,
  ResourceResponse,
  Transfer,
  TransferListParams,
  ValidatedPaginationParams,
} from '../circle.types';
import { createResourceUrl } from '../create-resource-url';

export class TransferClient {
  static resourceBaseUrl = 'transfers';
  static createResourceUrl = (urlParts?: string[]) =>
    createResourceUrl([TransferClient.resourceBaseUrl, ...(urlParts ?? [])]);

  constructor(private client: AxiosInstance) {}

  async create(createTransferData: CreateTransferData): Promise<ResourceResponse<Transfer>> {
    const response = await this.client.post<ResourceResponse<Transfer>>(
      TransferClient.resourceBaseUrl,
      createTransferData
    );
    return response.data;
  }

  async list<T extends TransferListParams>(
    params: ValidatedPaginationParams<T>
  ): Promise<ResourceListResponse<Transfer>> {
    const response = await this.client.get<ResourceListResponse<Transfer>>(TransferClient.resourceBaseUrl, {
      params,
    });
    return response.data;
  }

  async get(transferId: string): Promise<ResourceResponse<Transfer>> {
    const response = await this.client.get<ResourceResponse<Transfer>>(TransferClient.createResourceUrl([transferId]));
    return response.data;
  }
}
