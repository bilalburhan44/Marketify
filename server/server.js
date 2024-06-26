const express = require('express');
const app = express();
const cors = require('cors');
const session = require('express-session');
const passport = require('./routes/passport'); // Import Passport configuration
const jwt = require('jsonwebtoken');
const http = require('http')

app.use(express.json());
require('dotenv').config();
const dbconfig = require('./config/dbconfig');
const port = process.env.PORT || 5000; // Make sure it's `PORT`, not `port`

const server = http.createServer(app)
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
}
})
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 'https://marketify-qcnh.onrender.com' : 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true,
}));

app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 24 * 2 // 2 days
  }
}));


app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    console.log('Inside Google Callback');
    if (req.user) {
      console.log('User authenticated:', req.user);
      const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, { expiresIn: '2d' });
      req.session.token = token;
      const redirectUrl = process.env.NODE_ENV === 'production' ? 'https://marketify-qcnh.onrender.com/login' : 'http://localhost:3000/login';
      res.redirect(`${redirectUrl}?token=${token}`);
    } else {
      console.error('User not authenticated');
      res.status(401).json({ error: 'User not authenticated' });
    }
  }
);



app.get('/get-token', (req, res) => {
  const token = req.session.token;
  if (token) {
    res.json({ token });
  } else {
    res.status(401).json({ error: 'No token found' });
  }
});

const usersRoutes = require('./routes/usersRoute');
const productsRoutes = require('./routes/productsRoutes');
const bidRoutes = require('./routes/bidRoutes');
const notificationRoutes = require('./routes/notificationRoutes');


app.use('/api/users', usersRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/bids', bidRoutes);
app.use('/api/notifications', notificationRoutes);

// Deployment config
const path = require("path");
_dirname = path.resolve();
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(_dirname, "/client/build")));
    app.get("*", (req, res) => {
        res.sendFile(path.join(_dirname, "client", "build", "index.html"));
    });
}

app.listen(port, () => {
    console.log(`Node/express server started listening on port ${port}`);
});
