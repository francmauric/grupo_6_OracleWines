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
    username: "o4dmow8hwejhnawjydmk", 
    password: "pscale_pw_3s8Ttkoy9JRemmpsD6FRMMbUXtcISrJbN3vtENd11Qh",
    database: "sport_shoes",
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
