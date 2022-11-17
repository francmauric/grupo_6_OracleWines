module.exports = {
  development: {
    username: "root",
    password: null,
    database: "oracle_wines",
    host: "127.0.0.1",
    dialect: "mysql",
    ssl: { rejectUnauthorized: true },
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql",
    ssl: { rejectUnauthorized: true },
  },
  production: { /* agrega la config de planet scale (user, pass y database) */
    username: "ie8by5iktvowamgb3f7c", 
    password: "pscale_pw_5KA6pTwX9u4kppLKfqiGdWPrOVJkDDzaz8pQ8j1pvGI",
    database: "structure",
    host: "us-east.connect.psdb.cloud",
    dialect: "mysql",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
