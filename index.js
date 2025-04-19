const { Client, GatewayIntentBits, Events } = require("discord.js");
const fs = require("fs");
require("dotenv").config();

const getPlayerStats = require("./utils/getPlayerStats");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages
  ]
});

const tracked = require("./members.json");

client.once(Events.ClientReady, () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
  const member = newState.member;
  if (!member || !newState.channel || oldState.channel === newState.channel) return;

  const username = member.displayName;

  if (!tracked[username]) return;

  try {
    const stats = await getPlayerStats(username, tracked[username]);
    const textChannel = newState.guild.channels.cache.find(
      ch => ch.name === newState.channel.name && ch.type === 0 // GUILD_TEXT
    );

    if (textChannel) {
      await textChannel.send(`📊 **${username} PUBG Stats**
KD: ${stats.kd} | Win%: ${stats.winPct}`);
    }
  } catch (err) {
    console.error(`❌ Failed to fetch stats for ${username}`, err);
  }
});

client.login(process.env.DISCORD_TOKEN);
