const debug = require('debug')('dataMapper');
const client = require('../dataBase');

const dataMapper = {
  async getOneUserJson (id) {
    try {
      const query = {
        text: `select row_to_json(player.*) as player from player where id=$1;`,
        values: [id],
      };
      const player = (await client.query(query)).rows[0];
      return player;
    } catch (err) {
      debug(err);
    }
  },
  async getGeneratorsOwned (id) {
    try {
      const query = {
        text: `SELECT  json_agg(generator.*) as generators
        FROM player_owns_generator
        JOIN player ON player_owns_generator.player_id=player.id
        JOIN generator ON player_owns_generator.generator_id=generator.id
        WHERE player_owns_generator.player_id=$1
        GROUP BY player;`,
        values: [id],
      };
      const generatorsOwned = (await client.query(query)).rows[0];
      return generatorsOwned;
    } catch (err) {
      debug(err);
    }
  },
  async getPlayerOwnsGenerator (id) {
    try {
      const query = {
        text: `SELECT json_agg(player_owns_generator.*) as playerOwnsGenerator 
        FROM player_owns_generator WHERE player_id=$1;`,
        values: [id],
      };
      const playerOwnsGenerator = (await client.query(query)).rows[0];
      return playerOwnsGenerator;
    } catch (err) {
      debug(err);
    }
  },
  async getPlayerNotOwnsGenerator (id) {
    try {
      const query = {
        text: `SELECT json_agg(generator.*) as generators
        FROM generator WHERE generator.id NOT IN (
        SELECT player_owns_generator.generator_id FROM player_owns_generator
        WHERE player_owns_generator.player_id=$1);`,
        values: [id],
      };
      const playerNotOwnsGenerator = (await client.query(query)).rows[0];
      return playerNotOwnsGenerator;
    } catch (err) {
      debug(err);
    }
  }
};

module.exports = dataMapper;