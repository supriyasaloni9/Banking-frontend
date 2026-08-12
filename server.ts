import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import {
  INITIAL_BANK_ACCOUNTS,
  INITIAL_TRANSACTIONS,
  INITIAL_USER,
  INITIAL_TRANSFERS,
  INITIAL_SECURITY_LOGS,
} from './src/data/mockData.js';
import { BankAccount, Transaction, TransferRecord, UserProfile, SecurityLog } from './src/types.js';


let serverUser: UserProfile = { ...INITIAL_USER };
let serverAccounts: BankAccount[] = [...INITIAL_BANK_ACCOUNTS];
let serverTransactions: Transaction[] = [...INITIAL_TRANSACTIONS];
let serverTransfers: TransferRecord[] = [...INITIAL_TRANSFERS];
let serverSecurityLogs: SecurityLog[] = [...INITIAL_SECURITY_LOGS];

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

async function startServer() {
  const app = express();

  app.use(express.json());


  app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });

  // ==========================================
  // AUTH API ENDPOINTS
  // ==========================================
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }


    const token = `horizon_jwt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    serverSecurityLogs.unshift({
      id: `sec_${Date.now()}`,
      action: 'User Sign-In Succeeded',
      device: req.headers['user-agent'] || 'Web Browser',
      ipAddress: '192.168.1.100',
      location: 'San Francisco, CA, USA',
      timestamp: new Date().toLocaleString(),
      status: 'success',
    });

    return res.json({
      user: serverUser,
      token,
      message: 'Authentication successful',
    });
  });

  app.post('/api/auth/register', (req: Request, res: Response) => {
    const { firstName, lastName, email, password } = req.body;
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    serverUser = {
      ...serverUser,
      id: `usr_${Date.now()}`,
      firstName,
      lastName,
      email,
    };

    const token = `horizon_jwt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    return res.json({
      user: serverUser,
      token,
      message: 'Account created successfully',
    });
  });

  app.get('/api/auth/me', (req: Request, res: Response) => {
    return res.json({ user: serverUser });
  });

  app.put('/api/auth/profile', (req: Request, res: Response) => {
    const updates = req.body;
    serverUser = { ...serverUser, ...updates };
    return res.json({ user: serverUser, message: 'Profile updated' });
  });

  app.post('/api/auth/forgot-password', (req: Request, res: Response) => {
    const { email } = req.body;
    return res.json({
      message: `If an account with ${email} exists, a password reset link has been dispatched.`,
    });
  });

  // ==========================================
  // BANK ACCOUNTS & PLAID INTEGRATION API
  // ==========================================
  app.get('/api/accounts', (req: Request, res: Response) => {
    return res.json({ accounts: serverAccounts });
  });

  app.post('/api/plaid/create-link-token', (req: Request, res: Response) => {
    // Simulated Plaid link token creation
    const linkToken = `link-sandbox-${Date.now()}-mock-token`;
    return res.json({
      link_token: linkToken,
      expiration: new Date(Date.now() + 3600 * 1000).toISOString(),
    });
  });

  app.post('/api/plaid/exchange-public-token', (req: Request, res: Response) => {
    const { public_token, institutionName, accountType } = req.body;

    const newBank: BankAccount = {
      id: `acc_plaid_${Date.now()}`,
      institutionId: `ins_${(institutionName || 'custom').toLowerCase().replace(/\s+/g, '')}`,
      institutionName: institutionName || 'Chase Bank',
      institutionLogo: 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=120&auto=format&fit=crop&q=80',
      accountName: `${institutionName || 'Linked Bank'} ${accountType || 'Checking'}`,
      accountType: accountType || 'checking',
      mask: `${Math.floor(1000 + Math.random() * 9000)}`,
      officialName: `${institutionName || 'Plaid Bank'} Verified Account`,
      currentBalance: 5240.00,
      availableBalance: 5240.00,
      currency: 'USD',
      routingNumber: '021000021',
      accountNumberFull: `99120038${Math.floor(1000 + Math.random() * 9000)}`,
      colorGradient: 'from-blue-600 via-indigo-700 to-slate-900',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    serverAccounts.push(newBank);

    // Create welcoming initial transaction
    serverTransactions.unshift({
      id: `tx_${Date.now()}`,
      accountId: newBank.id,
      accountMask: newBank.mask,
      institutionName: newBank.institutionName,
      amount: 5240.00,
      type: 'credit',
      category: 'Transfer',
      merchantName: `${newBank.institutionName} Sync`,
      description: 'Initial Plaid Link Account Verification Sync',
      date: new Date().toISOString().split('T')[0],
      status: 'completed',
      referenceNumber: `REF-PLD-${Math.floor(100000 + Math.random() * 900000)}`,
    });

    serverSecurityLogs.unshift({
      id: `sec_${Date.now()}`,
      action: `Connected ${newBank.institutionName} via Plaid`,
      device: req.headers['user-agent'] || 'Web Browser',
      ipAddress: '192.168.1.100',
      location: 'San Francisco, CA, USA',
      timestamp: new Date().toLocaleString(),
      status: 'success',
    });

    return res.json({
      success: true,
      account: newBank,
      message: `${newBank.institutionName} successfully connected via Plaid!`,
    });
  });

  app.delete('/api/accounts/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    serverAccounts = serverAccounts.filter((a) => a.id !== id);
    return res.json({ success: true, message: 'Bank account unlinked' });
  });

  // ==========================================
  // TRANSACTIONS API
  // ==========================================
  app.get('/api/transactions', (req: Request, res: Response) => {
    const { search, category, accountId, status } = req.query;

    let filtered = [...serverTransactions];

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.merchantName.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.referenceNumber.toLowerCase().includes(q)
      );
    }

    if (category && category !== 'All') {
      filtered = filtered.filter((t) => t.category === category);
    }

    if (accountId && accountId !== 'All') {
      filtered = filtered.filter((t) => t.accountId === accountId);
    }

    if (status && status !== 'All') {
      filtered = filtered.filter((t) => t.status === status);
    }

    return res.json({
      transactions: filtered,
      totalCount: filtered.length,
    });
  });

  // ==========================================
  // MONEY TRANSFERS & DWOLLA INTEGRATION API
  // ==========================================
  app.post('/api/transfers', (req: Request, res: Response) => {
    const {
      senderAccountId,
      recipientName,
      recipientDetails,
      amount,
      speed,
      memo,
    } = req.body;

    const transferAmount = parseFloat(amount);
    if (isNaN(transferAmount) || transferAmount <= 0) {
      return res.status(400).json({ error: 'Valid transfer amount is required' });
    }

    const senderAccount = serverAccounts.find((a) => a.id === senderAccountId);
    if (!senderAccount) {
      return res.status(404).json({ error: 'Sender account not found' });
    }

    const fee = speed === 'instant' ? 1.5 : 0;
    const totalDeduction = transferAmount + fee;

    if (senderAccount.currentBalance < totalDeduction) {
      return res.status(400).json({
        error: `Insufficient funds in ${senderAccount.accountName}. Required: $${totalDeduction.toFixed(
          2
        )}, Available: $${senderAccount.currentBalance.toFixed(2)}`,
      });
    }


    senderAccount.currentBalance -= totalDeduction;
    senderAccount.availableBalance -= totalDeduction;

    const transferRecord: TransferRecord = {
      id: `trf_${Date.now()}`,
      transferNumber: `TRF-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(
        100 + Math.random() * 900
      )}`,
      senderAccountId: senderAccount.id,
      senderAccountName: senderAccount.accountName,
      senderMask: senderAccount.mask,
      recipientName: recipientName || 'External ACH Account',
      recipientDetails: recipientDetails || 'Dwolla Clearing Network',
      amount: transferAmount,
      fee,
      memo: memo || 'Money Transfer via Horizon',
      speed: speed || 'standard',
      status: 'completed',
      createdAt: new Date().toISOString(),
      estimatedArrival:
        speed === 'instant'
          ? new Date(Date.now() + 5 * 60 * 1000).toISOString()
          : new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    };

    serverTransfers.unshift(transferRecord);


    serverTransactions.unshift({
      id: `tx_${Date.now()}`,
      accountId: senderAccount.id,
      accountMask: senderAccount.mask,
      institutionName: senderAccount.institutionName,
      amount: transferAmount,
      type: 'debit',
      category: 'Transfer',
      merchantName: `Transfer to ${recipientName}`,
      description: memo || `ACH Transfer to ${recipientName}`,
      date: new Date().toISOString().split('T')[0],
      status: 'completed',
      referenceNumber: transferRecord.transferNumber,
    });

    return res.json({
      success: true,
      transfer: transferRecord,
      updatedAccount: senderAccount,
      message: 'Transfer processed successfully',
    });
  });

  app.get('/api/transfers', (req: Request, res: Response) => {
    return res.json({ transfers: serverTransfers });
  });

  // ==========================================
  // ANALYTICS & INSIGHTS API
  // ==========================================
  app.get('/api/analytics', (req: Request, res: Response) => {
    const totalBalance = serverAccounts.reduce((acc, curr) => acc + curr.currentBalance, 0);

    const monthlyIncome = serverTransactions
      .filter((t) => t.type === 'credit' && t.status === 'completed')
      .reduce((acc, curr) => acc + curr.amount, 0);

    const monthlyExpenses = serverTransactions
      .filter((t) => t.type === 'debit' && t.status === 'completed')
      .reduce((acc, curr) => acc + curr.amount, 0);

    const netSavings = monthlyIncome - monthlyExpenses;

    return res.json({
      analytics: {
        totalBalance,
        monthlyIncome,
        monthlyExpenses,
        netSavings,
        savingsRate: monthlyIncome > 0 ? Math.round((netSavings / monthlyIncome) * 100) : 0,
      },
    });
  });

  // ==========================================
  // SECURITY LOGS API
  // ==========================================
  app.get('/api/security-logs', (req: Request, res: Response) => {
    return res.json({ logs: serverSecurityLogs });
  });


  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n  🚀 Horizon Banking App running at:`);
    console.log(`  ➜  Local:   http://localhost:${PORT}/`);
    console.log(`  ➜  Network: http://127.0.0.1:${PORT}/\n`);
  });

  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\n❌ Port ${PORT} is already in use. Please free port ${PORT} or set PORT environment variable.\n`);
    } else {
      console.error('Failed to start Horizon Banking server:', err);
    }
  });
}

startServer().catch((err) => {
  console.error('Failed to start Horizon Banking server:', err);
});
