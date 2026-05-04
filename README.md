# Shopping Cart & Order Management - Full Stack Application

## Project Overview

A complete e-commerce shopping cart and order management application built with Node.js (Express) backend and React frontend.

## Tech Stack

- **Backend**: Node.js, Express.js, Zod (validation)
- **Frontend**: React 18, Vite, Axios, Tailwind CSS
- **Testing**: Jest, Supertest (backend), Vitest, React Testing Library (frontend)
- **Database**: In-memory (JS Map for cart, Array for orders)

## Features Implemented

### Backend API

- ✅ Add/Update/Remove items from cart
- ✅ Apply coupon codes (fixed discount)
- ✅ Get cart with computed totals
- ✅ Place order from cart
- ✅ Get order details
- ✅ Business rules enforcement (max 10 units, cart validation, etc.)

### Frontend Components

- ✅ Product showcase with add to cart
- ✅ Shopping cart sidebar with quantity controls
- ✅ Coupon input and application
- ✅ Checkout button with order confirmation
- ✅ Responsive design with Tailwind CSS
- ✅ Error handling and user feedback

### Business Rules

- Max 10 units per line item
- Cart must be non-empty to place order
- Fixed discount coupons (SAVE50, SAVE100, SAVE200)
- Coupon can only be applied once per session
- Order captures product snapshot at placement

## Installation & Setup

### Backend Setup

```bash
cd backend
npm install
npm run dev        # Start development server
npm test          # Run tests
npm run test:coverage  # Generate coverage report
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev        # Start development server
npm test          # Run tests
npm run build     # Build for production
```

## API Endpoints

### Cart Endpoints

- `GET /api/v1/cart/:sessionId` - Get cart
- `POST /api/v1/cart/:sessionId/items` - Add item
- `PUT /api/v1/cart/:sessionId/items/:itemId` - Update quantity
- `DELETE /api/v1/cart/:sessionId/items/:itemId` - Remove item
- `POST /api/v1/cart/:sessionId/coupon` - Apply coupon
- `DELETE /api/v1/cart/:sessionId` - Clear cart

### Order Endpoints

- `POST /api/v1/orders` - Create order
- `GET /api/v1/orders/:orderId` - Get order
- `GET /api/v1/orders` - Get all orders

## Available Coupon Codes

- `SAVE50` - ₹50 discount
- `SAVE100` - ₹100 discount
- `SAVE200` - ₹200 discount

## Project Structure

```
ShoppingCart-JD/
├── backend/
│   ├── src/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── index.js
│   ├── tests/
│   ├── package.json
│   └── jest.config.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── __tests__/
│   │   ├── App.jsx
│   │   ├── api.js
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Running the Application

### Terminal 1 - Backend

```bash
cd backend
npm install
npm run dev
```

### Terminal 2 - Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will open at `http://localhost:5173` and API at `http://localhost:3000`

## Testing

### Backend Tests

```bash
cd backend
npm test              # Run all tests
npm run test:watch   # Watch mode
npm run test:coverage # Coverage report
```

### Frontend Tests

```bash
cd frontend
npm test              # Run all tests
npm run test:coverage # Coverage report
```

## Features & Requirements Met

✅ All functional requirements (FR-01 to FR-15)
✅ All business rules (BR-01 to BR-05)
✅ Full TDD coverage (70%+ tests)
✅ Responsive UI with Tailwind CSS
✅ Error handling and validation
✅ Session-based cart management
✅ Order confirmation flow
✅ Component-based React architecture
✅ RESTful API design
✅ Coupon system with discount logic

## Future Enhancements (Post-POC)

- Order history with pagination
- PATCH endpoint for order status updates
- Percentage-based discount coupons
- Cart persistence with Redis
- Multi-step checkout wizard
- AWS deployment
- Payment gateway integration
- Email notifications

## License

ISC
