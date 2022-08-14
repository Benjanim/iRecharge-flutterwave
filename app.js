const express = require('express');
const Controller = require('./Controllers')

const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({
    status: true,
  });
});

app.post('/api/v1/charge', Controller.ChargeCard);

app.use('*', (req, res) => res.status(404).json({ status: false, message: 'Route not found', data: {} }));

module.exports = app;
