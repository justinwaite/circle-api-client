import type { AxiosInstance } from 'axios';
import axios from 'axios';
import { CardClient } from './clients/CardClient';
import { WalletClient } from './clients/WalletClient';
import { TransferClient } from './clients/TransferClient';
import { EncryptionClient } from './clients/EncryptionClient';

export class CircleClient {
  protected client: AxiosInstance;

  wallet: WalletClient;
  transfer: TransferClient;
  card: CardClient;
  encryption: EncryptionClient;

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
    this.card = new CardClient(this.client);
    this.encryption = new EncryptionClient(this.client);
  }
}
