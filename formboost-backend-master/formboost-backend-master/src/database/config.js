import { Sequelize } from 'sequelize';
import config from '#config/index.js';

const sequelize = new Sequelize(config.db.database, config.db.username, config.db.password, {
  host: config.db.host,
  port: Number(config.db.port),
  dialect: config.db.dialect,
  pool: {
    max: config.db.pool.max,
    min: config.db.pool.min,
    acquire: config.db.pool.acquire,
    idle: config.db.pool.idle,
    evict: config.db.pool.evict,
  },
  logging: config.db.logging ? console.log : false,
});

export default sequelize;
