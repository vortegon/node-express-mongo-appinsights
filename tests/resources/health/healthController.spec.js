const request = require('supertest');
const app = require('../../../src/app.js').default;

jest.mock('../../../src/utils/logger');

describe('Health Controller', () => {
  describe('Healthy', () => {
    test('Given a healthy service when I get the health status then it should return 200 ok', async () => {
      const response = await request(app).get('/');
      expect(response.text).toEqual('Healthy');
      expect(response.statusCode).toBe(200);
    });
  });
});
