const fs = require("fs");
const rfs = require("rotating-file-stream");
const path = require("path");

const logDirectory = path.join(__dirname, "../production_logs");
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accesLogStream = rfs.createStream("access.log", {
  interval: "1d", // rotate daily
  path: logDirectory,
});

const development = {
  name: "development",
  asset_path: "./assests",
  session_cookie_key: process.env.SESSION_COOKIE_KEY,
  db: "InstaBook-Development",
  smtp: {
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  },
  google_client_id: process.env.GOOGLE_CLIENT_ID,
  google_client_Secret: process.env.GOOGLE_SECRET_ID,
  google_call_back_URL: "http://localhost:8000/users/auth/google/callback",
  jwt_secret: process.env.JWT_SECRET_KEY,
  morgan: {
    mode: "dev",
    options: { stream: accesLogStream },
  },
};

const production = {
  name: "production",
  asset_path: process.env.INSTABOOK_ASSET_PATH,
  session_cookie_key: process.env.INSTABOOK_SESSION_COOKIE_KEY,
  db: process.env.INSTABOOK_DB,
  smtp: {
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.INSTABOOK_EMAIL,
      pass: process.env.INSTABOOK_EMAIL_PASS,
    },
  },
  google_client_id: process.env.INSTABOOK_GOOGLE_CLIENT_ID,
  google_client_Secret: process.env.INSTABOOK_GOOGLE_SECRET_ID,
  google_call_back_URL: "http://localhost:8000/users/auth/google/callback",
  jwt_secret: process.env.INSTABOOK_JWT_SECRET_KEY,
  morgan: {
    mode: "combined",
    options: { stream: accesLogStream },
  },
};

module.exports = development;
  // eval(process.env.INSTABOOK_ENVIRONMENT) == undefined
  //   ? development
  //   : eval(process.env.INSTABOOK_ENVIRONMENT);
