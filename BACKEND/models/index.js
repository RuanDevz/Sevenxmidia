'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];

const db = {};
let sequelize;

/**
 * ==============================
 * SELEÇÃO SEGURA DE BANCO
 * ==============================
 * - development  -> Postgres local
 * - production   -> POSTGRES_URL (SSL)
 * Nunca mistura os dois
 */
if (env === 'production') {
  if (!process.env.POSTGRES_URL) {
    throw new Error('POSTGRES_URL não definida em produção');
  }

  sequelize = new Sequelize(process.env.POSTGRES_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    pool: {
      max: 1,
      min: 0,
      idle: 3000,
      acquire: 15000
    },
    define: {
      freezeTableName: true,
      timestamps: true
    }
  });
} else {
  /**
   * DEVELOPMENT / LOCAL
   */
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
      host: config.host,
      port: config.port || 5432,
      dialect: 'postgres',
      logging: console.log,
      define: {
        freezeTableName: true,
        timestamps: true
      }
    }
  );
}

/**
 * ==============================
 * CARREGAMENTO DOS MODELS
 * ==============================
 */
fs.readdirSync(__dirname)
  .filter(file =>
    file.indexOf('.') !== 0 &&
    file !== basename &&
    file.endsWith('.js') &&
    !file.endsWith('.test.js')
  )
  .forEach(file => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

/**
 * ==============================
 * ASSOCIAÇÕES
 * ==============================
 */
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

/**
 * ==============================
 * FUNÇÃO SEGURA DE SYNC
 * ==============================
 * - NÃO recria tabelas em produção
 * - Pode ser forçado localmente
 */
db.syncDatabase = async (options = {}) => {
  const isProd = env === 'production';

  const syncOptions = {
    force: false,
    alter: false,
    ...options
  };

  if (isProd && syncOptions.force) {
    throw new Error('❌ sync({ force: true }) BLOQUEADO em produção');
  }

  await sequelize.authenticate();
  console.log(`🟢 Conectado ao banco: ${sequelize.config.database}`);

  await sequelize.sync(syncOptions);
  console.log('✅ Tabelas sincronizadas com sucesso');
};

module.exports = db;
