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
  (T extends PageBeforeAndPageAfter ? 'Please either choose `pageBefore` or `pageAfter`.' : T);

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

interface BillingDetails {
  /**
   * Full name of the card or bank account holder.
   */
  name: string;
  /**
   * City portion of the address.
   */
  city: string;
  /**
   * Country portion of the address. Formatted as a two-letter country code specified in ISO 3166-1 alpha-2.
   */
  country: string;
  /**
   * Line one of the street address.
   */
  line1: string;
  /**
   * Line two of the street address.
   */
  line2?: string | null;
  /**
   * State / County / Province / Region portion of the address. If the country is US or Canada, then district is
   * required and should use the two-letter code for the subdivision.
   */
  district?: string | null;
  /**
   * Postal / ZIP code of the address.
   */
  postalCode: string;
}

export interface CreateCardParams {
  idempotencyKey: string;
  keyId: string;
  encryptedData: string;
  billingDetails: BillingDetails;
  expMonth: number;
  expYear: number;
  metadata: {
    email: string;
    phoneNumber?: string | null;
    sessionId: string;
    ipAddress: string;
  };
}

export type CardErrorCode =
  | 'verification_failed'
  | 'verification_fraud_detected'
  | 'verification_denied'
  | 'verification_not_supported_by_issuer'
  | 'verification_stopped_by_issuer'
  | 'card_failed'
  | 'card_invalid'
  | 'card_address_mismatch'
  | 'card_zip_mismatch'
  | 'card_cvv_invalid'
  | 'card_expired'
  | 'card_limit_violated'
  | 'card_not_honored'
  | 'card_cvv_required'
  | 'credit_card_not_allowed'
  | 'card_account_ineligible'
  | 'card_network_unsupported';

export interface Card {
  /**
   * Unique system generated identifier for the payment item.
   */
  id: string;
  /**
   * Status of the account. A pending status indicates that the linking is in-progress; complete indicates the account
   * was linked successfully; failed indicates it failed.
   */
  status: 'pending' | 'complete' | 'failed';
  billingDetails: BillingDetails;
  /**
   * Two-digit number representing the card's expiration month.
   */
  expMonth: number;
  /**
   * Four-digit number representing the card's expiration year.
   */
  expYear: number;
  /**
   * The network of the card.
   */
  network: string;
  /**
   * The last 4 digits of the card.
   */
  last4: string;
  /**
   * The bank identification number (BIN), the first 6 digits of the card.
   */
  bin?: string | null;
  /**
   * The country code of the issuer bank. Follows the ISO 3166-1 alpha-2 standard.
   */
  issuerCountry?: string | null;
  /**
   * The funding type of the card. Possible values are credit, debit, prepaid, and unknown.
   */
  fundingType?: 'credit' | 'debit' | 'prepaid' | 'unknown' | null;
  /**
   * A UUID that uniquely identifies the account number. If the same account is used more than once, each card object
   * will have a different id, but the fingerprint will stay the same.
   */
  fingerprint: string;
  /**
   * Indicates the failure reason of the card verification. Only present on cards with failed verification.
   */
  errorCode?: CardErrorCode | null;
  /**
   * Indicates the status of the card for verification purposes.
   */
  verification?: null | {
    /**
     * Status of the AVS check. Raw AVS response, expressed as an upper-case letter. not_requested indicates check was
     * not made. pending is pending/processing.
     */
    avs: string;
    /**
     * Enumerated status of the check. not_requested indicates check was not made. pass indicates value is correct.
     * fail indicates value is incorrect. unavailable indicates card issuer did not do the provided check. pending
     * indicates check is pending/processing.
     */
    cvv: 'not_requested' | 'pass' | 'fail' | 'unavailable' | 'pending';
    /**
     * Results of risk evaluation. Only present if the payment is denied by Circle's risk service.
     */
    riskEvaluation?: null | {
      /**
       * Enumerated decision of the account.
       */
      decision?: 'approved' | 'denied' | 'review' | null;
      /**
       * Risk reason for the definitive decision outcome.
       */
      reason?: string | null;
    };
    metadata: {
      /**
       * Email of the user.
       */
      email: string;
      /**
       * Phone number of the user in E.164 format. We recommend using a library such as libphonenumber to parse and
       * validate phone numbers.
       */
      phoneNumber?: string | null;
    };
    /**
     * ISO-8601 UTC date/time format.
     */
    createDate: string;
    /**
     * ISO-8601 UTC date/time format.
     */
    updateDate: string;
  };
}

export interface CardSuccessResponse {
  data: Card;
}

export interface CircleErrorResponse {
  code: number;
  message: string;
}

export type PublicKeyResponse = {
  keyId: string;
  publicKey: string;
};
