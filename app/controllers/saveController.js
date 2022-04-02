const debug = require('debug')('controller');
const dataMapper = require('../dataMapper/dataMapper');

const saveController = {
  async buildSave (req, res) {
    try {
      // player object
      const playerJson = await dataMapper.getOneUserJson(req.params.id);
      const player = playerJson.player;
      // generators owned array of objects
      const generatorsOwnedJson = await dataMapper.getGeneratorsOwned(req.params.id);
      const generatorsOwned = generatorsOwnedJson.generators;
      // player owns generator array of objects
      const playerOwnsGeneratorJson = await dataMapper.getPlayerOwnsGenerator(req.params.id);
      const playerOwnsGenerator = playerOwnsGeneratorJson.playerownsgenerator;
      // player not owned generator array of object
      const playerNotOwnsGeneratorJson = await dataMapper.getPlayerNotOwnsGenerator(req.params.id);
      const playerNotOwnsGenerator = playerNotOwnsGeneratorJson.generators;
      // init player bonus
      const playerBonus = {
        clic_flat_bonus: 0,
        clic_percent_bonus: 0,
        idle_flat_bonus: 0,
        idle_percent_bonus: 0,
      }
      // build generatorsOwned + calc bonus
      for (let i = 0; i < generatorsOwned.length; i++) {
        const generatorInfo = playerOwnsGenerator.find(element => element.generator_id === generatorsOwned[i].id);
        // add number owned
        generatorsOwned[i].number_owned = generatorInfo.number_owned;
        // calc next cost
        generatorsOwned[i].next_cost = generatorsOwned[i].starting_cost * Math.pow(generatorsOwned[i].cost_factor, generatorsOwned[i].number_owned);
        // calc total value for each generator
        generatorsOwned[i].total_clic_flat = generatorsOwned[i].clic_flat_value * generatorsOwned[i].number_owned;
        generatorsOwned[i].total_clic_percent = generatorsOwned[i].clic_percent_value * generatorsOwned[i].number_owned;
        generatorsOwned[i].total_idle_flat = generatorsOwned[i].idle_flat_value * generatorsOwned[i].number_owned;
        generatorsOwned[i].total_idle_percent = generatorsOwned[i].idle_flat_value * generatorsOwned[i].number_owned;
        // calc total bonus
        playerBonus.clic_flat_bonus += generatorsOwned[i].total_clic_flat;
        playerBonus.clic_percent_bonus += generatorsOwned[i].total_clic_percent;
        playerBonus.idle_flat_bonus += generatorsOwned[i].total_idle_flat;
        playerBonus.idle_percent_bonus += generatorsOwned[i].total_idle_percent;

      }
      // add generators in player object
      player.generatorsOwned = generatorsOwned;
      // add generators not owned
      player.generatorsNotOwned = playerNotOwnsGenerator;
      // add player bonus to player values

      // TODO

      res.json(player);
    } catch (err) {
      debug(err);
    }
  },
};

module.exports = saveController;