# Backend Development Report for NGO Platform

**Date:** July 30, 2025  
**Project:** HopeHands NGO Platform  
**Technology Stack:** React Frontend, Node.js Backend, MongoDB Database  

## Executive Summary

This report provides a comprehensive analysis of the frontend requirements to guide backend development for the HopeHands NGO Platform. The analysis covers API endpoints, data models, business logic, validation requirements, and security considerations based on the existing React frontend implementation.

---

## 1. API Requirements

### 1.1 Authentication & Authorization Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/login` | User login (member/admin) | No |
| POST | `/api/auth/signup` | Member registration | No |
| POST | `/api/auth/logout` | User logout | Yes |
| GET | `/api/auth/verify` | Verify JWT token | Yes |
| POST | `/api/auth/forgot-password` | Request password reset | No |
| POST | `/api/auth/reset-password` | Reset password with token | No |

### 1.2 Contact Management Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/contact` | Submit contact form | No |
| GET | `/api/contact` | Get all contact submissions | Admin |
| GET | `/api/contact/:id` | Get specific contact submission | Admin |
| PUT | `/api/contact/:id/status` | Update contact status | Admin |
| DELETE | `/api/contact/:id` | Delete contact submission | Admin |

### 1.3 Membership Management Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/membership` | Submit membership application | No |
| GET | `/api/membership` | Get all membership applications | Admin |
| GET | `/api/membership/:id` | Get specific application | Admin/Owner |
| PUT | `/api/membership/:id/approve` | Approve membership | Admin |
| PUT | `/api/membership/:id/reject` | Reject membership | Admin |
| POST | `/api/membership/login` | Member login portal | No |
| GET | `/api/membership/profile` | Get member profile | Member |
| PUT | `/api/membership/profile` | Update member profile | Member |
| GET | `/api/membership/certificate/:id` | Generate/download certificate | Member/Admin |

### 1.4 Donation Management Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/membership/donation` | Process donation | No |
| GET | `/api/donations` | Get all donations | Admin |
| GET | `/api/donations/:id` | Get specific donation | Admin/Owner |
| GET | `/api/donations/stats` | Get donation statistics | Admin |
| POST | `/api/donations/:id/certificate` | Generate donation certificate | Admin |
| GET | `/api/donations/recent` | Get recent donations | Admin |
| GET | `/api/donations/search` | Search donations | Admin |

### 1.5 Chat & Communication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/chat/messages` | Get chat messages | Member |
| POST | `/api/chat/messages` | Send message | Member |
| GET | `/api/chat/users` | Get online users | Member |
| POST | `/api/chat/private` | Send private message | Member |
| GET | `/api/chat/private/:userId` | Get private conversation | Member |
| PUT | `/api/chat/private/read` | Mark messages as read | Member |

### 1.6 Admin Dashboard Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/admin/stats` | Get admin dashboard stats | Admin |
| GET | `/api/admin/activities` | Get member activities | Admin |
| POST | `/api/admin/announcements` | Create announcement | Admin |
| GET | `/api/admin/announcements` | Get announcements | Admin |
| PUT | `/api/admin/announcements/:id` | Update announcement | Admin |
| DELETE | `/api/admin/announcements/:id` | Delete announcement | Admin |
| POST | `/api/admin/events` | Create event | Admin |
| GET | `/api/admin/events` | Get events | Admin |
| PUT | `/api/admin/events/:id` | Update event | Admin |
| DELETE | `/api/admin/events/:id` | Delete event | Admin |

### 1.7 Utility Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/health` | Health check | No |
| POST | `/api/upload` | File upload utility | Member/Admin |
| GET | `/api/certificates/generate/:type/:id` | Generate certificates | Member/Admin |

---

## 2. Data Models and Formats

### 2.1 User/Member Model
```json
{
  "_id": "ObjectId",
  "name": "string (required)",
  "email": "string (required, unique)",
  "phone": "string (required)",
  "password": "string (hashed, required)",
  "role": "enum ['member', 'admin'] (default: 'member')",
  "membershipType": "enum ['basic', 'premium', 'lifetime'] (default: 'basic')",
  "status": "enum ['pending', 'approved', 'rejected', 'expired'] (default: 'pending')",
  "address": "string (optional)",
  "dateOfBirth": "Date (optional)",
  "avatar": "string (URL, optional)",
  "joinDate": "Date (default: now)",
  "membershipStartDate": "Date (optional)",
  "membershipEndDate": "Date (optional)",
  "lastActive": "Date",
  "loginCount": "number (default: 0)",
  "profileCompleteness": "number (0-100, default: 0)",
  "certificateGenerated": "boolean (default: false)",
  "certificateDownloaded": "boolean (default: false)",
  "eventsAttended": "number (default: 0)",
  "messagesPosted": "number (default: 0)",
  "reason": "string (application reason)",
  "isVerified": "boolean (default: false)",
  "verificationToken": "string (optional)",
  "resetPasswordToken": "string (optional)",
  "resetPasswordExpires": "Date (optional)",
  "createdAt": "Date (default: now)",
  "updatedAt": "Date (default: now)"
}
```

### 2.2 Contact Model
```json
{
  "_id": "ObjectId",
  "name": "string (required)",
  "email": "string (required)",
  "phone": "string (required)",
  "message": "string (required)",
  "status": "enum ['new', 'in-progress', 'resolved'] (default: 'new')",
  "priority": "enum ['low', 'medium', 'high'] (default: 'medium')",
  "assignedTo": "ObjectId (ref: User, optional)",
  "response": "string (optional)",
  "responseDate": "Date (optional)",
  "ipAddress": "string (optional)",
  "userAgent": "string (optional)",
  "createdAt": "Date (default: now)",
  "updatedAt": "Date (default: now)"
}
```

### 2.3 Donation Model
```json
{
  "_id": "ObjectId",
  "donationId": "string (unique, auto-generated)",
  "donorName": "string (required)",
  "email": "string (required)",
  "phone": "string (required)",
  "address": "string (optional)",
  "amount": "number (required, min: 100)",
  "currency": "string (default: 'INR')",
  "paymentMethod": "enum ['card', 'upi', 'netbanking'] (required)",
  "transactionId": "string (required)",
  "purpose": "string (required)",
  "panNumber": "string (optional)",
  "isAnonymous": "boolean (default: false)",
  "certificateGenerated": "boolean (default: false)",
  "certificateDownloaded": "boolean (default: false)",
  "memberAccountCreated": "boolean (default: false)",
  "memberId": "string (optional)",
  "memberPassword": "string (optional)",
  "receiptNumber": "string (auto-generated)",
  "donationDate": "Date (default: now)",
  "paymentStatus": "enum ['pending', 'completed', 'failed'] (default: 'pending')",
  "project": "string (optional)",
  "message": "string (optional)",
  "donationType": "enum ['one-time', 'monthly', 'annual'] (default: 'one-time')",
  "createdAt": "Date (default: now)",
  "updatedAt": "Date (default: now)"
}
```

### 2.4 Chat Message Model
```json
{
  "_id": "ObjectId",
  "senderId": "ObjectId (ref: User, required)",
  "receiverId": "ObjectId (ref: User, optional)", // null for group messages
  "message": "string (required)",
  "type": "enum ['message', 'announcement', 'system'] (default: 'message')",
  "isPrivate": "boolean (default: false)",
  "read": "boolean (default: false)",
  "edited": "boolean (default: false)",
  "editedAt": "Date (optional)",
  "attachments": "[string] (optional)", // URLs to uploaded files
  "reactions": "[{userId: ObjectId, emoji: string}] (optional)",
  "replyTo": "ObjectId (ref: ChatMessage, optional)",
  "createdAt": "Date (default: now)",
  "updatedAt": "Date (default: now)"
}
```

### 2.5 Event Model
```json
{
  "_id": "ObjectId",
  "title": "string (required)",
  "description": "string (required)",
  "date": "Date (required)",
  "time": "string (required)",
  "location": "string (required)",
  "maxAttendees": "number (required, min: 1)",
  "currentAttendees": "number (default: 0)",
  "attendees": "[ObjectId] (ref: User)",
  "status": "enum ['upcoming', 'ongoing', 'completed', 'cancelled'] (default: 'upcoming')",
  "createdBy": "ObjectId (ref: User, required)",
  "eventType": "enum ['meeting', 'workshop', 'celebration', 'training'] (optional)",
  "isVirtual": "boolean (default: false)",
  "meetingLink": "string (optional)",
  "registrationRequired": "boolean (default: true)",
  "registrationDeadline": "Date (optional)",
  "tags": "[string] (optional)",
  "createdAt": "Date (default: now)",
  "updatedAt": "Date (default: now)"
}
```

### 2.6 Announcement Model
```json
{
  "_id": "ObjectId",
  "title": "string (required)",
  "message": "string (required)",
  "priority": "enum ['low', 'medium', 'high'] (default: 'medium')",
  "targetAudience": "enum ['all', 'members', 'admins'] (default: 'all')",
  "createdBy": "ObjectId (ref: User, required)",
  "isPublished": "boolean (default: true)",
  "publishDate": "Date (default: now)",
  "expiryDate": "Date (optional)",
  "viewedBy": "[ObjectId] (ref: User)",
  "attachments": "[string] (optional)",
  "category": "enum ['general', 'project', 'event', 'urgent'] (optional)",
  "createdAt": "Date (default: now)",
  "updatedAt": "Date (default: now)"
}
```

### 2.7 Member Activity Model
```json
{
  "_id": "ObjectId",
  "memberId": "ObjectId (ref: User, required)",
  "action": "string (required)",
  "details": "string (optional)",
  "type": "enum ['login', 'certificate', 'chat', 'event', 'profile', 'donation'] (required)",
  "metadata": "Object (optional)", // Additional data based on action type
  "ipAddress": "string (optional)",
  "userAgent": "string (optional)",
  "timestamp": "Date (default: now)"
}
```

---

## 3. Business Logic & Validation

### 3.1 Authentication & Authorization
- **JWT Token Management**: Implement secure token generation with appropriate expiration times
- **Role-Based Access Control**: Enforce member vs admin permissions
- **Password Security**: Minimum 8 characters, bcrypt hashing with salt rounds ≥ 12
- **Account Lockout**: Implement after 5 failed login attempts within 15 minutes
- **Session Management**: Single active session per user with refresh token rotation

### 3.2 Membership Application Logic
- **Auto-generated Member IDs**: Format: `NGO-YYYY-XXX-NNN` (Year-Type-Sequential)
- **Email Verification**: Send verification email upon application submission
- **Admin Approval Workflow**: 
  - Pending → Admin Review → Approved/Rejected
  - Auto-generate certificate upon approval
  - Send notification emails for status changes
- **Membership Expiration**: Track based on membership type duration

### 3.3 Donation Processing Logic
- **Payment Validation**: Integrate with payment gateway APIs (Razorpay/Stripe)
- **Donation ID Generation**: Format: `DON-YYYY-NNN` (Year-Sequential)
- **Receipt Generation**: Auto-generate receipt numbers: `HOPE-{timestamp}`
- **Member Account Creation**: Auto-create member accounts for non-anonymous donors above ₹1000
- **Certificate Generation**: Auto-generate donation certificates for all successful donations
- **PAN Validation**: Validate PAN format for tax benefit eligibility

### 3.4 Chat System Logic
- **Real-time Messaging**: Implement WebSocket connections for live chat
- **Message Moderation**: Basic profanity filtering and spam detection
- **Private Messaging**: Secure direct messaging between members
- **Announcement Broadcasting**: Admin-only feature to send announcements
- **Message Persistence**: Store all messages with read/unread status

### 3.5 File Upload & Certificate Generation
- **File Validation**: 
  - Max size: 5MB for images, 10MB for documents
  - Allowed types: JPG, PNG, PDF, DOC, DOCX
- **Certificate Templates**: PDF generation using libraries like jsPDF or PDFKit
- **Secure Storage**: Use cloud storage (AWS S3/Azure Blob) with signed URLs

### 3.6 Input Validation Rules

#### Contact Form
- Name: 2-100 characters, letters and spaces only
- Email: Valid email format, max 255 characters
- Phone: Valid phone number with country code
- Message: 10-2000 characters

#### Membership Application
- All contact form validations
- Membership type: Must be valid enum value
- Age verification: Must be 18+ years old

#### Donation Form
- Amount: Minimum ₹100, maximum ₹10,00,000 per transaction
- PAN: Optional but must match format if provided: `[A-Z]{5}[0-9]{4}[A-Z]{1}`
- Payment method: Must be supported by payment gateway

---

## 4. Error Handling

### 4.1 Standardized Error Response Format
```json
{
  "success": false,
  "message": "Human-readable error message",
  "errors": [
    {
      "field": "fieldName",
      "message": "Specific field error message"
    }
  ],
  "code": "ERROR_CODE",
  "timestamp": "2025-07-30T10:30:00.000Z",
  "requestId": "uuid"
}
```

### 4.2 HTTP Status Codes
- **200**: Success with data
- **201**: Resource created successfully
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (invalid/missing token)
- **403**: Forbidden (insufficient permissions)
- **404**: Resource not found
- **409**: Conflict (duplicate email, etc.)
- **429**: Too Many Requests (rate limiting)
- **500**: Internal Server Error

### 4.3 Common Error Scenarios
- **Validation Errors**: Return 400 with field-specific error messages
- **Authentication Errors**: Return 401 with token refresh instructions
- **Authorization Errors**: Return 403 with permission requirements
- **Resource Not Found**: Return 404 with helpful suggestions
- **Duplicate Data**: Return 409 with conflict details
- **Rate Limiting**: Return 429 with retry-after header

---

## 5. Additional Backend Features

### 5.1 Security Implementation
- **Input Sanitization**: Implement against XSS and SQL injection
- **CORS Configuration**: Restrict to frontend domain only
- **Rate Limiting**: 
  - Authentication: 5 attempts per 15 minutes per IP
  - API calls: 100 requests per minute per user
- **Helmet.js**: Security headers implementation
- **Environment Variables**: All sensitive data in .env files
- **API Key Management**: Secure storage of payment gateway keys

### 5.2 Performance Optimization
- **Database Indexing**: 
  - Email fields (unique)
  - User roles and status
  - Donation dates and amounts
  - Message timestamps
- **Caching Strategy**: 
  - Redis for session storage
  - Cache frequently accessed data (stats, announcements)
- **Pagination**: Implement for all list endpoints (default: 20 items)
- **Database Queries**: Use aggregation pipelines for statistics

### 5.3 Monitoring & Logging
- **Request Logging**: Log all API requests with timestamps and user info
- **Error Tracking**: Implement error tracking service (Sentry)
- **Performance Monitoring**: Track API response times
- **Health Checks**: Implement comprehensive health check endpoints
- **Audit Trails**: Log all admin actions and data modifications

### 5.4 Email Service Integration
- **SMTP Configuration**: Use services like SendGrid or AWS SES
- **Email Templates**: 
  - Welcome emails for new members
  - Approval/rejection notifications
  - Password reset emails
  - Donation confirmation emails
  - Certificate delivery emails
- **Queue Management**: Use Bull Queue for email processing

### 5.5 Real-time Features
- **WebSocket Implementation**: For chat and live notifications
- **Event Broadcasting**: Real-time updates for:
  - New member approvals
  - Donation notifications
  - System announcements
- **Connection Management**: Handle user online/offline status

### 5.6 Data Analytics
- **Dashboard Statistics**: 
  - Real-time member count
  - Donation trends and analytics
  - Member engagement metrics
  - Activity tracking
- **Report Generation**: 
  - Monthly member reports
  - Donation summaries
  - Activity reports for admins

### 5.7 Backup & Recovery
- **Database Backups**: Daily automated backups with 30-day retention
- **File Backups**: Regular backup of uploaded files and certificates
- **Disaster Recovery**: Documented recovery procedures
- **Data Export**: Admin capability to export member and donation data

---

## 6. Database Schema Recommendations

### 6.1 Indexes
```javascript
// Users Collection
db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "role": 1, "status": 1 })
db.users.createIndex({ "membershipType": 1 })
db.users.createIndex({ "joinDate": -1 })

// Donations Collection
db.donations.createIndex({ "donationId": 1 }, { unique: true })
db.donations.createIndex({ "email": 1 })
db.donations.createIndex({ "donationDate": -1 })
db.donations.createIndex({ "amount": -1 })
db.donations.createIndex({ "paymentStatus": 1 })

// Chat Messages Collection
db.chatmessages.createIndex({ "senderId": 1, "createdAt": -1 })
db.chatmessages.createIndex({ "receiverId": 1, "read": 1 })
db.chatmessages.createIndex({ "type": 1, "createdAt": -1 })

// Contact Collection
db.contacts.createIndex({ "status": 1, "createdAt": -1 })
db.contacts.createIndex({ "email": 1 })
```

### 6.2 Data Relationships
- **Users ↔ Donations**: One-to-many (one user can have multiple donations)
- **Users ↔ Chat Messages**: One-to-many (sender relationship)
- **Users ↔ Events**: Many-to-many (attendee relationship)
- **Users ↔ Member Activities**: One-to-many (activity tracking)

---

## 7. Implementation Priority

### Phase 1: Core Authentication & Basic API
1. User authentication system (login/signup/JWT)
2. Contact form API
3. Basic membership application API
4. Health check and basic error handling

### Phase 2: Donation System
1. Payment gateway integration
2. Donation processing API
3. Certificate generation system
4. Member account auto-creation

### Phase 3: Admin Dashboard
1. Member management APIs
2. Admin dashboard statistics
3. Approval/rejection workflows
4. Activity tracking

### Phase 4: Communication Features
1. Chat system with WebSocket
2. Announcement system
3. Email service integration
4. Event management

### Phase 5: Advanced Features
1. Real-time notifications
2. Advanced analytics
3. File upload system
4. Performance optimization

---

## 8. Testing Requirements

### 8.1 Unit Tests
- Authentication middleware
- Validation functions
- Business logic functions
- Database operations

### 8.2 Integration Tests
- API endpoint testing
- Database integration
- Payment gateway integration
- Email service integration

### 8.3 Performance Tests
- Load testing for API endpoints
- Database query performance
- WebSocket connection handling
- File upload performance

---

## Conclusion

This backend development report provides a comprehensive roadmap for implementing the NGO platform backend. The implementation should prioritize security, scalability, and maintainability while ensuring seamless integration with the existing React frontend. Regular code reviews, testing, and documentation updates will be essential for successful project delivery.

**Next Steps:**
1. Set up development environment with Node.js, Express, and MongoDB
2. Implement Phase 1 features following the outlined API specifications
3. Set up continuous integration and deployment pipelines
4. Begin comprehensive testing strategy implementation

---

*Report prepared by: AI Assistant*  
*Date: July 30, 2025*
