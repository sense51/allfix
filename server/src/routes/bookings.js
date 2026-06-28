import { Router } from 'express';
import db from '../db/index.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const user = await db('users').where({ id: req.user.id }).first();

    let bookings;
    if (user.role === 'customer') {
      bookings = await db('bookings')
        .join('services', 'bookings.service_id', 'services.id')
        .join('providers', 'services.provider_id', 'providers.id')
        .join('users', 'providers.user_id', 'users.id')
        .select(
          'bookings.*',
          'services.title',
          'services.category',
          'services.price',
          'services.currency',
          'users.name as provider_name'
        )
        .where('bookings.customer_id', req.user.id)
        .orderBy('bookings.created_at', 'desc');
    } else {
      const provider = await db('providers').where({ user_id: req.user.id }).first();
      if (!provider) return res.status(404).json({ error: 'Provider profile not found' });
      bookings = await db('bookings')
        .join('services', 'bookings.service_id', 'services.id')
        .join('users', 'bookings.customer_id', 'users.id')
        .select(
          'bookings.id',
          'bookings.service_id',
          'bookings.customer_id',
          'bookings.status',
          'bookings.scheduled_at',
          'bookings.notes',
          'bookings.created_at',
          'services.title',
          'services.category',
          'services.price',
          'services.currency',
          'users.name as customer_name'
        )
        .where('services.provider_id', provider.id)
        .orderBy('bookings.created_at', 'desc');
    }

    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const { service_id, scheduled_at, notes } = req.body;

    const user = await db('users').where({ id: req.user.id }).first();
    if (user.role !== 'customer') {
      return res.status(403).json({ error: 'Only customers can book' });
    }

    const service = await db('services').where({ id: service_id }).first();
    if (!service) return res.status(404).json({ error: 'Service not found' });

    if (new Date(scheduled_at) <= new Date()) {
      return res.status(400).json({ error: 'Scheduled time must be in the future' });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // SQLite-safe: insert then re-select by composite key (customer_id + service_id + created_at max)
    await db('bookings').insert({
      service_id,
      customer_id: req.user.id,
      scheduled_at,
      notes,
      otp,
    });

    const booking = await db('bookings')
      .where({ service_id, customer_id: req.user.id })
      .orderBy('created_at', 'desc')
      .first();

    res.status(201).json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

router.patch('/:id/status', authenticate, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['confirmed', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const user = await db('users').where({ id: req.user.id }).first();
    const booking = await db('bookings').where({ id: req.params.id }).first();
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    const allowedTransitions = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['completed', 'cancelled'],
      completed: [],
      cancelled: [],
    };
    if (!allowedTransitions[booking.status]?.includes(status)) {
      return res.status(400).json({ error: `Cannot transition from ${booking.status} to ${status}` });
    }

    if (user.role === 'provider') {
      const provider = await db('providers').where({ user_id: user.id }).first();
      const service = await db('services').where({ id: booking.service_id, provider_id: provider.id }).first();
      if (!service) return res.status(403).json({ error: 'Not your booking' });

      if (status === 'completed') {
        const { otp } = req.body;
        if (!otp) {
          return res.status(400).json({ error: 'OTP is required to mark the booking as completed.' });
        }
        if (otp !== booking.otp) {
          return res.status(400).json({ error: 'Incorrect confirmation OTP code. Please ask the customer for the correct OTP.' });
        }
      }
    } else if (user.role === 'customer') {
      if (status !== 'cancelled') {
        return res.status(403).json({ error: 'Customers can only cancel' });
      }
      if (booking.customer_id !== user.id) {
        return res.status(403).json({ error: 'Not your booking' });
      }
    }

    // SQLite-safe: update then re-select the updated row
    await db('bookings').where({ id: req.params.id }).update({ status });
    const updated = await db('bookings').where({ id: req.params.id }).first();

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update booking' });
  }
});

export default router;
