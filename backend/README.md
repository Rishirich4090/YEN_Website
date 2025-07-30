# HopeHands NGO Backend API

A comprehensive Node.js backend with TypeScript for the HopeHands NGO membership system.

## 🚀 Features

### ✅ **Membership System**
- **Application Processing**: Submit and track membership applications
- **Login System**: Secure member authentication with JWT
- **Approval Workflow**: Admin approval with email notifications
- **Duration Tracking**: Automatic membership expiration handling
- **Verification Badges**: Instagram-style verification system
- **Certificate Generation**: PDF certificates with email delivery

### ✅ **Email Integration**
- **Welcome Emails**: Login credentials sent upon application
- **Approval Notifications**: Comprehensive approval emails with certificates
- **Contact Form**: Professional email templates for inquiries
- **Certificate Delivery**: Automatic PDF attachment system

### ✅ **API Endpoints**

#### Membership Routes (`/api/membership`)
```
POST   /                     - Submit membership application
POST   /login               - Member login
GET    /status/:loginId     - Check membership status
POST   /approve/:membershipId - Approve membership (Admin)
GET    /certificate/:membershipId - Download certificate
POST   /extend/:membershipId - Extend membership
```

#### Contact Routes (`/api/contact`)
```
POST   /                     - Submit contact form
GET    /                     - Get all contacts (Admin)
PATCH  /:id/status          - Update contact status
```

#### System Routes
```
GET    /api/health          - Health check
```

## 🛠️ Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env` and configure:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/hopehands

# Email Configuration (Gmail)
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASSWORD=your_app_password
ADMIN_EMAIL=myngoofficial@gmail.com

# Server
PORT=5000
NODE_ENV=development

# Security
JWT_SECRET=your_jwt_secret_here
```

### 3. Gmail App Password Setup
1. Enable 2-Factor Authentication in Gmail
2. Go to Google Account → Security → 2-Step Verification
3. Click "App passwords" at the bottom
4. Generate password for "Mail" → "Other (HopeHands Backend)"
5. Use the 16-character password in `EMAIL_PASSWORD`

### 4. Start Development Server
```bash
npm run dev
```

### 5. Production Build
```bash
npm run build
npm start
```

## 🧪 Testing

### Manual API Testing
```bash
# Test health check
curl http://localhost:5000/api/health

# Test membership application
curl -X POST http://localhost:5000/api/membership \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com", 
    "phone": "+1234567890",
    "membershipType": "basic"
  }'
```

### Automated Testing
```bash
# Run validation script
node validate-backend.js

# Run comprehensive tests (requires running server)
node test-backend.js
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts         # MongoDB connection
│   ├── models/
│   │   ├── Member.ts           # Member schema
│   │   ├── Contact.ts          # Contact schema
│   │   └── Donation.ts         # Donation schema
│   ├── routes/
│   │   ├── membership.ts       # Membership endpoints
│   │   └── contact.ts          # Contact endpoints
│   ├── services/
│   │   ├── emailService.ts     # Email functionality
│   │   └── certificateService.ts # PDF generation
│   ├── middleware/
│   │   └── validation.ts       # Input validation
│   └── index.ts               # Main server file
├── test-backend.js            # Comprehensive API tests
├── validate-backend.js        # Structure validation
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
├── .env.example              # Environment template
└── README.md                 # This file
```

## 🔄 Workflow

### Member Registration Flow
1. **Application**: User submits form → Gets unique login credentials via email
2. **Login**: User can login anytime to check status
3. **Approval**: Admin approves → Member gets verification badge + certificate email
4. **Access**: Member can download certificate from profile
5. **Expiration**: System tracks duration and removes badge when expired
6. **Extension**: Members can request membership extension

### Certificate System
- **Generation**: PDF certificates created with jsPDF
- **Email Delivery**: Automatic attachment to approval emails  
- **Download**: Direct download from member profile
- **Templates**: Professional branded certificate designs

### Email Templates
- **Credentials Email**: Welcome message with login details
- **Approval Email**: Celebration email with certificate attachment
- **Contact Email**: Professional inquiry notifications

## 🔐 Security Features

- **Password Hashing**: bcryptjs for secure password storage
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Zod schema validation
- **CORS Protection**: Configured for frontend domains
- **Error Handling**: Comprehensive error middleware

## 📊 Database Schema

### Member Model
```typescript
{
  name: string
  email: string (unique)
  phone: string
  membershipType: 'basic' | 'premium' | 'lifetime'
  membershipId: string (unique)
  loginId: string (unique)
  password: string (hashed)
  joinDate: Date
  membershipStartDate: Date
  membershipEndDate: Date
  membershipDuration: number (months)
  approvalStatus: 'pending' | 'approved' | 'rejected' | 'expired'
  isActive: boolean
  certificateSent: boolean
  hasVerificationBadge: boolean
  lastLogin: Date
}
```

## 🚨 Troubleshooting

### Common Issues

1. **Email not sending**
   - Check Gmail App Password
   - Verify EMAIL_USER and EMAIL_PASSWORD in .env
   - Ensure 2FA is enabled in Gmail

2. **MongoDB connection failed**
   - Install and start MongoDB locally
   - Check MONGODB_URI in .env
   - Verify MongoDB is running on port 27017

3. **Certificate generation errors**
   - Check jsPDF installation
   - Verify file permissions
   - Review error logs for specific issues

4. **Authentication issues**
   - Check JWT_SECRET in .env
   - Verify token expiration
   - Check password hashing

### Logs and Debugging
- Enable detailed logging in development
- Check console output for error messages
- Use API testing tools like Postman or curl
- Monitor MongoDB logs for database issues

## 📝 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ] // For validation errors
}
```

## 🔄 Version History

- **v1.0.0**: Initial membership system with login and certificates
- **v1.1.0**: Added verification badges and duration tracking
- **v1.2.0**: Enhanced email templates and approval workflow

## 🤝 Contributing

1. Follow TypeScript best practices
2. Maintain comprehensive error handling
3. Update tests for new features
4. Document API changes
5. Use semantic versioning

## 📞 Support

For technical issues or questions about the backend API, please refer to the troubleshooting section or contact the development team.

---

**HopeHands NGO Backend** - Empowering communities through technology 🌟
