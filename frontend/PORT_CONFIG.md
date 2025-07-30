# Port Configuration for HopeHands NGO Application

## Default Ports

### Frontend (Vite Development Server)
- **Default Port**: `8080`
- **Configuration**: `vite.config.ts`
- **Access URL**: `http://localhost:8080`

### Backend API Server
- **Default Port**: `5000`
- **Configuration**: `backend/src/index.ts`
- **Access URL**: `http://localhost:5000/api`

## Port Configuration Files

### Frontend Port (8080)
File: `vite.config.ts`
```typescript
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,  // Default frontend port
  },
  // ... other config
}));
```

### Backend Port (5000)
File: `backend/src/index.ts`
```typescript
const PORT = process.env.PORT || 5000;  // Default backend port
```

## Environment Variables

### Frontend API URL
File: `.env`
```bash
VITE_API_URL=http://localhost:5000/api
```

### Backend Configuration
File: `backend/.env`
```bash
PORT=5000  # Backend port (optional, defaults to 5000)
```

## Development Commands

```bash
# Start frontend only (port 8080)
npm run dev

# Start backend only (port 5000)
npm run dev:backend

# Start both frontend and backend
npm run dev:full
```

## CORS Configuration

The backend is configured to accept requests from port 8080:

```typescript
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourfrontendurl.com'] 
    : ['http://localhost:8080', 'http://localhost:3000'],
  credentials: true
}));
```

## Production Deployment

In production, you can override the default ports using environment variables:

```bash
# Frontend build serves static files
# Backend can use custom port
PORT=3000 npm start
```

## Summary

- **Frontend (React/Vite)**: Port 8080 (default)
- **Backend (Node.js/Express)**: Port 5000 (default)
- **MongoDB**: Port 27017 (default)
- **Proxy Configuration**: Points to port 8080 for development
