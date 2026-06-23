import { Router } from 'express';
import db from '../db/index.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// GET /api/reviews/provider — all reviews for the authenticated provider's services
router.get('/provider', authenticate, async (req, res) => {
  try {
    const provider = await db('providers').where({ user_id: req.user.id }).first();
    if (!provider) return res.status(404).json({ error: 'Provider profile not found' });

    const reviewRows = await db('reviews')
      .join('bookings', 'reviews.booking_id', 'bookings.id')
      .join('services', 'bookings.service_id', 'services.id')
      .join('users as customers', 'bookings.customer_id', 'customers.id')
      .where('services.provider_id', provider.id)
      .select(
        'reviews.id',
        'reviews.booking_id',
        'reviews.rating',
        'reviews.comment',
        'reviews.created_at',
        'customers.name as customer_name',
        'services.title as service_title',
        'services.category as service_category'
      )
      .orderBy('reviews.created_at', 'desc');

    res.json(reviewRows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch provider reviews' });
  }
});

// GET /api/reviews/booking/:bookingId — fetch existing review for a booking (customer)
router.get('/booking/:bookingId', authenticate, async (req, res) => {
  try {
    const bookingId = Number(req.params.bookingId);
    if (isNaN(bookingId)) return res.status(400).json({ error: 'Invalid booking ID' });

    // Make sure the booking belongs to this customer
    const booking = await db('bookings').where({ id: bookingId, customer_id: req.user.id }).first();
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    const review = await db('reviews').where({ booking_id: bookingId }).first();
    res.json(review || null);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch review' });
  }
});

// POST /api/reviews — submit a new review (customer only, completed booking)
router.post('/', authenticate, async (req, res) => {
  try {
    const { booking_id, rating, comment } = req.body;

    if (!booking_id || !rating) {
      return res.status(400).json({ error: 'booking_id and rating are required' });
    }

    const ratingNum = Number(rating);
    if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ error: 'Rating must be an integer between 1 and 5' });
    }

    // Verify the booking belongs to this customer and is completed
    const booking = await db('bookings')
      .where({ id: booking_id, customer_id: req.user.id })
      .first();

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.status !== 'completed') {
      return res.status(400).json({ error: 'Can only review completed bookings' });
    }

    // Check if a review already exists for this booking
    const existing = await db('reviews').where({ booking_id }).first();
    if (existing) {
      return res.status(409).json({ error: 'You have already reviewed this booking' });
    }

    const [review] = await db('reviews')
      .insert({ booking_id, rating: ratingNum, comment: comment || null })
      .returning('*');

    // Recalculate and update provider's avg_rating
    const service = await db('services').where({ id: booking.service_id }).first();
    if (service) {
      const providerReviews = await db('reviews')
        .join('bookings', 'reviews.booking_id', 'bookings.id')
        .join('services', 'bookings.service_id', 'services.id')
        .where('services.provider_id', service.provider_id)
        .avg('reviews.rating as avg');

      const newAvg = providerReviews[0]?.avg ?? 0;
      await db('providers')
        .where({ id: service.provider_id })
        .update({ avg_rating: parseFloat(Number(newAvg).toFixed(2)) });
    }

    res.status(201).json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit review' });
  }
});

export default router;
