'use strict';

const url = require('url');
const queryString = require('querystring');
const logger = require('./logger');

module.exports = function bodyParser(req) {
  return new Promise((resolve, reject) => {
    req.url = url.parse(req.url);
    req.url.query = queryString.parse(req.url.query);

    if (req.method === 'GET') {
      return resolve(req);
    }

    let message = '';
    req.on('data', (data) => {
      message += data.toString();
    });

    req.on('end', () => {
      try {
        req.body = JSON.parse(message);
        logger.log(logger.INFO, `${req.method} request parsed and sent to server`);
        return resolve(req);
      } catch (err) {
        return reject(err);
      }
    });

    req.on('error', err => reject(err));
    return undefined;
  });
};
