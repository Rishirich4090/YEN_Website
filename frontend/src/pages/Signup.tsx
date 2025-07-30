import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../redux/slices/authSlice';
import { RootState } from '../redux/store';

const initialState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  membershipType: 'basic',
  role: 'member',
  address: '',
  dateOfBirth: '',
  avatar: '',
  reason: '',
};
const roleOptions = [
  { value: 'member', label: 'Member' },
  { value: 'admin', label: 'Admin' },
];

const membershipOptions = [
  { value: 'basic', label: 'Basic' },
  { value: 'premium', label: 'Premium' },
  { value: 'lifetime', label: 'Lifetime' },
];

const Signup: React.FC = () => {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const dispatch = useDispatch();
  const loading = useSelector((state: RootState) => state.auth.isLoading);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!form.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) newErrors.email = 'Invalid email';
    if (!form.phone.trim()) newErrors.phone = 'Phone is required';
    if (!/^\+?\d{10,15}$/.test(form.phone)) newErrors.phone = 'Invalid phone number';
    if (!form.password) newErrors.password = 'Password is required';
    if (form.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!form.role || !['member', 'admin'].includes(form.role)) newErrors.role = 'Role is required';
    if (form.address && form.address.length > 500) newErrors.address = 'Address too long';
    if (form.reason && form.reason.length > 2000) newErrors.reason = 'Reason too long';
    if (form.dateOfBirth) {
      const dob = new Date(form.dateOfBirth);
      const now = new Date();
      const minDate = new Date(now.getFullYear() - 18, now.getMonth(), now.getDate());
      if (dob > minDate) newErrors.dateOfBirth = 'You must be at least 18 years old';
    }
    if (form.avatar && !/^https?:\/\/.+\..+/.test(form.avatar)) newErrors.avatar = 'Invalid avatar URL';
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      // Prepare payload to match RegisterData type
      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
        phone: form.phone,
        membershipType: form.membershipType as 'basic' | 'premium' | 'lifetime',
        // role is not in RegisterData, but will be handled in the backend payload mapping
      };
      dispatch(registerUser(payload) as any);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block mb-1">Role *</label>
          <select name="role" value={form.role} onChange={handleChange} className="w-full border rounded px-2 py-1">
            {roleOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {errors.role && <div className="text-red-500 text-sm">{errors.role}</div>}
        </div>
        <div>
          <label className="block mb-1">First Name *</label>
          <input type="text" name="firstName" value={form.firstName} onChange={handleChange} className="w-full border rounded px-2 py-1" />
          {errors.firstName && <div className="text-red-500 text-sm">{errors.firstName}</div>}
        </div>
        <div>
          <label className="block mb-1">Last Name *</label>
          <input type="text" name="lastName" value={form.lastName} onChange={handleChange} className="w-full border rounded px-2 py-1" />
          {errors.lastName && <div className="text-red-500 text-sm">{errors.lastName}</div>}
        </div>
        <div className="md:col-span-2">
          <label className="block mb-1">Email *</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full border rounded px-2 py-1" />
          {errors.email && <div className="text-red-500 text-sm">{errors.email}</div>}
        </div>
        <div className="md:col-span-2">
          <label className="block mb-1">Phone *</label>
          <input type="tel" name="phone" value={form.phone} onChange={handleChange} className="w-full border rounded px-2 py-1" />
          {errors.phone && <div className="text-red-500 text-sm">{errors.phone}</div>}
        </div>
        <div>
          <label className="block mb-1">Password *</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} className="w-full border rounded px-2 py-1" />
          {errors.password && <div className="text-red-500 text-sm">{errors.password}</div>}
        </div>
        <div>
          <label className="block mb-1">Confirm Password *</label>
          <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} className="w-full border rounded px-2 py-1" />
          {errors.confirmPassword && <div className="text-red-500 text-sm">{errors.confirmPassword}</div>}
        </div>
        <div className="md:col-span-2">
          <label className="block mb-1">Membership Type</label>
          <select name="membershipType" value={form.membershipType} onChange={handleChange} className="w-full border rounded px-2 py-1">
            {membershipOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block mb-1">Address</label>
          <input type="text" name="address" value={form.address} onChange={handleChange} className="w-full border rounded px-2 py-1" />
          {errors.address && <div className="text-red-500 text-sm">{errors.address}</div>}
        </div>
        <div>
          <label className="block mb-1">Date of Birth</label>
          <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} className="w-full border rounded px-2 py-1" />
          {errors.dateOfBirth && <div className="text-red-500 text-sm">{errors.dateOfBirth}</div>}
        </div>
        <div>
          <label className="block mb-1">Avatar URL</label>
          <input type="url" name="avatar" value={form.avatar} onChange={handleChange} className="w-full border rounded px-2 py-1" />
          {errors.avatar && <div className="text-red-500 text-sm">{errors.avatar}</div>}
        </div>
        <div className="md:col-span-2">
          <label className="block mb-1">Reason for Joining</label>
          <textarea name="reason" value={form.reason} onChange={handleChange} className="w-full border rounded px-2 py-1" rows={2} />
          {errors.reason && <div className="text-red-500 text-sm">{errors.reason}</div>}
        </div>
      </div>
      <button type="submit" className="mt-6 w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50" disabled={loading}>
        {loading ? 'Registering...' : 'Sign Up'}
      </button>
    </form>
  );
};

export default Signup;
