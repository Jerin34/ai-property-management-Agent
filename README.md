# AI Property Management Agent

An AI-powered property management platform built with the **MERN stack and Google Gemini AI**. It streamlines property operations, maintenance management, tenant requests, technician assignments, subscription payments, and property health monitoring.

The platform provides role-based experiences for administrators, property managers, tenants, and technicians.

---

## Features

### Authentication & Authorization
- User registration and login.
- JWT-based authentication.
- Protected routes.
- Role-based access control.
- Secure password hashing.

### Property Management
- Create, view, and manage properties.
- Edit property details.
- Upload and display property images using Cloudinary.
- View property location and Google Maps integration.
- Browse active properties as a tenant.
- Property health diagnostics for managers and administrators.

### Maintenance Management
- Create and track maintenance requests.
- Assign maintenance requests to technicians.
- Update maintenance status.
- Maintenance scheduling.
- Preventive maintenance recommendations.
- Maintenance escalation.
- SLA monitoring.
- Maintenance cost analytics.

### Technician Management
- Technician role application.
- Technician profile management.
- Admin approval workflow.
- Technician maintenance dashboard.
- Technician assignment and availability management.

### Tenant Management
- Browse available properties.
- View property details and images.
- Submit stay requests.
- Track maintenance requests.
- Access notifications.

### AI Integration
- Google Gemini API integration.
- AI-powered property insights.
- Maintenance recommendations.
- Property health analysis.
- AI-assisted property management workflows.

### Subscription & Payment Integration
- Razorpay subscription integration.
- Subscription creation and payment flow.
- Webhook-based payment event handling.
- Subscription status synchronization.
- Admin approval workflow for manager applications.

---

## Tech Stack

| Category | Technologies |
|---|---|
| Frontend | React, TypeScript, Vite |
| Backend | Node.js, Express.js, TypeScript |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcrypt |
| AI | Google Gemini API |
| Payments | Razorpay |
| Image Storage | Cloudinary |
| API Communication | Axios |
| Routing | React Router |
| Validation | Zod |
| Background Jobs | node-cron |
| Security | Helmet, CORS |
| Testing | Vitest, Supertest |

---

## Architecture

The application follows a frontend/backend architecture with an MVC-inspired backend structure.

```text
AI-Property-Management-Agent/
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── types/
│   │   └── utils/
│   │
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── jobs/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   └── server.ts
│   │
│   └── package.json
│
└── README.md
```

---

## Getting Started

### Prerequisites

Install the following before running the project:

- Node.js and npm
- MongoDB Atlas account or MongoDB instance
- Git
- Google AI Studio API key
- Razorpay account
- Cloudinary account

### 1. Clone the repository

```bash
git clone https://github.com/Jerin34/ai-property-management-Agent.git

cd ai-property-management-Agent
```

### 2. Backend Setup

```bash
cd backend

npm install
```

Create a `.env` file inside the `backend` directory.

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_secure_jwt_secret

GEMINI_API_KEY=your_gemini_api_key

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_PLAN_ID=your_razorpay_plan_id
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Build the backend:

```bash
npm run build
```

Start the development server:

```bash
npm run dev
```

The backend will run at:

```text
http://localhost:5000
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend

npm install
```

Create a `.env.development` file inside the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Vite will provide the local frontend URL in the terminal.

---

## Environment Variables

### Backend

| Variable | Description |
|---|---|
| `PORT` | Backend server port |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | JWT signing and verification secret |
| `GEMINI_API_KEY` | Google Gemini API key |
| `RAZORPAY_KEY_ID` | Razorpay API key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay API secret |
| `RAZORPAY_PLAN_ID` | Razorpay subscription plan ID |
| `RAZORPAY_WEBHOOK_SECRET` | Razorpay webhook signing secret |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

### Frontend

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL |

For local development:

```env
VITE_API_URL=http://localhost:5000/api
```

For production:

```env
VITE_API_URL=https://ai-property-management-agent.onrender.com/api
```

---

## API Configuration

The backend API is organized into resource-based routes.

| Resource | Base Endpoint |
|---|---|
| Authentication | `/api/auth` |
| Users | `/api/users` |
| Properties | `/api/properties` |
| Maintenance | `/api/maintenance` |
| Notifications | `/api/notifications` |
| Subscriptions | `/api/subscriptions` |
| Subscription Webhook | `/api/subscriptions/webhook` |

Additional endpoints handle maintenance analytics, scheduling, escalation, SLA monitoring, and tenant maintenance history.

---

## Deployment

### Backend — Render

The backend is deployed using Render.

**Production backend:**

https://ai-property-management-agent.onrender.com

Configuration:

| Setting | Value |
|---|---|
| Root Directory | `backend` |
| Build Command | `npm install && npm run build` |
| Start Command | `npm start` |
| Health Check | `/` |

### Frontend — Vercel

The frontend is intended to be deployed using Vercel.

Configuration:

| Setting | Value |
|---|---|
| Root Directory | `frontend` |
| Framework | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |

Configure `VITE_API_URL` in the Vercel environment variables.
**Production frontend:**
https://ai-property-management-agent.vercel.app/

### Razorpay Webhook

Configure the Razorpay webhook to point to:

```text
https://ai-property-management-agent.onrender.com/api/subscriptions/webhook
```

Use the same webhook signing secret configured in the backend environment.

---

## Security Considerations

- Never commit `.env` files or API credentials.
- Use separate JWT secrets for development and production.
- Keep Razorpay secret keys on the backend.
- Validate authorization on the server, not only in frontend routes.
- Restrict sensitive property analytics to authorized roles.
- Configure MongoDB Atlas network access appropriately.
- Verify Razorpay webhook signatures before processing payment events.

---

## Build & Testing

Backend:

```bash
cd backend
npm run build
npm test
```

Frontend:

```bash
cd frontend
npm run build
```

---

## Future Improvements

Potential areas for future development:

- Enhanced AI-powered maintenance prediction.
- Advanced property analytics.
- More detailed operational reporting.
- Improved notification workflows.
- Additional automation for property operations.

---

## Author

**Jerin Benny**

GitHub: [@Jerin34](https://github.com/Jerin34)

---

## License

This project is currently maintained as a personal development project. Add an explicit open-source license before permitting reuse or redistribution.
