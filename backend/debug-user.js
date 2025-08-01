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

async function debugUser() {
  try {
    await mongoose.connect('mongodb://localhost:27017/yen_web');
    console.log('✅ Connected to MongoDB');
    
    // Find user with password field
    const user = await User.findOne({ email: 'arunkmrkhata@gmail.com' }).select('+password');
    
    if (user) {
      console.log('\n📋 User found:');
      console.log('📧 Email:', user.email);
      console.log('👤 Name:', user.name);
      console.log('🔑 Password field exists:', !!user.password);
      
      if (user.password) {
        console.log('🔢 Password length:', user.password.length);
        console.log('🔐 Password hash starts with $2:', user.password.startsWith('$2'));
        console.log('🔒 First 10 chars of hash:', user.password.substring(0, 10));
        
        // Test bcrypt comparison
        const testPassword = 'Amit@123';
        console.log('\n🧪 Testing bcrypt comparison...');
        console.log('📝 Test password:', testPassword);
        
        try {
          const isMatch = await bcrypt.compare(testPassword, user.password);
          console.log('✅ Bcrypt comparison result:', isMatch);
        } catch (bcryptError) {
          console.error('❌ Bcrypt comparison error:', bcryptError.message);
          console.error('🔍 Error details:', bcryptError);
        }
      } else {
        console.log('❌ Password field is null/undefined');
      }
    } else {
      console.log('❌ User not found');
      
      // Let's check all users
      const allUsers = await User.find({}).select('email name');
      console.log('\n📊 All users in database:');
      allUsers.forEach((u, index) => {
        console.log(`${index + 1}. ${u.email} - ${u.name}`);
      });
    }
    
  } catch (error) {
    console.error('💥 Error:', error.message);
    console.error('📋 Stack:', error.stack);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

debugUser();
