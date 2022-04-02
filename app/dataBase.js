const {Pool} = require('pg');
const config = {
    connectionString: process.env.PGURL
};

if (process.env.NODE_ENV === "production") {
    config.ssl = {
        rejectUnauthorized: false
    };
}

const pool = new Pool(config);

module.exports = pool;