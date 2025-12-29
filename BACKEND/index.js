const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://localhost:3000',
  credentials: true,
}));

app.use(express.json());

const webhookRouter = require('./routes/webhook');
const authRouter = require('./routes/auth');
const payRouter = require('./routes/payment');
const StripePortal = require('./routes/stripeportal');

app.use('/webhook', webhookRouter);
app.use('/auth', authRouter);
app.use('/pay', payRouter);
app.use('/stripe-portal', StripePortal);

// PostgreSQL (via Pool)
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

app.set('trust proxy', true); //
pool.connect((err, client, done) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conexão bem-sucedida ao banco de dados');
  done();
});

// Sequelize
const db = require('./models');
async function startServer() {
  try {
    await db.sequelize.authenticate();
    console.log('Conectado ao banco');
    console.log('NODE_ENV:', process.env.NODE_ENV);

if (process.env.NODE_ENV === 'development') {
  await db.sequelize.sync();
  console.log('Tabelas sincronizadas (sem recriar)');
}

    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });

  } catch (err) {
    console.error('Erro ao conectar ao banco:', err);
  }
}

startServer();
