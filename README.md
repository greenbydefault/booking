# Booking Platform for Webflow

This simple application provides a dashboard where users can register, log in and create products that can be booked via a small script snippet. The snippet can be embedded in Webflow and displays the product information based on a `data-product` attribute.

## Usage

```bash
npm install
cp .env.example .env   # fill in your Supabase credentials
node src/server.js
```

Open `http://localhost:3000/` and register a user. After logging in, you can create products and copy the embed code shown in the dashboard.

## Configuration

Create a `.env` file with your Supabase credentials:

```env
SUPABASE_URL=your-project-url
SUPABASE_KEY=your-api-key
SESSION_SECRET=any-random-string
```

Your Supabase project should contain two tables:

1. `users` – columns: `id` (uuid, primary key), `username` (text, unique), `password_hash` (text)
2. `products` – columns: `id` (uuid, primary key), `user_id` (uuid ref users.id), `name` (text), `price` (numeric)
