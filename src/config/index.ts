import dotenv from 'dotenv';
dotenv.config();

export default {
  port: process.env.PORT || 3000,
  databaseUrl: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/blog_platform',
  jwtSecret: process.env.JWT_SECRET || 'default_jwt_secret',
  cookieSecret: process.env.COOKIE_SECRET || 'default_cookie_secret',
};
