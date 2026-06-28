import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import db from '../db/index.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const router = Router();

/**
 * In-memory OTP store.
 * NOTE: On Vercel serverless, each invocation may be a cold start with a fresh
 * in-memory store, so OTPs sent in one invocation may not be visible in another.
 * For production reliability, replace with a Redis/DB-backed store.
 */
const otpStore = new Map();

const isProd = process.env.NODE_ENV === 'production';

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, phone, location } = req.body;

    if (!['customer', 'provider'].includes(role)) {
      return res.status(400).json({ error: 'Role must be customer or provider' });
    }

    const existing = await db('users').where({ email }).first();
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const hashed = await bcrypt.hash(password, 10);

    // SQLite does not support .returning() — insert then re-select by email.
    await db('users').insert({ name, email, password: hashed, role, phone, location });
    const user = await db('users')
      .where({ email })
      .select('id', 'name', 'email', 'role', 'phone', 'location')
      .first();

    if (role === 'provider') {
      await db('providers').insert({ user_id: user.id });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await db('users').where({ email }).first();
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password: _, ...safe } = user;
    res.json({ user: safe, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/send-otp', async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    const user = await db('users').where({ phone }).first();
    if (!user) {
      return res.status(404).json({ error: 'No account found with this phone number' });
    }

    const otp = crypto.randomInt(100000, 1000000).toString();
    otpStore.set(phone, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });

    if (!isProd) {
      console.log(`[OTP] ${otp} for ${phone}`);
    }

    res.json({
      message: 'OTP sent to your phone',
      ...(isProd ? {} : { otp }),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

router.post('/verify-otp', async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ error: 'Phone and OTP are required' });
    }

    const record = otpStore.get(phone);
    if (!record) {
      return res.status(400).json({ error: 'No OTP sent to this number' });
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(phone);
      return res.status(400).json({ error: 'OTP expired' });
    }

    if (record.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    otpStore.delete(phone);

    const user = await db('users').where({ phone }).first();
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password: _, ...safe } = user;
    res.json({ user: safe, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'OTP verification failed' });
  }
});

router.post('/google', async (req, res) => {
  try {
    const { credential, role } = req.body;
    if (!credential) {
      return res.status(400).json({ error: 'Google credential is required' });
    }

    let payload;
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } catch (verifyErr) {
      console.error('Google token verification failed:', verifyErr.message);
      return res.status(401).json({
        error: 'Google token verification failed. Make sure the domain is authorized in Google Cloud Console.',
      });
    }

    const { sub: googleId, email, name, picture } = payload;

    let user;
    try {
      user = await db('users').where({ email }).first();

      if (user) {
        await db('users').where({ id: user.id }).update({ google_id: googleId, avatar: picture });
        user = await db('users').where({ id: user.id }).first();
      } else {
        const targetRole = role === 'provider' ? 'provider' : 'customer';
        // SQLite-safe: insert then re-select. Password is empty string for Google users.
        await db('users').insert({
          name,
          email,
          google_id: googleId,
          avatar: picture,
          role: targetRole,
          password: '',
          password_set: false,
        });
        user = await db('users').where({ email }).first();

        if (targetRole === 'provider') {
          await db('providers').insert({ user_id: user.id });
        }
      }
    } catch (dbErr) {
      console.error('Database error during Google auth:', dbErr);
      return res.status(503).json({
        error: `Database error: ${dbErr.message}. Please check that DATABASE_URL is configured and migrations have been run.`,
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password: _, ...safe } = user;
    res.json({ user: safe, token });
  } catch (err) {
    console.error('Unexpected Google auth error:', err);
    res.status(500).json({ error: 'Google authentication failed' });
  }
});

router.get('/me', async (req, res) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token' });
    }

    const decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
    const user = await db('users').where({ id: decoded.id }).first();
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { password: _, ...safe } = user;
    res.json(safe);
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;
