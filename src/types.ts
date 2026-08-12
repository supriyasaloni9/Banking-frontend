export type AccountType = 'checking' | 'savings' | 'credit' | 'investment';

export interface BankAccount {
  id: string;
  institutionId: string;
  institutionName: string;
  institutionLogo: string;
  accountName: string;
  accountType: AccountType;
  mask: string; // Last 4 digits
  officialName?: string;
  currentBalance: number;
  availableBalance: number;
  limit?: number; // Credit card limit
  currency: string;
  routingNumber: string;
  accountNumberFull: string;
  plaidAccessToken?: string;
  plaidItemId?: string;
  colorGradient: string;
  createdAt: string;
  updatedAt: string;
}

export type TransactionCategory =
  | 'Food & Dining'
  | 'Shopping'
  | 'Housing & Utilities'
  | 'Transportation'
  | 'Income & Payroll'
  | 'Subscriptions'
  | 'Investments'
  | 'Transfer'
  | 'Entertainment'
  | 'Health & Wellness';

export type TransactionStatus = 'completed' | 'pending' | 'failed';
export type TransactionType = 'debit' | 'credit';

export interface Transaction {
  id: string;
  accountId: string;
  accountMask: string;
  institutionName: string;
  amount: number; // positive for credit, negative for debit (or positive with type flag)
  type: TransactionType;
  category: TransactionCategory;
  merchantName: string;
  merchantLogo?: string;
  description: string;
  date: string; // YYYY-MM-DD format or ISO string
  status: TransactionStatus;
  location?: {
    city?: string;
    state?: string;
  };
  referenceNumber: string;
  isRecurring?: boolean;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  avatarUrl?: string;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  memberSince: string;
  monthlyBudgetLimit: number;
}

export interface TransferRequest {
  senderAccountId: string;
  recipientAccountId?: string;
  recipientEmail?: string;
  recipientName?: string;
  routingNumber?: string;
  accountNumber?: string;
  amount: number;
  memo: string;
  transferType: 'internal' | 'external' | 'p2p';
  speed: 'standard' | 'instant'; // standard = $0, instant = $1.50
}

export interface TransferRecord {
  id: string;
  transferNumber: string;
  senderAccountId: string;
  senderAccountName: string;
  senderMask: string;
  recipientName: string;
  recipientDetails: string;
  amount: number;
  fee: number;
  memo: string;
  speed: 'standard' | 'instant';
  status: 'processing' | 'completed' | 'failed';
  failureReason?: string;
  createdAt: string;
  estimatedArrival: string;
}

export interface SpendingAnalytics {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  netSavings: number;
  savingsRate: number; // percentage
  categoryBreakdown: {
    category: TransactionCategory;
    amount: number;
    percentage: number;
    color: string;
  }[];
  monthlyTrends: {
    month: string;
    income: number;
    expenses: number;
    savings: number;
  }[];
}

export interface SecurityLog {
  id: string;
  action: string;
  device: string;
  ipAddress: string;
  location: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  timestamp: string;
  read: boolean;
}
