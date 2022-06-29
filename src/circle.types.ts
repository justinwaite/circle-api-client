export interface ResourceResponse<T> {
  data: T;
}

export interface ResourceListResponse<T> {
  data: T[];
}

export interface PaginationParams {
  from?: string; // ISO 8601
  to?: string; // ISO 8601
  pageBefore?: string;
  pageAfter?: string;
  pageSize: number;
}

interface PageBeforeAndPageAfter {
  pageBefore: string;
  pageAfter: string;
}

export type ValidatedPaginationParams<T extends PaginationParams> = T &
  (T extends PageBeforeAndPageAfter ? 'Please either choose `pageBefore` or `pageAfter`.' : never);

interface Amount {
  amount: string;
  currency: string;
}

export interface CreateWalletData {
  idempotencyKey: string;
  description: string;
}

export interface CircleWallet {
  walletId: string;
  entityId: string;
  type: string;
  description: string;
  balances: Amount[];
}

export interface GenerateBlockchainAddressData {
  idempotencyKey: string;
  currency: string;
  chain: string;
}

export interface CircleAddress {
  address: string;
  addressTag?: string;
  currency: string;
  chain: string;
}

interface TransferSourceBase {
  type: 'wallet' | 'blockchain';
}

export interface TransferSourceWallet extends TransferSourceBase {
  type: 'wallet';
  id: string;
}

export interface TransferSourceBlockchain extends TransferSourceBase {
  type: 'blockchain';
  chain: string;
}

export type TransferSource = TransferSourceWallet | TransferSourceBlockchain;

interface TransferDestinationBase {
  type: 'wallet' | 'blockchain';
}

export interface TransferDestinationWallet extends TransferDestinationBase {
  type: 'wallet';
  id: string;
  address?: string;
  addressTag?: string;
}

export interface TransferDestinationBlockchain extends TransferDestinationBase {
  type: 'blockchain';
  address: string;
  addressTag?: string;
  chain: string;
}

export type TransferDestination = TransferDestinationWallet | TransferDestinationBlockchain;

export interface CreateTransferData {
  idempotencyKey: string;
  source: TransferSource;
  destination: TransferDestination;
  amount: Amount;
}

export enum TransferStatus {
  pending = 'pending',
  complete = 'complete',
  failed = 'failed',
}

export enum TransferErrorCode {
  insufficientFunds = 'insufficient_funds',
  blockchainError = 'blockchain_error',
  transferDenied = 'transfer_denied',
  transferFailed = 'transfer_failed',
}

export interface Transfer {
  id: string;
  source: TransferSource;
  destination: TransferDestination;
  amount: Amount;
  transactionHash?: string;
  status: `${TransferStatus}`;
  errorCode?: `${TransferErrorCode}`;
  createDate: string;
}

export interface TransferListParams extends PaginationParams {
  walletId?: string;
  sourceWalletId?: string;
  destinationWalletId?: string;
}

export enum NotificationType {
  payments = 'payments',
  reversals = 'reversals',
  chargebacks = 'chargebacks',
  payouts = 'payouts',
  returns = 'returns',
  settlements = 'settlements',
  cards = 'cards',
  ach = 'ach',
  wire = 'wire',
  transfers = 'transfers',
}

interface NotificationBase {
  clientId: string;
  notificationType: `${NotificationType}`;
  version: number;
  customAttributes: unknown;
}

export interface PaymentNotification extends NotificationBase {
  notificationType: NotificationType.payments;
  payment: unknown;
}

export interface ReversalNotification extends NotificationBase {
  notificationType: NotificationType.reversals;
  reversal: unknown;
}

export interface ChargebackNotification extends NotificationBase {
  notificationType: NotificationType.chargebacks;
  chargeback: unknown;
}

export interface PayoutNotification extends NotificationBase {
  notificationType: NotificationType.payouts;
  payout: unknown;
}

export interface ReturnNotification extends NotificationBase {
  notificationType: NotificationType.returns;
  return: unknown;
}

export interface SettlementNotification extends NotificationBase {
  notificationType: NotificationType.settlements;
  settlement: unknown;
}

export interface CardNotification extends NotificationBase {
  notificationType: NotificationType.cards;
  card: unknown;
}

export interface AchNotification extends NotificationBase {
  notificationType: NotificationType.ach;
  ach: unknown;
}

export interface WireNotification extends NotificationBase {
  notificationType: NotificationType.wire;
  wire: unknown;
}

export interface TransferNotification extends NotificationBase {
  notificationType: NotificationType.transfers;
  transfer: Transfer;
}

export type CircleNotification =
  | PaymentNotification
  | ReversalNotification
  | ChargebackNotification
  | PayoutNotification
  | ReturnNotification
  | SettlementNotification
  | CardNotification
  | AchNotification
  | WireNotification
  | TransferNotification;
