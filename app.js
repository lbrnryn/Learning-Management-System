const express = require('express');
const { engine } = require('express-handlebars');
require('dotenv').config();
const db = require('./db');
db();
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
require('./config/passport')(passport);
const cors = require('cors');
const methodOverride = require('method-override');

const app = express();
app.use(express.static('public'));
app.engine('.hbs', engine({ extname: '.hbs' }));
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
app.use('/api/users', require('./routes/api/users'));

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

const PORT = process.env.PORT || 1000;

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
