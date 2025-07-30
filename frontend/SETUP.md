# HopeHands NGO Management System - Setup Guide

## 🚀 Complete Setup Process

### Prerequisites
- **Node.js** (v18+ recommended)
- **MongoDB** (Local installation or Atlas account)
- **Git** 
- **Gmail Account** (for email services)

---

## Step 1: Database Setup

### Option A: Local MongoDB
1. Download and install [MongoDB Community Edition](https://www.mongodb.com/try/download/community)
2. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

### Option B: MongoDB Atlas (Recommended)
1. Create account at [MongoDB Atlas](https://mongodb.com/atlas)
2. Create a free cluster
3. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/hopehands`

---

## Step 2: Email Configuration

### Gmail App Password Setup
1. Enable 2-factor authentication on your Gmail account
2. Go to Google Account Settings → Security → App passwords
3. Generate app password for "Mail"
4. Use this password in environment variables

---

## Step 3: Environment Configuration

### Backend Environment (`backend/.env`)
```env
# Database
MONGODB_URI=mongodb://localhost:27017/hopehands
# OR: mongodb+srv://username:password@cluster.mongodb.net/hopehands

# Email Configuration
EMAIL_USER=your-ngo-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587

# Admin Account
ADMIN_EMAIL=admin@hopehands.org
ADMIN_PASSWORD=SecureAdminPassword123!

# Security
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
BCRYPT_ROUNDS=12

# Server
PORT=3001
NODE_ENV=development
```

### Frontend Environment (`.env.local`)
```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_APP_NAME=HopeHands NGO
VITE_SUPPORT_EMAIL=support@hopehands.org
```

---

## Step 4: Installation & Startup

### Quick Start (Recommended)
```bash
# 1. Install all dependencies
npm run setup

# 2. Start complete system
npm run dev:system
```

### Manual Start
```bash
# 1. Install frontend dependencies
npm install

# 2. Install backend dependencies
cd backend && npm install

# 3. Start backend (in one terminal)
cd backend && npm run dev

# 4. Start frontend (in another terminal)
npm run dev
```

---

## Step 5: Verification

### Check System Health
1. **Frontend**: Open http://localhost:8080
2. **Backend API**: Visit http://localhost:3001/api/health
3. **Database**: Verify MongoDB connection in backend logs

### Test Core Features
1. **Contact Form**: Submit a test message
2. **Membership**: Apply for membership
3. **Admin Login**: Use admin credentials
4. **Email**: Check if emails are being sent

---

## Step 6: Admin Account Setup

### Default Admin Account
- **Email**: admin@hopehands.org
- **Password**: As set in ADMIN_PASSWORD env variable

### Admin Features
- Approve/reject membership applications
- Send announcements
- Manage members
- View donations
- Generate certificates

---

## Step 7: Production Deployment

### Backend Deployment (Example: Railway/Heroku)
1. Set production environment variables
2. Deploy backend with build command: `npm run build`
3. Update frontend API URL to production backend

### Frontend Deployment (Example: Netlify/Vercel)
1. Build frontend: `npm run build`
2. Deploy dist folder
3. Set environment variables in hosting platform

---

## 🛠️ Troubleshooting

### Common Issues

#### MongoDB Connection Failed
- **Solution**: Check MongoDB is running or Atlas connection string is correct

#### Email Not Sending
- **Solution**: Verify Gmail app password and 2FA is enabled

#### Port Already in Use
- **Solution**: Change PORT in backend/.env or kill process using port

#### API Requests Failing
- **Solution**: Check VITE_API_BASE_URL matches backend server URL

### Backend Validation
```bash
# Run backend validation script
npm run validate:backend
```

### Reset Everything
```bash
# Clean install
npm run clean
npm run setup
```

---

## 📁 Project Structure

```
hopehands-ngo/
├── client/                 # Frontend React app
│   ├── components/        # Reusable components
│   ├── pages/            # Page components
│   ├── lib/              # Utilities & services
│   └── ...
├── backend/               # Backend Node.js API
│   ├── src/
│   │   ├── models/       # Database models
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   └── middleware/   # Express middleware
│   └── ...
├── start-system.js       # System startup script
└── SETUP.md             # This file
```

---

## 🎯 Next Steps

1. **Customize**: Update NGO details, colors, and content
2. **Configure**: Set up real email templates and certificates
3. **Test**: Thoroughly test all features
4. **Deploy**: Set up production environment
5. **Monitor**: Set up logging and error tracking

---

## 📞 Support

If you encounter issues:
1. Check this setup guide
2. Review console logs
3. Verify environment variables
4. Test individual components

## 🔒 Security Notes

- Never commit `.env` files to Git
- Use strong passwords for admin accounts
- Enable HTTPS in production
- Regularly update dependencies
- Monitor for security vulnerabilities
