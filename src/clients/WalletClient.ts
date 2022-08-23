import { AxiosInstance } from 'axios';
import {
  CircleAddress,
  CircleWallet,
  CreateWalletData,
  GenerateBlockchainAddressData,
  PaginationParams,
  ResourceListResponse,
  ResourceResponse,
  ValidatedPaginationParams,
} from '../circle.types';
import { createResourceUrl } from '../create-resource-url';

export class WalletClient {
  static resourceBaseUrl = 'wallets';
  static createResourceUrl = (urlParts?: string[]) =>
    createResourceUrl([WalletClient.resourceBaseUrl, ...(urlParts ?? [])]);

  constructor(private client: AxiosInstance) {}

  async create(createWalletData: CreateWalletData): Promise<ResourceResponse<CircleWallet>> {
    const response = await this.client.post<ResourceResponse<CircleWallet>>(
      WalletClient.resourceBaseUrl,
      createWalletData
    );
    return response.data;
  }

  async list<T extends PaginationParams>(
    params: ValidatedPaginationParams<T>
  ): Promise<ResourceListResponse<CircleWallet>> {
    const response = await this.client.get(WalletClient.resourceBaseUrl, { params });
    return response.data;
  }

  async get(walletId: string): Promise<ResourceResponse<CircleWallet>> {
    const response = await this.client.get<ResourceResponse<CircleWallet>>(WalletClient.createResourceUrl([walletId]));
    return response.data;
  }

  async generateBlockchainAddress(
    walletId: string,
    blockchainAddressData: GenerateBlockchainAddressData
  ): Promise<ResourceResponse<CircleAddress>> {
    const response = await this.client.post<ResourceResponse<CircleAddress>>(
      WalletClient.createResourceUrl([walletId, 'addresses']),
      blockchainAddressData
    );
    return response.data;
  }

  async listBlockchainAddresses<T extends PaginationParams>(
    walletId: string,
    params: ValidatedPaginationParams<T>
  ): Promise<ResourceListResponse<CircleAddress>> {
    const response = await this.client.get<ResourceListResponse<CircleAddress>>(
      WalletClient.createResourceUrl([walletId, 'addresses']),
      { params }
    );
    return response.data;
  }
}
