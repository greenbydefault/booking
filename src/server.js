require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..')));
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev-secret',
    resave: false,
    saveUninitialized: false,
  })
);

app.get('/', (req, res) => {
  res.redirect('/login.html');
});

async function getUserByUsername(username) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single();
  if (error) return null;
  return data;
}

async function createUser(username, passwordHash) {
  const { error, data } = await supabase
    .from('users')
    .insert({ username, password_hash: passwordHash })
    .select()
    .single();
  if (error) throw error;
  return data;
}

async function createProduct(userId, name, price) {
  const { error, data } = await supabase
    .from('products')
    .insert({ user_id: userId, name, price })
    .select()
    .single();
  if (error) throw error;
  return data;
}

async function getProductsForUser(userId) {
  const { data, error } = await supabase
    .from('products')
    .select('id,name,price')
    .eq('user_id', userId);
  if (error) return [];
  return data;
}

async function getProductById(id) {
  const { data, error } = await supabase
    .from('products')
    .select('id,name,price')
    .eq('id', id)
    .single();
  if (error) return null;
  return data;
}

function authRequired(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login.html');
  }
  next();
}

app.get('/dashboard', authRequired, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dashboard.html'));
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const existing = await getUserByUsername(username);
  if (existing) {
    return res.status(400).send('User already exists');
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await createUser(username, passwordHash);
  req.session.user = { id: user.id, username };
  res.redirect('/dashboard');
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await getUserByUsername(username);
  if (!user) {
    return res.status(401).send('Invalid credentials');
  }
  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) {
    return res.status(401).send('Invalid credentials');
  }
  req.session.user = { id: user.id, username };
  res.redirect('/dashboard');
});

app.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login.html');
  });
});

app.post('/products', authRequired, async (req, res) => {
  const { name, price } = req.body;
  try {
    await createProduct(req.session.user.id, name, price);
    res.redirect('/dashboard');
  } catch (e) {
    res.status(500).send('Error creating product');
  }
});

app.get('/product-list', authRequired, async (req, res) => {
  const products = await getProductsForUser(req.session.user.id);
  res.json(products);
});

app.get('/template.js', (req, res) => {
  res.type('text/javascript');
  res.send(`
(function(){
  const productId = document.currentScript.dataset.product;
  fetch('/product/' + productId)
    .then(res => res.json())
    .then(product => {
      document.querySelectorAll('[data-booking-product]')
        .forEach(el => el.textContent = product.name + ' - ' + product.price + '€');
    });
})();
  `);
});

app.get('/product/:id', async (req, res) => {
  const product = await getProductById(req.params.id);
  if (!product) return res.status(404).json({ error: 'Not found' });
  res.json(product);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
