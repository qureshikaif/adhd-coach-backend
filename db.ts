import { Pool } from "pg";
import "dotenv/config";

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;

const pool = new Pool({
  host: PGHOST,
  database: PGDATABASE,
  user: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
});

const createTable = async (tableName: string, columns: string) => {
  const result = await pool.query(
    `
        SELECT EXISTS (
            SELECT FROM information_schema.tables
            WHERE table_name = $1
        )
    `,
    [tableName]
  );
  const tableExists = result.rows[0].exists;
  if (!tableExists) {
    await pool.query(`CREATE TABLE ${tableName} (${columns})`);
  }
};

createTable(
  "nft",
  "id SERIAL PRIMARY KEY, current_owner TEXT, primary_owner TEXT, title TEXT, image_name TEXT, image_url TEXT, description TEXT, writer TEXT, genre TEXT, characters TEXT, runtime TEXT, on_sale BOOLEAN, price TEXT, expiry TEXT, royalties TEXT, token_id TEXT, collection_address TEXT, image_ipfs_hash TEXT, nft_ipfs_hash TEXT"
);

export { pool };
