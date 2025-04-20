const fetch = require("node-fetch");

async function getPlayerStats(name, platform) {
  const apiKey = process.env.PUBG_API_KEY;

  if (!apiKey) {
    console.error("❌ PUBG_API_KEY not found in environment variables.");
    throw new Error("PUBG_API_KEY not found");
  }

  const headers = {
    Authorization: `Bearer ${apiKey}`,
    Accept: "application/vnd.api+json"
  };

  const playerUrl = `https://api.pubg.com/shards/${platform}/players?filter[playerNames]=${name}`;
  console.log(`Fetching player ID for ${name} from: ${playerUrl}`);

  const playerResponse = await fetch(playerUrl, { headers });
  const playerData = await playerResponse.json();

  if (!playerData.data || playerData.data.length === 0) {
    console.error(`❌ Player ${name} not found`);
    throw new Error(`Player ${name} not found`);
  }

  const playerId = playerData.data[0].id;

  const seasonUrl = `https://api.pubg.com/shards/${platform}/players/${playerId}/seasons/lifetime`;
  console.log(`Fetching season stats from: ${seasonUrl}`);

  const seasonResponse = await fetch(seasonUrl, { headers });
  const seasonData = await seasonResponse.json();

  const stats = seasonData.data.attributes.gameModeStats["squad-fpp"];

  return {
    kd: (stats.kills / stats.roundsPlayed).toFixed(2),
    winPct: ((stats.wins / stats.roundsPlayed) * 100).toFixed(1)
  };
}

module.exports = getPlayerStats;
