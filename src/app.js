import express from 'express';
import path from 'path';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import fs from 'fs';
import hbs from 'hbs';
import HandlebarsIntl from 'handlebars-intl';
import layouts from 'handlebars-layouts';
import router from './routes/index';

const app = express();
app.disable('x-powered-by');

// view engine setup
hbs.registerHelper(layouts(hbs.handlebars));
HandlebarsIntl.registerWith(hbs.handlebars);
const mainLayout = fs.readFileSync(
  path.join(__dirname, '../views/layouts/main.hbs'),
  'utf-8'
);

hbs.registerPartial('main', mainLayout);
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'hbs');
app.set('view options', {
  layout: false
});
app.engine('html', hbs.__express);

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use('/assets', express.static(path.join(__dirname, '../assets')));
app.use(
  '/assets/lib/jquery',
  express.static(path.join(__dirname, '../node_modules/jquery/dist/'))
);
app.use(
  '/assets/lib/bootstrap',
  express.static(path.join(__dirname, '../node_modules/bootstrap/dist'))
);

// Routes
app.use('/', router);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(err.status || 500).render('error', {
    message: err.message
  });
});

export default app;
