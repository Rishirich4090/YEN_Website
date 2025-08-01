import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Define User schema inline for testing
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  password: { type: String, select: false },
  role: { type: String, default: 'member' },
  membershipType: { type: String, default: 'basic' },
  status: { type: String, default: 'pending' },
  isVerified: { type: Boolean, default: false },
  loginCount: { type: Number, default: 0 },
  profileCompleteness: { type: Number, default: 0 },
  certificateGenerated: { type: Boolean, default: false },
  certificateDownloaded: { type: Boolean, default: false },
  eventsAttended: { type: Number, default: 0 },
  messagesPosted: { type: Number, default: 0 },
  loginAttempts: { type: Number, default: 0 },
  joinDate: { type: Date, default: Date.now }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

async function updateUserPassword() {
  try {
    await mongoose.connect('mongodb://localhost:27017/yen_web');
    console.log('✅ Connected to MongoDB');
    
    const email = 'arunkmrkhata@gmail.com';
    const newPassword = 'Amit@123';
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    console.log('🔐 New password hash:', hashedPassword);
    
    // Update the user's password
    const result = await User.updateOne(
      { email: email },
      { $set: { password: hashedPassword } }
    );
    
    console.log('📝 Update result:', result);
    
    if (result.modifiedCount > 0) {
      console.log('✅ Password updated successfully');
      
      // Verify the update
      const user = await User.findOne({ email: email }).select('+password');
      const isMatch = await bcrypt.compare(newPassword, user.password);
      console.log('🧪 Verification test:', isMatch ? '✅ Password matches' : '❌ Password does not match');
    } else {
      console.log('❌ No user was updated');
    }
    
  } catch (error) {
    console.error('💥 Error:', error.message);
    console.error('📋 Stack:', error.stack);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

updateUserPassword();
