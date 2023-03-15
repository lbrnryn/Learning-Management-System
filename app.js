const express = require('express');
const { engine } = require('express-handlebars');
require('dotenv').config();
require('./db')();
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
require('./config/passport')(passport);
const cors = require('cors');
const methodOverride = require('method-override');

const app = express();
app.use(express.static('public'));
app.engine('.hbs', engine({ extname: ".hbs" }));
app.set('view engine', '.hbs');
app.set('views', './views');
app.set('json spaces', 2);
app.use(express.json());
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
app.use('/chapters', require('./routes/chapters'));
app.use('/classes', require('./routes/classes'));
// app.use('/quizQuestions', require('./routes/quizQuestions'));
app.use('/questions', require('./routes/questions'));

// API
app.use('/api/users', require('./routes/api/users'));
app.use('/api/classes', require('./routes/api/classes'));
app.use('/api/chapters', require('./routes/api/chapters'));
// app.use('/api/quizQuestions', require('./routes/api/quizQuestions'));
app.use('/api/questions', require('./routes/api/questions'));

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

app.listen(process.env.PORT, () => console.log(`Listening on port: ${process.env.PORT}`));
