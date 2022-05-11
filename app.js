const express = require('express');
const { create } = require('express-handlebars');
require('dotenv').config();
const { mongoosedb } = require('./db');
mongoosedb();
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
require('./config/passport')(passport);
const cors = require('cors');
const methodOverride = require('method-override');
const path = require('path');

const app = express();
const hbs = create({
  extname: '.hbs',
  runtimeOptions: { allowProtoPropertiesByDefault: true }
})
app.use(express.static('public'));
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.set('views', './views');
app.set('json spaces', 2);
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
}));
app.use(flash());
app.use((req, res, next)=> {
  res.locals.error  = req.flash('error');
  res.locals.success = req.flash('success');
next();
})
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({ origin: '*' }));
app.use(methodOverride('_method'));

// Routes
app.use('/', (require('./routes/index')));
app.use('/users', require('./routes/users'));
app.use('/subjects', require('./routes/subjects'));
app.use('/classes', require('./routes/classes'));
app.use('/chapters', require('./routes/chapters'));

// API
app.use('/api/users', require('./routes/api/users'));
app.use('/api/classes', require('./routes/api/classes'));
app.use('/api/chapters', require('./routes/api/chapters'));

// Error handling
// Working when going to route/s does not exist
app.use((req, res, next) => {
  req.flash('error', 'URL does not exists')
  res.redirect('/');
  next()
})
app.use((err, req, res, next) => {
  console.log(err.message)
  res.redirect('/');
  next();
})

const PORT = process.env.PORT || 2000;

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
