import Donation from '../src/models/Donation.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hopehands_db');
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};

// Test donation creation with all schema fields
const testDonationCreation = async () => {
  try {
    console.log('🧪 Testing donation creation...');

    const testDonation = new Donation({
      // Donor Information
      donorName: 'John Doe',
      donorEmail: 'john.doe@example.com',
      donorPhone: '+1-555-123-4567',
      donorAddress: {
        street: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'United States'
      },
      
      // Donation Details
      amount: 100.00,
      currency: 'USD',
      donationType: 'one-time',
      
      // Payment Information
      paymentMethod: 'credit-card',
      paymentProvider: 'stripe',
      transactionId: 'TXN-TEST-' + Date.now(),
      paymentStatus: 'completed',
      
      // Project/Campaign Information
      designation: 'education',
      
      // Donor Interaction
      message: 'Happy to support education initiatives!',
      isAnonymous: false,
      publicDisplay: true,
      donorConsent: {
        marketing: false,
        updates: true,
        newsletter: true,
        dataProcessing: true
      },
      
      // Tracking and Analytics
      source: 'website'
    });

    const savedDonation = await testDonation.save();
    console.log('✅ Donation created successfully:', savedDonation._id);
    console.log('📄 Transaction ID:', savedDonation.transactionId);
    console.log('💰 Net Amount:', savedDonation.netAmount);
    console.log('📅 Fiscal Year:', savedDonation.fiscalYear);
    
    // Test instance methods
    console.log('\n🧪 Testing instance methods...');
    
    const netAmount = savedDonation.calculateNetAmount();
    console.log('✅ Calculated net amount:', netAmount);
    
    const marked = await savedDonation.markAsVerified(new mongoose.Types.ObjectId());
    console.log('✅ Donation verified successfully');
    
    // Test static methods
    console.log('\n🧪 Testing static methods...');
    
    const totalDonations = await Donation.getTotalDonations();
    console.log('✅ Total donations amount:', totalDonations);
    
    const stats = await Donation.getStatistics();
    console.log('✅ Donation statistics:', {
      total: stats.total,
      totalAmount: stats.totalAmount,
      topDonors: stats.topDonors.length
    });
    
    console.log('\n🎉 All tests passed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

// Main test function
const runTests = async () => {
  await connectDB();
  await testDonationCreation();
  
  // Clean up
  console.log('\n🧹 Cleaning up test data...');
  await Donation.deleteMany({ transactionId: { $regex: 'TXN-TEST-' } });
  console.log('✅ Test data cleaned up');
  
  mongoose.connection.close();
  console.log('👋 Database connection closed');
};

runTests().catch(console.error);
