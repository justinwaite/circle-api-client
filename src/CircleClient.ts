import type { AxiosInstance } from 'axios';
import axios from 'axios';
import type {
  CreateWalletData,
  ValidatedPaginationParams,
  PaginationParams,
  ResourceListResponse,
  ResourceResponse,
  CircleWallet,
  CircleAddress,
  GenerateBlockchainAddressData,
  Transfer,
  CreateTransferData,
  TransferListParams,
} from './circle.types';

const createResourceUrl = (urlParts: string[]) => '/' + urlParts.join('/');

class WalletClient {
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

class TransferClient {
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

export class CircleClient {
  client: AxiosInstance;
  wallet: WalletClient;
  transfer: TransferClient;

  constructor(apiKey: string, baseUrl: string) {
    this.client = axios.create({
      baseURL: baseUrl,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
    });

    this.wallet = new WalletClient(this.client);
    this.transfer = new TransferClient(this.client);
  }
}
