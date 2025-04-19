const fetch = require("node-fetch");
require("dotenv").config();

const headers = {
  Authorization: `Bearer ${process.env.PUBG_API_KEY}`,
  Accept: "application/vnd.api+json"
};

async function getPlayerStats(playerName, platform = "steam") {
  const baseUrl = `https://api.pubg.com/shards/${platform}`;
  const playerRes = await fetch(`${baseUrl}/players?filter[playerNames]=${playerName}`, { headers });
  const playerData = await playerRes.json();

  if (!playerData?.data?.length) throw new Error(`Player ${playerName} not found`);

  const playerId = playerData.data[0].id;

  const seasonRes = await fetch(`${baseUrl}/players/${playerId}/seasons/lifetime`, { headers });
  const seasonData = await seasonRes.json();

  const stats = seasonData?.data?.attributes?.gameModeStats?.squad;

  return {
    kd: (stats.kills / stats.losses).toFixed(2),
    winPct: ((stats.wins / stats.games) * 100).toFixed(1)
  };
}

module.exports = getPlayerStats;
