import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
const router = express.Router();
// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { email, password, name, phone } = req.body;
        if (!email || !password || !name || !phone) {
            return res.status(400).json({ success: false, message: 'All required fields must be provided.' });
        }
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(409).json({ success: false, message: 'Email already registered.' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ email, password: hashedPassword, name, phone });
        await user.save();
        res.status(201).json({ success: true, message: 'Registration successful.' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Registration failed.', error: error?.message || 'Unknown error' });
    }
});
// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password required.' });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
        res.json({ success: true, message: 'Login successful.', token, user: { id: user._id, email: user.email, name: user.name } });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Login failed.', error: error?.message || 'Unknown error' });
    }
});
export default router;
//# sourceMappingURL=auth.js.map