"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const compression = require("compression");
const routes = require("./routes");
const morgan = require("morgan");
const Knex = require("knex");
const objection_1 = require("objection");


var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
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
const postgres_1 = require("./db/postgres");
const knex = Knex(postgres_1.pgsql.development);
/** Bind all Models to a knex instance. If you only have one database in
 *  your server this is all you have to do. For multi database systems, see
 *  the Model.bindKnex method.
 */
objection_1.Model.knex(knex);
const _clientDir = '../angular-express';
exports.app = express();
exports.app
  .use(bodyParser.urlencoded({ extended: false }))
  .use(bodyParser.json())
  .use(bodyParser.text())
  .use(morgan('dev'))
  .use(compression());
if (process.env.NODE_ENV && process.env.NODE_ENV === 'development') {
  exports.app.all('/*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    next();
  });
}
/**
 * Api Routes
 */
routes.init(exports.app);
/**
 * Static
 */
exports.app.use('/', express.static(path.resolve(__dirname, `${_clientDir}/`)));
/**
 * Spa Res Sender
 */
const renderIndex = (req, res) => {
  res.sendFile(path.resolve(__dirname, `${_clientDir}/index.html`));
};
const message = 'hello';
const hello = (req, res) => {
  res.json(message);
};
/**
 * Prevent server routing and use @ng2-router.
 */
exports.app.get('/*', renderIndex);
/**
 * Server with gzip compression.
 */

// setTimeout(() => {
//   client.ping({
//     // ping usually has a 3000ms timeout
//     requestTimeout: 1000
//   }, function (error) {
//     if (error) {
//       console.trace('elasticsearch cluster is down!');
//     } else {
//       console.log('All is well');
//     }
//   });
// }, 1000);




// setTimeout(() => {
//    client.index({
//     index: 'myindex-2',
//     type: 'mytype-2',
//     id: '1',
//     body: {
//       title: 'Test 2',
//       tags: ['a', 'f'],
//       published: true,
//       published_at: '2013-01-02',
//       counter: 1
//     }
//   });
// }, 1000);


// setTimeout(() => {
//   const indices =  client.cat.indices({format: 'json'})
//   console.log('indices:', indices)
//
// }, 1000);

async function getListing(){
  const response = await client.search({
    index: 'myindex-2'
  });
}

setTimeout(() => {
  getListing();

}, 1000);



const server = exports.app.listen(3000);
const serverPort = server.address().port;
console.log(`App is listening on port: ${serverPort}`);
//# sourceMappingURL=app.js.map

