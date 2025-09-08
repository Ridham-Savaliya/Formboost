import readline from 'readline';
import sequelize from '#database/config.js';
import config from '#config/index.js';
import logger from '#utils/logger.js';

const force = false;
const alter = false;

export const initializeDB = async () => {
  if (force && !config.isProd) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(`💀 Force true ?\n`, (input) => {
      if (input == 'y') {
        sequelize
          .sync({ force: true })
          .then(() => {
            logger.info({
              name: 'DB_SYNC_SUCCESS',
              data: {
                message: 'Tables dropped and recreated successfully.',
              },
            });
          })
          .catch((err) => {
            logger.error({
              name: 'DB_SYNC_ERROR',
              data: {
                message: 'Error while dropping and recreating tables.',
                error: err.message,
              },
            });
          });
      } else {
        logger.info({
          name: 'DB_SYNC_ABORTED',
          data: {
            message: 'Database sync aborted by user.',
          },
        });
        process.exit(0);
      }

      rl.close();
    });
  } else if (alter) {
    sequelize
      .sync({ alter: true })
      .then(() => {
        logger.info({
          name: 'DB_ALTER_SUCCESS',
          data: {
            message: 'Tables altered successfully.',
          },
        });
      })
      .catch((err) => {
        logger.error({
          name: 'DB_ALTER_ERROR',
          data: {
            message: 'Error while altering tables.',
            error: err.message,
          },
        });
      });
  }

  sequelize
    .authenticate()
    .then(() => {
      logger.info(`✔ Database connection established successfully.`);
    })
    .catch((err) => {
      logger.error({
        name: 'DB_CONNECTION_ERROR',
        data: {
          message: 'Unable to connect to the database.',
          error: err.message,
        },
      });
    });
};
