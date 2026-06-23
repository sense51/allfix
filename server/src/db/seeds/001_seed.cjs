const bcrypt = require('bcryptjs');

exports.seed = async function (knex) {
  await knex('reviews').del();
  await knex('bookings').del();
  await knex('services').del();
  await knex('providers').del();
  await knex('users').del();

  const hash = await bcrypt.hash('password123', 10);

  await knex('users').insert([
    {
      id: 1,
      name: 'John Electrician',
      email: 'john@example.com',
      password: hash,
      role: 'provider',
      phone: '555-0101',
      location: 'Downtown',
    },
    {
      id: 2,
      name: 'Jane Mechanic',
      email: 'jane@example.com',
      password: hash,
      role: 'provider',
      phone: '555-0102',
      location: 'Uptown',
    },
    {
      id: 3,
      name: 'Emily Cleaner',
      email: 'emily@example.com',
      password: hash,
      role: 'provider',
      phone: '555-0104',
      location: 'Westside',
    },
    {
      id: 4,
      name: 'Bob Customer',
      email: 'bob@example.com',
      password: hash,
      role: 'customer',
      phone: '555-0103',
      location: 'Midtown',
    },
    {
      id: 5,
      name: 'Alex Tech',
      email: 'alex@example.com',
      password: hash,
      role: 'provider',
      phone: '555-0105',
      location: 'Tech District',
    },
  ]);

  await knex('providers').insert([
    { id: 1, user_id: 1, bio: 'Expert electrician with 10 years experience', avg_rating: 4.5 },
    { id: 2, user_id: 2, bio: 'Professional motorcycle and car mechanic', avg_rating: 4.8 },
    { id: 3, user_id: 3, bio: 'Thorough home cleaning services at affordable rates', avg_rating: 4.9 },
    { id: 4, user_id: 5, bio: 'Certified tech specialist — computers & phones repaired fast', avg_rating: 4.7 },
  ]);

  await knex('services').insert([
    {
      provider_id: 1,
      category: 'electric',
      title: 'Electrical Wiring Repair',
      description: 'Fix faulty wiring, outlets, and switches in your home.',
      price: 80.0,
      currency: 'USD',
      duration_minutes: 60,
    },
    {
      provider_id: 1,
      category: 'electric',
      title: 'Ceiling Fan Installation',
      description: 'Install new ceiling fans or replace existing ones.',
      price: 120.0,
      currency: 'USD',
      duration_minutes: 90,
    },
    {
      provider_id: 2,
      category: 'motorcycle',
      title: 'Motorcycle Oil Change',
      description: 'Full oil change service for all motorcycle makes.',
      price: 50.0,
      currency: 'USD',
      duration_minutes: 45,
    },
    {
      provider_id: 2,
      category: 'car',
      title: 'Car Brake Pad Replacement',
      description: 'Replace front and rear brake pads.',
      price: 150.0,
      currency: 'USD',
      duration_minutes: 120,
    },
    {
      provider_id: 2,
      category: 'car',
      title: 'Engine Diagnostic',
      description: 'Complete engine diagnostic check using professional tools.',
      price: 90.0,
      currency: 'USD',
      duration_minutes: 60,
    },
    {
      provider_id: 3,
      category: 'cleaning',
      title: 'Deep Home Clean',
      description: 'Full home deep cleaning including all rooms, windows, and baseboards.',
      price: 130.0,
      currency: 'USD',
      duration_minutes: 180,
    },
    {
      provider_id: 3,
      category: 'cleaning',
      title: 'Kitchen & Bathroom Scrub',
      description: 'Intensive cleaning of kitchen counters, appliances, sinks, and bathrooms.',
      price: 85.0,
      currency: 'USD',
      duration_minutes: 120,
    },
    {
      provider_id: 3,
      category: 'cleaning',
      title: 'Move-Out Cleaning',
      description: 'Complete cleaning service for tenants moving out of a property.',
      price: 200.0,
      currency: 'USD',
      duration_minutes: 240,
    },
    {
      provider_id: 4,
      category: 'computer',
      title: 'Laptop Screen Replacement',
      description: 'Professional laptop screen replacement for all makes and models.',
      price: 120.0,
      currency: 'USD',
      duration_minutes: 90,
    },
    {
      provider_id: 4,
      category: 'computer',
      title: 'Virus & Malware Removal',
      description: 'Deep scan, remove viruses, malware and spyware. Speed up your PC.',
      price: 65.0,
      currency: 'USD',
      duration_minutes: 60,
    },
    {
      provider_id: 4,
      category: 'phone',
      title: 'Phone Screen Repair',
      description: 'Cracked screen replacement for iPhone and Android devices.',
      price: 80.0,
      currency: 'USD',
      duration_minutes: 45,
    },
    {
      provider_id: 4,
      category: 'phone',
      title: 'Battery Replacement',
      description: 'Original-grade battery replacement to restore full battery life.',
      price: 45.0,
      currency: 'USD',
      duration_minutes: 30,
    },
  ]);
};
