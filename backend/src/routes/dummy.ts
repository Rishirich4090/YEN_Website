import { Router } from 'express';
import { Request, Response } from 'express';
import mongoose from 'mongoose';

const router = Router();

const DummySchema = new mongoose.Schema({
  name: String,
  email: String,
}, { timestamps: true });

const DummyModel = mongoose.model('Dummy', DummySchema);

router.post('/dummy', async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;
    const dummy = new DummyModel({ name, email });
    await dummy.save();
    res.status(201).json({ message: 'Dummy data saved successfully', data: dummy });
  } catch (error) {
    console.error('Error saving dummy data:', error);
    res.status(500).json({ message: 'Failed to save dummy data', error });
  }
});

export default router;
