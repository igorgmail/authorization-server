const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const authRouter = require('./router/authRouter');
const errorHandler = require('./middleware/errorHandler');
const CustomError = require('./utils/AppError');

require('dotenv').config({ path: `./.env.${process.env.NODE_ENV}` });

const app = express();
const PORT = process.env.PORT || 3100;

// Session
const session = require('express-session');
const FileStore = require('session-file-store')(session);

const dbCheck = require('./db/dbCheck');

dbCheck();

// middlewares
app.use(cors());
app.use(express.static(path.resolve('public')));
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// session config
const sessionConfig = {
  name: process.env.SESSION_NAME,
  store: new FileStore({}),
  secret: process.env.COOKIE_SECRET,
  resave: true,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
  },
  httpOnly: true,
};

// session middleware
app.use(session(sessionConfig));

app.use('/user', authRouter);

app.use('/*', (req, res, next) => {
  next(new CustomError(`can not find ${req.originalUrl}`, 404));
});

app.use(errorHandler);

app.listen(PORT, (err) => {
  if (err) return console.log('Server startup error..', err.message);
  console.log(`--- Start ${process.env.NODE_ENV} mode`);
  return console.log(`The server is running on http://localhost:${PORT} `);
});
