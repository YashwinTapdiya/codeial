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
};

const production = {
  name: "production",
};

module.exports = development;
