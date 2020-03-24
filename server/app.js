const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')(session);
const indexRouter = require('./routes/index');

const usersRouter = require('./routes/users');
const testAPIRouter = require('./routes/testAPI');
const scrapeRouter = require('./routes/scrape');


const app = express();


///create db call c4me in ur local
mongoose.connect('mongodb://localhost:27017/c4me', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
});
require('./config/passport');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
///newly added
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser('secret'));
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 180 * 60 * 1000 },
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/', usersRouter);
app.use('/', testAPIRouter);
app.use('/', scrapeRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
app.listen(3001, () => console.log('Server running on port 3001'));

module.exports = app;
