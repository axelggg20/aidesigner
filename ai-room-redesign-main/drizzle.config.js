import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './config/schema.js',
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://neondb_owner:npg_nRBj3EekKry4@ep-fragrant-bonus-a4amfk91-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
  },
});
