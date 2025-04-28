import { Pool } from 'pg';
import config from '../config';

const pool = new Pool({
  connectionString: config.databaseUrl,
});

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
      console.error('Database connection error:', err);
    } else {
      console.log('Database connected successfully');
    }
  });
  
  export default pool;