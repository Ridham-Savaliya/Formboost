import dotenv from 'dotenv';
dotenv.config();

const config = {
  isProd: process.env.NODE_ENV === 'production',
  isDev: process.env.NODE_ENV === 'development',
  isStag: process.env.NODE_ENV === 'staging',
  app: {
    name: 'Formboost-BE',
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    webAppUrl: process.env.WEB_APP_URL,
    webAdminUrl: process.env.WEB_ADMIN_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIREIN,
  },
  db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    dialect: 'mysql',
    pool: {
      max: 200,
      min: 0,
      acquire: 100000,
      idle: 10000,
      evict: 10000,
    },
    language: 'en',
    logging: process.env.DB_LOGGING === 'true',
  },
  firebase: {
    type: process.env.FIREBASE_TYPE,
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : null,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    clientId: process.env.FIREBASE_CLIENT_ID,
    authUri: process.env.FIREBASE_AUTH_URI,
    tokenUri: process.env.FIREBASE_TOKEN_URI,
    authProviderCertUrl: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
    clientCertUrl: process.env.FIREBASE_CLIENT_CERT_URL,
    universeDomain: process.env.FIREBASE_UNIVERSE_DOMAIN,
  },
  email: {
    service: process.env.EMAIL_SERVICE,
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true',
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    from: process.env.EMAIL_FROM,
  },
  loki: {
    host: process.env.LOKI_HOST,
    username: process.env.LOKI_USERNAME,
    password: process.env.LOKI_PASSWORD,
  },
  discord: {
    webhookUrl: {
      errorChannel: process.env.DISCORD_ERROR_CHANNEL,
      formCreatedChannel: process.env.DISCORD_FORM_CREATED_CHANNEL,
      newSignUpChannel: process.env.DISCORD_NEW_SIGNUP_CHANNEL,
    },
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
  },
};

export default config;