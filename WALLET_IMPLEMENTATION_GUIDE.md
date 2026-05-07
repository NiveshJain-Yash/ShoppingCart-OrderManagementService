# 💳 Wallet Functionality - Implementation Approach

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [System Design](#system-design)
3. [Frontend Structure](#frontend-structure)
4. [Backend Requirements](#backend-requirements)
5. [Integration with Cart](#integration-with-cart)
6. [User Flows](#user-flows)
7. [Implementation Steps](#implementation-steps)

---

## ARCHITECTURE OVERVIEW

### Current System
```
User → Product Selection → Add to Cart → Checkout → Order
                                           ↓
                                    Payment Method
                                    (Not implemented)
```

### With Wallet Feature
```
User → Wallet Management ─→ Check Balance
              ↓
         Add Money
              ↓
       Recharge Options
              ↓
    Product Selection → Add to Cart → Checkout → Payment Options:
                                         ↓
                          ┌─────────────┼─────────────┐
                          ↓             ↓             ↓
                      Wallet    Credit Card    Other Method
                      (NEW)
```

---

## SYSTEM DESIGN

### What is a Wallet in E-Commerce?

A **digital wallet** stores user's money that can be used for purchases:

| Aspect | Details |
|--------|---------|
| **Balance** | Amount of money stored in wallet |
| **Add Money** | User can add funds (recharge) |
| **Use Money** | Pay from wallet during checkout |
| **Transaction History** | Track all credits/debits |
| **Account Link** | Tied to user account |

### Wallet States

```
┌─────────────────────────────────────┐
│ Wallet States                       │
├─────────────────────────────────────┤
│ 1. ACTIVE: Ready to use            │
│ 2. INSUFFICIENT_FUNDS: Can't cover │
│ 3. PENDING: Waiting for recharge    │
│ 4. LOCKED: Fraud suspected (future) │
└─────────────────────────────────────┘
```

### Wallet Operations

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ Add Money    │────▶│ Check Balance│────▶│ Use Money    │
│ (Debit Card) │     │ (View)       │     │ (Purchase)   │
└──────────────┘     └──────────────┘     └──────────────┘
       ↓                    ↓                    ↓
   +Amount           Balance = X          Balance = X - PurchaseAmt
   (Recharge)       (Display)            (Checkout Payment)
```

---

## FRONTEND STRUCTURE

### New File Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Header.jsx (existing)
│   │   ├── CartSidebar.jsx (existing)
│   │   ├── CheckoutButton.jsx (existing)
│   │   │
│   │   ├── Wallet/                          ← NEW FOLDER
│   │   │   ├── WalletDisplay.jsx            (Shows balance)
│   │   │   ├── WalletModal.jsx              (Wallet details popup)
│   │   │   ├── RechargeForm.jsx             (Add money form)
│   │   │   ├── TransactionHistory.jsx       (Payment log)
│   │   │   └── WalletPaymentOption.jsx      (Checkout option)
│   │   │
│   │   └── Checkout/                        ← NEW FOLDER
│   │       ├── PaymentMethodSelector.jsx    (Choose payment)
│   │       └── CheckoutSummary.jsx          (Payment summary)
│   │
│   ├── pages/
│   │   ├── HomePage.jsx (existing)
│   │   ├── CartPage.jsx (existing)
│   │   └── WalletPage.jsx                   ← NEW PAGE
│   │
│   ├── services/                            ← NEW FOLDER
│   │   └── walletService.js                 (Wallet API calls)
│   │
│   ├── hooks/                               ← NEW FOLDER
│   │   └── useWallet.js                     (Wallet state hook)
│   │
│   ├── context/                             ← NEW FOLDER (optional)
│   │   └── WalletContext.js                 (Global wallet state)
│   │
│   ├── App.jsx (update with wallet route)
│   ├── api.js (add wallet endpoints)
│   └── main.jsx (existing)
```

---

## COMPONENT ARCHITECTURE

### 1. WalletDisplay Component
```jsx
// Shown in Header or Sidebar
// Purpose: Quick wallet balance view

Props:
  - balance: number
  - loading: boolean
  - onClick: () => void (opens wallet modal)

Renders:
  💳 Wallet: ₹5,000
  (clickable to open modal)
```

**Use Case**: User sees wallet balance in header at all times

### 2. WalletModal Component
```jsx
// Popup/Modal showing wallet details
// Purpose: Central hub for wallet management

Props:
  - isOpen: boolean
  - onClose: () => void
  - wallet: { balance, totalSpent, totalAdded }
  - onRecharge: () => void
  - onViewHistory: () => void

Contains:
  - Current balance display
  - Quick stats (total spent, total added)
  - "Add Money" button
  - "View History" button
  - Recent transactions
```

**Use Case**: User opens wallet to see detailed info

### 3. RechargeForm Component
```jsx
// Form to add money to wallet
// Purpose: Accept payment for recharge

Props:
  - onSubmit: (amount) => void
  - loading: boolean
  - paymentMethods: ['UPI', 'Card', 'Netbanking']

Form Fields:
  - Amount input (₹100, ₹500, ₹1000, ₹5000, Custom)
  - Payment method selector
  - Payment details (if needed)
  - Submit button

Flow:
  1. User selects amount
  2. Chooses payment method
  3. Clicks "Recharge"
  4. API call to backend
  5. Simulate payment processing
  6. Add money to wallet
  7. Show success message
  8. Update balance display
```

**Use Case**: User adds money to wallet before shopping

### 4. TransactionHistory Component
```jsx
// List of all wallet transactions
// Purpose: Transparent transaction log

Props:
  - transactions: []
  - loading: boolean

Displays:
  - Date & Time
  - Type (Credit/Debit)
  - Amount
  - Description
  - Balance after transaction
  - Filters (All, Credits, Debits, Date range)

Example Transaction:
  ┌─────────────────────────────────┐
  │ +₹1,000 | Credit                │
  │ UPI Recharge                    │
  │ 2026-05-08 14:30                │
  │ Balance: ₹6,000                 │
  └─────────────────────────────────┘
  
  ┌─────────────────────────────────┐
  │ -₹99 | Debit                    │
  │ Order #ORDER123                 │
  │ 2026-05-08 15:45                │
  │ Balance: ₹5,901                 │
  └─────────────────────────────────┘
```

**Use Case**: User checks transaction history

### 5. WalletPaymentOption Component
```jsx
// Radio button/Card option in checkout
// Purpose: Select wallet as payment method

Props:
  - selected: boolean
  - balance: number
  - orderTotal: number
  - onSelect: () => void

Shows:
  💳 Pay from Wallet
  Available: ₹5,000
  Order Total: ₹2,500
  [✓] or [ ] (radio button)

Disabled if: balance < orderTotal
```

**Use Case**: User chooses wallet payment during checkout

### 6. PaymentMethodSelector Component
```jsx
// NEW CHECKOUT STEP
// Purpose: Choose between payment methods

Options:
  ┌─────────────────────┐
  │ ○ Wallet (₹5,000)   │
  │ ○ Credit Card       │
  │ ○ Debit Card        │
  │ ○ UPI               │
  │ ○ NetBanking        │
  └─────────────────────┘

Logic:
  - If balance >= orderTotal: Wallet option enabled
  - If balance < orderTotal: Show "Add ₹X to wallet"
  - Default selection: Wallet (if available)
```

**Use Case**: User selects payment method before final checkout

### 7. WalletPage Component
```jsx
// Full page dedicated to wallet
// Purpose: Comprehensive wallet management

Route: /wallet

Contains:
  - WalletDisplay (large version)
  - RechargeForm
  - TransactionHistory
  - Quick stats (charts/graphs)
  - Links to history

Layout:
  ┌──────────────────────────────────┐
  │ WALLET                           │
  ├──────────────────────────────────┤
  │ Balance: ₹5,000                  │
  │ [Add Money Button]               │
  ├──────────────────────────────────┤
  │ Quick Stats                      │
  │ Total Added: ₹15,000             │
  │ Total Spent: ₹10,000             │
  ├──────────────────────────────────┤
  │ Recent Transactions              │
  │ [Show last 10 transactions]      │
  ├──────────────────────────────────┤
  │ [View Full History]              │
  └──────────────────────────────────┘
```

**Use Case**: User visits dedicated wallet management page

---

## STATE MANAGEMENT

### Option 1: App.jsx (Simple)
```jsx
// Add wallet state to existing App.jsx

const [wallet, setWallet] = useState({
  balance: 0,
  totalAdded: 0,
  totalSpent: 0,
  lastUpdated: null
});

const [walletLoading, setWalletLoading] = useState(false);
const [walletError, setWalletError] = useState('');
```

**Pros**: Simple, no extra setup
**Cons**: Props drilling through many components

### Option 2: useWallet Hook (Recommended)
```jsx
// Custom hook for wallet logic

hooks/useWallet.js:
export function useWallet() {
  const [wallet, setWallet] = useState({...});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWallet = async (userId) => {
    // API call
  };

  const addMoney = async (amount, method) => {
    // API call
  };

  const useWalletForPayment = async (amount) => {
    // API call
  };

  const getTransactionHistory = async () => {
    // API call
  };

  return {
    wallet,
    loading,
    error,
    fetchWallet,
    addMoney,
    useWalletForPayment,
    getTransactionHistory
  };
}

// Usage in any component:
const { wallet, addMoney, loading } = useWallet();
```

**Pros**: Reusable, clean, no props drilling
**Cons**: Slightly more setup

### Option 3: Context API (Full-Scale)
```jsx
// Context for app-wide wallet state

context/WalletContext.js:
export const WalletContext = createContext();

export function WalletProvider({ children }) {
  const [wallet, setWallet] = useState({...});
  
  const value = {
    wallet,
    addMoney: async (amount) => {...},
    useWallet: async (amount) => {...},
    // ... more methods
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

// Usage:
<WalletProvider>
  <App />
</WalletProvider>

// In components:
const { wallet, addMoney } = useContext(WalletContext);
```

**Pros**: Global state, scalable, clean
**Cons**: More boilerplate, more setup

**Recommendation**: Start with **Option 2 (useWallet hook)** → Migrate to **Option 3 (Context)** when scaling

---

## API INTEGRATION

### services/walletService.js

```javascript
import axios from 'axios';

const API_BASE = '/api/v1';

export const walletApi = {
  // Get wallet details
  getWallet: (userId) => 
    axios.get(`${API_BASE}/wallet/${userId}`),

  // Add money to wallet
  addMoney: (userId, amount, paymentMethod) => 
    axios.post(`${API_BASE}/wallet/${userId}/recharge`, {
      amount,
      paymentMethod,
      timestamp: new Date().toISOString()
    }),

  // Use wallet for payment
  useWalletForPayment: (userId, orderId, amount) => 
    axios.post(`${API_BASE}/wallet/${userId}/payment`, {
      orderId,
      amount,
      timestamp: new Date().toISOString()
    }),

  // Get transaction history
  getTransactionHistory: (userId, limit = 50) => 
    axios.get(`${API_BASE}/wallet/${userId}/transactions`, {
      params: { limit }
    }),

  // Get transaction filters (optional)
  getTransactionStats: (userId) =>
    axios.get(`${API_BASE}/wallet/${userId}/stats`)
};
```

### api.js (Update)

```javascript
// Add to existing api.js
import { walletApi } from './services/walletService.js';

// Export both cart and wallet APIs
export { cartApi, orderApi, walletApi };
```

---

## BACKEND REQUIREMENTS

### Database Schema

**wallets table**:
```sql
CREATE TABLE wallets (
  id UUID PRIMARY KEY,
  userId UUID NOT NULL,
  balance DECIMAL(10, 2) DEFAULT 0.00,
  totalAdded DECIMAL(10, 2) DEFAULT 0.00,
  totalSpent DECIMAL(10, 2) DEFAULT 0.00,
  status ENUM('ACTIVE', 'FROZEN', 'CLOSED'),
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
);
```

**transactions table**:
```sql
CREATE TABLE wallet_transactions (
  id UUID PRIMARY KEY,
  walletId UUID NOT NULL,
  type ENUM('CREDIT', 'DEBIT'),
  amount DECIMAL(10, 2),
  description VARCHAR(255),
  referenceId VARCHAR(100),  -- order ID or recharge ID
  balanceBefore DECIMAL(10, 2),
  balanceAfter DECIMAL(10, 2),
  status ENUM('SUCCESS', 'PENDING', 'FAILED'),
  createdAt TIMESTAMP,
  FOREIGN KEY (walletId) REFERENCES wallets(id)
);
```

### API Endpoints Needed

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/wallet/:userId` | GET | Get wallet balance |
| `/api/v1/wallet/:userId/recharge` | POST | Add money |
| `/api/v1/wallet/:userId/payment` | POST | Pay from wallet |
| `/api/v1/wallet/:userId/transactions` | GET | Get history |
| `/api/v1/wallet/:userId/stats` | GET | Get statistics |

### Example Response Objects

**GET /wallet/:userId**:
```json
{
  "id": "wallet-123",
  "userId": "user-456",
  "balance": 5000.00,
  "totalAdded": 15000.00,
  "totalSpent": 10000.00,
  "status": "ACTIVE",
  "lastUpdated": "2026-05-08T10:30:00Z"
}
```

**POST /wallet/:userId/recharge**:
```json
{
  "success": true,
  "message": "₹1000 added successfully",
  "newBalance": 6000.00,
  "transactionId": "txn-789",
  "transaction": {
    "id": "txn-789",
    "type": "CREDIT",
    "amount": 1000,
    "description": "UPI Recharge",
    "timestamp": "2026-05-08T10:35:00Z"
  }
}
```

**GET /wallet/:userId/transactions**:
```json
{
  "transactions": [
    {
      "id": "txn-789",
      "type": "CREDIT",
      "amount": 1000,
      "description": "UPI Recharge",
      "balanceAfter": 6000,
      "createdAt": "2026-05-08T10:35:00Z"
    },
    {
      "id": "txn-788",
      "type": "DEBIT",
      "amount": 99,
      "description": "Order #ORDER123",
      "balanceAfter": 5000,
      "createdAt": "2026-05-08T09:20:00Z"
    }
  ],
  "total": 2,
  "limit": 50
}
```

---

## INTEGRATION WITH CART

### Modified Checkout Flow

```
Current Flow:
  Cart → Checkout → Order Created ✗ (No payment)

New Flow:
  Cart → Checkout → Select Payment Method → Process Payment → Order Created
                            ↓
                    ┌───────┴────────┐
                    ↓                ↓
              Use Wallet      Use Other Method
                    ↓                ↓
          Verify Balance    (External Gateway)
                    ↓
          Deduct from Wallet
                    ↓
          Create Transaction Record
                    ↓
          Create Order ✓
```

### CheckoutButton Component Updates

```jsx
// Current
export function CheckoutButton({ 
  isCartEmpty, 
  onCheckout, 
  isLoading, 
  orderId, 
  error 
}) {
  // ...
}

// Updated - with payment method support
export function CheckoutButton({
  isCartEmpty,
  onCheckout,
  isLoading,
  orderId,
  error,
  paymentMethod,        // NEW
  walletBalance,        // NEW
  orderTotal           // NEW
}) {
  // Validation: if paymentMethod is 'WALLET', check walletBalance >= orderTotal
  // ...
}
```

### Updated Checkout Steps

```
Step 1: Review Cart
  ├─ Show items
  ├─ Show totals
  └─ [Proceed to Payment]

Step 2: SELECT PAYMENT METHOD (NEW)
  ├─ Wallet (if available)
  ├─ Credit Card
  ├─ Debit Card
  ├─ UPI
  └─ [Next]

Step 3: PAYMENT CONFIRMATION (NEW)
  ├─ Show selected method
  ├─ If Wallet: Show balance & deduction
  ├─ If Card: Show last 4 digits
  └─ [Confirm & Pay]

Step 4: PROCESS & ORDER CONFIRMATION
  ├─ Call payment API
  ├─ Deduct from wallet (if wallet selected)
  ├─ Create order
  ├─ Create transaction record
  └─ Show Order ID
```

### App.jsx Integration

```jsx
// Add wallet state
const [wallet, setWallet] = useState(null);
const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('WALLET');

// Add handlers
const handleSelectPaymentMethod = (method) => {
  setSelectedPaymentMethod(method);
};

const handleCheckoutWithPayment = async () => {
  if (selectedPaymentMethod === 'WALLET') {
    // Check wallet balance
    if (wallet.balance < cart.total) {
      setError('Insufficient wallet balance');
      return;
    }
    
    // Deduct from wallet
    const res = await walletApi.useWalletForPayment(
      sessionId,
      orderId,
      cart.total
    );
    
    // Update wallet
    setWallet(res.data.wallet);
  }
  
  // Create order
  await handleCheckout();
};

// Pass to components
<CheckoutButton 
  paymentMethod={selectedPaymentMethod}
  walletBalance={wallet?.balance}
  orderTotal={cart.total}
  onSelectPaymentMethod={handleSelectPaymentMethod}
/>
```

---

## USER FLOWS

### User Flow 1: Add Money to Wallet

```
1. User clicks "💳 Wallet" in header
   ↓
2. WalletModal opens
   ↓
3. User clicks "Add Money"
   ↓
4. RechargeForm displays
   ├─ Quick amount options: ₹100, ₹500, ₹1000, ₹5000
   ├─ Custom amount input
   └─ Payment method selector: UPI, Card, Netbanking
   ↓
5. User selects amount & method
   ↓
6. User clicks "Recharge"
   ↓
7. Frontend calls POST /wallet/:userId/recharge
   ↓
8. Backend validates & processes
   ↓
9. Wallet balance updated
   ↓
10. Success message shown
   ↓
11. WalletDisplay updates in header
```

### User Flow 2: Pay from Wallet During Checkout

```
1. User has items in cart
   ├─ Cart total: ₹2,500
   └─ Wallet balance: ₹5,000
   ↓
2. User clicks "Proceed to Checkout"
   ↓
3. CartPage shows checkout options
   ↓
4. PaymentMethodSelector displays
   └─ "Wallet (₹5,000)" is selected by default (sufficient balance)
   ↓
5. User confirms selection (or chooses other method)
   ↓
6. User clicks "Place Order"
   ↓
7. Frontend validates:
   └─ wallet.balance >= cart.total? YES ✓
   ↓
8. Frontend calls POST /orders with paymentMethod: 'WALLET'
   ↓
9. Backend creates order & calls POST /wallet/:userId/payment
   ↓
10. Wallet deducted: ₹5,000 - ₹2,500 = ₹2,500
    ↓
11. Transaction record created
    ├─ Type: DEBIT
    ├─ Amount: ₹2,500
    └─ Description: "Order #ORDER123"
    ↓
12. Order confirmed
    ↓
13. WalletDisplay updates to ₹2,500
```

### User Flow 3: View Transaction History

```
1. User opens WalletModal or visits /wallet page
   ↓
2. User clicks "View History"
   ↓
3. TransactionHistory component loads
   ↓
4. Fetches GET /wallet/:userId/transactions
   ↓
5. Displays chronological list:
   ├─ +₹1,000 Credit (UPI Recharge)
   ├─ -₹99 Debit (Order #ORDER123)
   ├─ -₹150 Debit (Order #ORDER124)
   └─ +₹500 Credit (Cashback)
   ↓
6. User can filter by:
   ├─ All
   ├─ Credits only
   ├─ Debits only
   └─ Date range
   ↓
7. Click on transaction for details
```

---

## IMPLEMENTATION STEPS

### Phase 1: Foundation (Week 1)

**Backend**:
- [ ] Create wallet & transactions tables
- [ ] Implement wallet service
- [ ] Create endpoints: GET /wallet, POST /wallet/recharge
- [ ] Add wallet payment endpoint
- [ ] Write tests

**Frontend**:
- [ ] Create WalletDisplay component
- [ ] Create RechargeForm component
- [ ] Create useWallet hook
- [ ] Create walletService.js

**Integration**:
- [ ] Add wallet state to App.jsx
- [ ] Display wallet balance in Header
- [ ] Add wallet icon/badge

### Phase 2: UI Components (Week 2)

**Frontend**:
- [ ] Create WalletModal component
- [ ] Create TransactionHistory component
- [ ] Create PaymentMethodSelector component
- [ ] Create WalletPage component
- [ ] Style all components with Tailwind

**Integration**:
- [ ] Add routes: /wallet
- [ ] Update navigation links

### Phase 3: Checkout Integration (Week 3)

**Frontend**:
- [ ] Create PaymentMethodSelector component
- [ ] Update CheckoutButton to handle payment methods
- [ ] Update CartPage checkout flow
- [ ] Update success modal for wallet payments

**Backend**:
- [ ] Update order creation to handle paymentMethod
- [ ] Integrate wallet deduction with order placement
- [ ] Add transaction logging

**Integration**:
- [ ] Update App.jsx handleCheckout() flow
- [ ] Connect all payment endpoints
- [ ] Test complete flow

### Phase 4: Polish & Testing (Week 4)

**Testing**:
- [ ] Unit tests for wallet service
- [ ] Integration tests for checkout
- [ ] Component tests
- [ ] E2E tests

**Polish**:
- [ ] Add animations
- [ ] Error handling improvements
- [ ] Loading states
- [ ] Success confirmations

---

## RECOMMENDED TECH STACK

| Purpose | Technology |
|---------|-----------|
| State Management | useWallet hook OR Context API |
| API Calls | Axios (existing) |
| Styling | Tailwind CSS (existing) |
| Modals | React component OR headless-ui |
| Forms | React hooks |
| Charts (optional) | Chart.js or Recharts |
| Testing | Vitest + React Testing Library (existing) |

---

## SECURITY CONSIDERATIONS

### 🔐 Important Security Points

1. **Backend Validation**
   - Always validate balance on backend (never trust frontend)
   - Verify userId in every request
   - Implement rate limiting on recharge endpoint

2. **Transaction Integrity**
   - Use database transactions for atomic operations
   - Log all wallet changes
   - Maintain audit trail

3. **Payment Processing**
   - For real payments: Use payment gateway (Stripe, Razorpay)
   - For this demo: Simulate payment with success/failure
   - Never store actual payment methods in wallet DB

4. **User Authentication**
   - Verify sessionId/userId before wallet operations
   - Encrypt sensitive data in transit (HTTPS)
   - Implement session validation

### Example Backend Validation

```javascript
// walletRoutes.js
router.post('/:userId/payment', (req, res) => {
  const { userId } = req.params;
  const { orderId, amount } = req.body;
  
  // Validate user owns this wallet
  if (!isValidUser(userId)) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  
  // Get wallet
  const wallet = getWallet(userId);
  
  // Validate balance ON BACKEND
  if (wallet.balance < amount) {
    return res.status(422).json({ error: 'Insufficient balance' });
  }
  
  // Check for duplicate transactions (idempotency)
  if (hasDuplicateTransaction(orderId)) {
    return res.status(400).json({ error: 'Duplicate transaction' });
  }
  
  // Use database transaction
  try {
    deductWallet(userId, amount);
    createTransaction(orderId, amount);
    createOrder(orderId);
    return res.json({ success: true });
  } catch (error) {
    // Rollback on error
    return res.status(500).json({ error: 'Transaction failed' });
  }
});
```

---

## FUTURE ENHANCEMENTS

1. **Cashback System**
   - Earn cashback on purchases
   - 1-2% of order amount back to wallet
   - Promotional cashback campaigns

2. **Referral Rewards**
   - Invite friends, get ₹100 bonus
   - Friend gets ₹50 on first purchase
   - Track referral tree

3. **Gift Cards**
   - Buy gift cards to add to wallet
   - Transfer wallet balance to friends
   - Wallet gift codes

4. **Auto-Recharge**
   - Set minimum balance threshold
   - Auto-recharge when balance drops below threshold
   - Save payment method for convenience

5. **Advanced Analytics**
   - Spending patterns
   - Monthly statements
   - Budget tracking
   - Savings goals

6. **Loyalty Program**
   - Wallet tier levels (Silver, Gold, Platinum)
   - Unlock higher cashback at higher tiers
   - Exclusive rewards

7. **Financial Features**
   - Interest on wallet balance
   - Emergency wallet borrowing
   - Scheduled payments

---

## SUMMARY TABLE

| Aspect | What to Add |
|--------|-----------|
| **Components** | 7 new components + WalletPage |
| **Hooks** | 1 useWallet custom hook |
| **Services** | walletService.js |
| **Routes** | /wallet page route |
| **State** | wallet, selectedPaymentMethod |
| **Handlers** | addMoney, useWallet, getHistory |
| **Backend Endpoints** | 5 new endpoints |
| **Database Tables** | 2 new tables (wallets, transactions) |
| **Integration Points** | App.jsx, CartPage, CheckoutButton |
| **New Features** | Payment method selection, transaction history, balance display |

---

## QUICK START CODE SNIPPET

### useWallet.js (Custom Hook)

```jsx
import { useState } from 'react';
import { walletApi } from '../services/walletService.js';

export function useWallet(userId) {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWallet = async () => {
    setLoading(true);
    try {
      const res = await walletApi.getWallet(userId);
      setWallet(res.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch wallet');
    } finally {
      setLoading(false);
    }
  };

  const addMoney = async (amount, method) => {
    setLoading(true);
    try {
      const res = await walletApi.addMoney(userId, amount, method);
      setWallet(res.data.wallet);
      setError('');
      return res.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add money');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const useWalletForPayment = async (orderId, amount) => {
    setLoading(true);
    try {
      const res = await walletApi.useWalletForPayment(userId, orderId, amount);
      setWallet(res.data.wallet);
      setError('');
      return res.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Payment failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getTransactionHistory = async () => {
    setLoading(true);
    try {
      const res = await walletApi.getTransactionHistory(userId);
      setError('');
      return res.data.transactions;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load history');
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    wallet,
    loading,
    error,
    fetchWallet,
    addMoney,
    useWalletForPayment,
    getTransactionHistory
  };
}
```

### WalletDisplay.jsx (Component)

```jsx
import React from 'react';

export function WalletDisplay({ balance, loading, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition"
    >
      <span className="text-lg">💳</span>
      <div className="text-left">
        <p className="text-xs opacity-80">Wallet</p>
        <p className="font-semibold">
          {loading ? 'Loading...' : `₹${(balance || 0).toLocaleString()}`}
        </p>
      </div>
    </button>
  );
}
```

---

## KEY DESIGN DECISIONS

1. **State Management**: Use useWallet hook (avoid prop drilling)
2. **Payment Methods**: Wallet + other options (future extensibility)
3. **Transaction Log**: Immutable records (audit trail)
4. **Balance Validation**: Backend-only (security)
5. **Error Handling**: Specific messages (user guidance)
6. **Offline Support**: Simple implementation (can add later)
7. **Database**: Separate tables for wallets & transactions (normalization)

---

This approach provides a **scalable, secure, and user-friendly wallet system** that integrates seamlessly with your existing cart application.
