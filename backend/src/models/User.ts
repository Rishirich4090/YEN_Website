import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'member' | 'admin';
  membershipType: 'basic' | 'premium' | 'lifetime';
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  address?: string;
  dateOfBirth?: Date;
  avatar?: string;
  joinDate: Date;
  membershipStartDate?: Date;
  membershipEndDate?: Date;
  lastActive?: Date;
  loginCount: number;
  profileCompleteness: number;
  certificateGenerated: boolean;
  certificateDownloaded: boolean;
  eventsAttended: number;
  messagesPosted: number;
  reason?: string;
  isVerified: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  loginAttempts: number;
  lockUntil?: Date;
  createdAt: Date;
  updatedAt: Date;

  // Instance methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateMemberId(): string;
  calculateProfileCompleteness(): number;
  isAccountLocked(): boolean;
  incrementLoginAttempts(): Promise<void>;
  resetLoginAttempts(): Promise<void>;
}

const UserSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [100, 'Name cannot exceed 100 characters'],
    match: [/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    maxlength: [255, 'Email cannot exceed 255 characters'],
    validate: {
      validator: function(email: string) {
        return validator.isEmail(email);
      },
      message: 'Please provide a valid email address'
    }
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    validate: {
      validator: function(phone: string) {
        return validator.isMobilePhone(phone, 'any');
      },
      message: 'Please provide a valid phone number'
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false // Don't include password in queries by default
  },
  role: {
    type: String,
    enum: {
      values: ['member', 'admin'],
      message: 'Role must be either member or admin'
    },
    default: 'member'
  },
  membershipType: {
    type: String,
    enum: {
      values: ['basic', 'premium', 'lifetime'],
      message: 'Membership type must be basic, premium, or lifetime'
    },
    default: 'basic'
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'approved', 'rejected', 'expired'],
      message: 'Status must be pending, approved, rejected, or expired'
    },
    default: 'pending'
  },
  address: {
    type: String,
    trim: true,
    maxlength: [500, 'Address cannot exceed 500 characters']
  },
  dateOfBirth: {
    type: Date,
    validate: {
      validator: function(date: Date) {
        const eighteenYearsAgo = new Date();
        eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
        return date <= eighteenYearsAgo;
      },
      message: 'User must be at least 18 years old'
    }
  },
  avatar: {
    type: String,
    trim: true,
    validate: {
      validator: function(url: string) {
        return !url || validator.isURL(url);
      },
      message: 'Avatar must be a valid URL'
    }
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  membershipStartDate: {
    type: Date
  },
  membershipEndDate: {
    type: Date
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  loginCount: {
    type: Number,
    default: 0,
    min: [0, 'Login count cannot be negative']
  },
  profileCompleteness: {
    type: Number,
    default: 0,
    min: [0, 'Profile completeness cannot be negative'],
    max: [100, 'Profile completeness cannot exceed 100%']
  },
  certificateGenerated: {
    type: Boolean,
    default: false
  },
  certificateDownloaded: {
    type: Boolean,
    default: false
  },
  eventsAttended: {
    type: Number,
    default: 0,
    min: [0, 'Events attended cannot be negative']
  },
  messagesPosted: {
    type: Number,
    default: 0,
    min: [0, 'Messages posted cannot be negative']
  },
  reason: {
    type: String,
    trim: true,
    maxlength: [2000, 'Reason cannot exceed 2000 characters']
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: {
    type: String,
    trim: true
  },
  resetPasswordToken: {
    type: String,
    trim: true
  },
  resetPasswordExpires: {
    type: Date
  },
  loginAttempts: {
    type: Number,
    default: 0,
    min: [0, 'Login attempts cannot be negative']
  },
  lockUntil: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      const { password, resetPasswordToken, verificationToken, __v, ...obj } = ret;
      return obj;
    }
  },
  toObject: { virtuals: true }
});

// Indexes for performance optimization
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ role: 1, status: 1 });
UserSchema.index({ membershipType: 1 });
UserSchema.index({ joinDate: -1 });
UserSchema.index({ lastActive: -1 });
UserSchema.index({ verificationToken: 1 });
UserSchema.index({ resetPasswordToken: 1 });

// Virtual for account lock status
UserSchema.virtual('isLocked').get(function(this: IUser) {
  return !!(this.lockUntil && this.lockUntil > new Date());
});

// Pre-save middleware to hash password
UserSchema.pre<IUser>('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12');
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Pre-save middleware to calculate profile completeness
UserSchema.pre<IUser>('save', function(next) {
  this.profileCompleteness = this.calculateProfileCompleteness();
  next();
});

// Instance method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Instance method to generate member ID
UserSchema.methods.generateMemberId = function(): string {
  const year = new Date().getFullYear();
  const memberType = this.membershipType.toUpperCase().substring(0, 3);
  const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `NGO-${year}-${memberType}-${randomNum}`;
};

// Instance method to calculate profile completeness
UserSchema.methods.calculateProfileCompleteness = function(): number {
  let completeness = 0;
  const fields = [
    'name', 'email', 'phone', 'address', 'dateOfBirth', 
    'avatar', 'reason'
  ];
  
  fields.forEach(field => {
    if (this[field]) completeness += 100 / fields.length;
  });
  
  return Math.round(completeness);
};

// Instance method to check if account is locked
UserSchema.methods.isAccountLocked = function(): boolean {
  return !!(this.lockUntil && this.lockUntil > new Date());
};

// Instance method to increment login attempts
UserSchema.methods.incrementLoginAttempts = async function(): Promise<void> {
  const maxAttempts = parseInt(process.env.MAX_LOGIN_ATTEMPTS || '5');
  const lockTime = parseInt(process.env.LOCKOUT_TIME || '900000'); // 15 minutes

  // Reset attempts if lock has expired
  if (this.lockUntil && this.lockUntil < new Date()) {
    this.loginAttempts = 1;
    this.lockUntil = undefined;
  } else {
    this.loginAttempts += 1;
    
    // Lock account if max attempts reached
    if (this.loginAttempts >= maxAttempts && !this.isAccountLocked()) {
      this.lockUntil = new Date(Date.now() + lockTime);
    }
  }
  
  await this.save();
};

// Instance method to reset login attempts
UserSchema.methods.resetLoginAttempts = async function(): Promise<void> {
  this.loginAttempts = 0;
  this.lockUntil = undefined;
  await this.save();
};

export default mongoose.model<IUser>('User', UserSchema);
