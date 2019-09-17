import * as http from 'http';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import * as compression from 'compression';
import * as routes from './routes';
import * as morgan from 'morgan';
import * as Knex from 'knex';
import { Model } from 'objection';

const elasticsearch = require('elasticsearch');

const client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});



/** Redis */
// import { Init } from './db/redis';
// Init();

/** MySQL */
// import { mysql } from './db/mysql';
// const knex = Knex(mysql.development);

/** PostgreSQL */
import { pgsql } from './db/postgres';
const knex = Knex(pgsql.development);

/** Bind all Models to a knex instance. If you only have one database in
 *  your server this is all you have to do. For multi database systems, see
 *  the Model.bindKnex method.
 */
Model.knex(knex);

const _clientDir = '../angular-express';

export const app: express.Application = express();



app
  .use(bodyParser.urlencoded({ extended: false }))
  .use(bodyParser.json())
  .use(bodyParser.text())
  .use(morgan('dev'))
  .use(compression());

if (process.env.NODE_ENV && process.env.NODE_ENV === 'development') {

  app.all('/*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    next();
  });
}

/**
 * Api Routes
 */
routes.init(app);

/**
 * Static
 */
app.use('/', express.static(path.resolve(__dirname, `${_clientDir}/`)));

/**
 * Spa Res Sender
 */
const renderIndex = (req: express.Request, res: express.Response) => {

  client.ping({
    // ping usually has a 3000ms timeout
    requestTimeout: 1000
// tslint:disable-next-line:no-any
  }, (error: any) => {
    if (error) {
      console.trace('elasticsearch cluster is down!');
    } else {
      console.log('All is well');
    }
  });

  res.sendFile(path.resolve(__dirname, `${_clientDir}/index.html`));
};

const message = 'hello';

const hello = (req: express.Request, res: express.Response) => {
  res.json(message);
};

/**
 * Prevent server routing and use @ng2-router.
 */
app.get('/*', renderIndex);

setTimeout(() => {
  console.log('timeout completed');
}, 1000);

/**
 * Server with gzip compression.
 */
const server: http.Server  = app.listen(3000);
const serverPort: number = server.address().port;

console.log(`App is listening on port: ${serverPort}`);
