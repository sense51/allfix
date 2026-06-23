import { Router } from 'express';
import db from '../db/index.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let query = db('services')
      .join('providers', 'services.provider_id', 'providers.id')
      .join('users', 'providers.user_id', 'users.id')
      .select(
        'services.*',
        'users.name as provider_name',
        'users.location',
        'providers.avg_rating'
      );

    if (category) {
      query = query.where('services.category', category);
    }

    const services = await query;
    res.json(services);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

router.get('/my', authenticate, requireRole('provider'), async (req, res) => {
  try {
    const provider = await db('providers').where({ user_id: req.user.id }).first();
    if (!provider) return res.status(404).json({ error: 'Provider not found' });

    const services = await db('services').where({ provider_id: provider.id });
    res.json(services);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch your services' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const service = await db('services')
      .join('providers', 'services.provider_id', 'providers.id')
      .join('users', 'providers.user_id', 'users.id')
      .select(
        'services.*',
        'users.name as provider_name',
        'users.location',
        'users.phone',
        'providers.bio',
        'providers.avg_rating'
      )
      .where('services.id', req.params.id)
      .first();

    if (!service) return res.status(404).json({ error: 'Service not found' });
    res.json(service);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch service' });
  }
});

router.post('/', authenticate, requireRole('provider'), async (req, res) => {
  try {
    const { category, title, description, price, currency, duration_minutes } = req.body;

    if (!['electric', 'motorcycle', 'car', 'cleaning', 'computer', 'phone'].includes(category)) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    const provider = await db('providers').where({ user_id: req.user.id }).first();
    if (!provider) return res.status(404).json({ error: 'Provider profile not found' });

    const [service] = await db('services')
      .insert({
        provider_id: provider.id,
        category,
        title,
        description,
        price: Number(price),
        currency: currency || 'USD',
        duration_minutes: Number(duration_minutes),
      })
      .returning('*');

    res.status(201).json(service);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create service' });
  }
});

router.put('/:id', authenticate, requireRole('provider'), async (req, res) => {
  try {
    const provider = await db('providers').where({ user_id: req.user.id }).first();
    if (!provider) return res.status(404).json({ error: 'Provider profile not found' });

    const serviceId = Number(req.params.id);
    if (isNaN(serviceId)) return res.status(400).json({ error: 'Invalid service ID' });

    const service = await db('services').where({ id: serviceId, provider_id: provider.id }).first();
    if (!service) return res.status(404).json({ error: 'Service not found or not yours' });

    const { category, title, description, price, currency, duration_minutes } = req.body;

    const [updated] = await db('services')
      .where({ id: serviceId })
      .update({
        category,
        title,
        description,
        price: Number(price),
        currency: currency || 'USD',
        duration_minutes: Number(duration_minutes),
      })
      .returning('*');

    res.json(updated);
  } catch (err) {
    console.error('PUT error:', err);
    res.status(500).json({ error: 'Failed to update service' });
  }
});

router.delete('/:id', authenticate, requireRole('provider'), async (req, res) => {
  try {
    const provider = await db('providers').where({ user_id: req.user.id }).first();
    if (!provider) return res.status(404).json({ error: 'Provider profile not found' });

    const serviceId = Number(req.params.id);
    if (isNaN(serviceId)) return res.status(400).json({ error: 'Invalid service ID' });

    const deleted = await db('services')
      .where({ id: serviceId, provider_id: provider.id })
      .del();

    if (!deleted) return res.status(404).json({ error: 'Service not found or not yours' });
    res.json({ message: 'Service deleted' });
  } catch (err) {
    console.error('DELETE error:', err);
    res.status(500).json({ error: 'Failed to delete service: ' + err.message });
  }
});

export default router;
