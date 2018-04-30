'use strict';

const server = require('../lib/server');
const superagent = require('superagent');
const cowsay = require('cowsay');
const faker = require('faker');

beforeAll(() => server.start(3000));
afterAll(() => server.stop());

describe('GET request at cowsay', () => {
  const cowTest = cowsay.say({ text: 'This is a test for cow' });
  const cowHtml = `<!DOCTYPE html><html><head><title>Hello World</title></head><body><h1>cowsay</h1><pre>${cowTest}</pre></body></html>`;

  test('should return cow text test', () => {
    return superagent.get(':3000/cowsay')
      .query({ text: 'This is a test for cow' })
      .then((res) => {
        expect(res.status).toEqual(200);
        expect(res.text).toEqual(cowHtml);
      });
  });
});

describe('GET request at cowsay api', () => {
  const random = faker.random.words();
  test('should return random JSON text', () => {
    return superagent.get(':3000/api/cowsay')
      .query({ text: random })
      .then((res) => {
        expect(res.status).toEqual(200);
        expect(JSON.parse(res.text).text).toEqual(random);
      });
  });
});

describe('POST request at cowsay api', () => {
  test('should return 200 status for successful post', () => {
    return superagent.post(':3000/api/cowsay')
      .send({ text: 'Moo' })
      .then((res) => {
        expect(res.body.text).toEqual('Moo');
        expect(res.status).toEqual(200);
      });
  });
});

describe('GET of invalid path returns 404', () => {
  test('should return 404', () => {
    return superagent.get(':3000/error')
      .query('error')
      .then(() => {})
      .catch((err) => {
        expect(err.status).toEqual(404);
      });
  });
});
