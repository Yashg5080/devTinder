const serverless = require('serverless-http');
const app = require('../src/app');

module.exports = { default: serverless(app) }; // ✅ Important!