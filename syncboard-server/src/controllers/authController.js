import * as authService from '../services/authService.js';
import { registerSchema, loginSchema } from '../validations/authValidation.js';

export const register = async (req, res) => {
  try {
    const parsed = registerSchema.parse(req.body);
    const user = await authService.register(parsed);
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ success: false, errors: err.errors });
    }
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const parsed = loginSchema.parse(req.body);
    const result = await authService.login(parsed);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ success: false, errors: err.errors });
    }
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};