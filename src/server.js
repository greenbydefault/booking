const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const jsonfile = require('jsonfile');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const USERS_FILE = path.join(__dirname, '..', 'data', 'users.json');
const PRODUCTS_FILE = path.join(__dirname, '..', 'data', 'products.json');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..')));
app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
  })
);

app.get('/', (req, res) => {
  res.redirect('/login.html');
});

function loadUsers() {
  try {
    return jsonfile.readFileSync(USERS_FILE);
  } catch {
    return [];
  }
}

function saveUsers(users) {
  jsonfile.writeFileSync(USERS_FILE, users, { spaces: 2 });
}

function loadProducts() {
  try {
    return jsonfile.readFileSync(PRODUCTS_FILE);
  } catch {
    return [];
  }
}

function saveProducts(products) {
  jsonfile.writeFileSync(PRODUCTS_FILE, products, { spaces: 2 });
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

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  const users = loadUsers();
  if (users.find(u => u.username === username)) {
    return res.status(400).send('User already exists');
  }
  users.push({ username, password });
  saveUsers(users);
  req.session.user = { username };
  res.redirect('/dashboard');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const users = loadUsers();
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).send('Invalid credentials');
  }
  req.session.user = { username };
  res.redirect('/dashboard');
});

app.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login.html');
  });
});

app.post('/products', authRequired, (req, res) => {
  const { name, price } = req.body;
  const products = loadProducts();
  const product = { id: Date.now().toString(), name, price };
  products.push(product);
  saveProducts(products);
  res.redirect('/dashboard');
});

app.get('/product-list', authRequired, (req, res) => {
  const products = loadProducts();
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

app.get('/product/:id', (req, res) => {
  const products = loadProducts();
  const product = products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Not found' });
  res.json(product);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
