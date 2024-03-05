const pg = require("pg");
const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/acme_icecream_shop_db"
);
const express = require("express");
const app = express();

// parse the body into JS Objects
app.use(express.json());

// Log the requests as they come in
app.use(require("morgan")("dev"));

// Create flavor - C
app.post("/api/flavor", async (req, res, next) => {
  try {
    const SQL = `
      INSERT INTO flavor(name)
      VALUES($1)
      RETURNING *
    `;
    const response = await client.query(SQL, [req.body.name]);
    res.send(response.rows[0]);
  } catch (ex) {
    next(ex);
  }
});

// Read flavor - R
app.get("/api/flavor", async (req, res, next) => {
  try {
    const SQL = `
      SELECT * from flavor ORDER BY created_at DESC;
    `;
    const response = await client.query(SQL);
    res.send(response.rows);
  } catch (ex) {
    next(ex);
  }
});

// Update flavor - U
app.put("/api/flavor/:id", async (req, res, next) => {
  try {
    const SQL = `
      UPDATE flavor
      SET name=$1, updated_at= now()
      WHERE id=$3 RETURNING *
    `;
    const response = await client.query(SQL, [
      req.body.name,
      req.params.id,
    ]);
    res.send(response.rows[0]);
  } catch (ex) {
    next(ex);
  }
});

// Delete flavor - D
app.delete("/api/flavor/:id", async (req, res, next) => {
  try {
    const SQL = `
      DELETE from flavor
      WHERE id = $1
    `;
    const response = await client.query(SQL, [req.params.id]);
    res.sendStatus(204);
  } catch (ex) {
    next(ex);
  }
});

// create and run the express app

const init = async () => {
  await client.connect();
  let SQL = `
    DROP TABLE IF EXISTS flavor;
    CREATE TABLE flavor(
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      is_favorite BOOLEAN NOT NULL,
      created_at TIMESTAMP DEFAULT now(),
      updated_at TIMESTAMP DEFAULT now()
    );
  `;
  await client.query(SQL);
  console.log("tables created");
  SQL = `
  INSERT INTO flavor(name, is_favorite) VALUES
    ('learn express', 'false'),
    ('write SQL queries', 'false'),
    ('create routes', 'false');
`;
  await client.query(SQL);
  console.log("data seeded");
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`listening on port ${port}`));
};

init();
