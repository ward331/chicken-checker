const { Client, GatewayIntentBits, Events } = require("discord.js");
const fs = require("fs");
require("dotenv").config();

const getPlayerStats = require("./utils/getPlayerStats");
const tracked = require("./members.json");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages
  ]
});

client.once(Events.ClientReady, () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
  const member = newState.member;
  if (!member || !newState.channel || oldState.channel === newState.channel) return;

  const username = member.displayName;

  console.log(`[VOICE] ${username} joined ${newState.channel.name}`);

  if (!tracked[username]) {
    console.log(`[SKIP] ${username} not in tracked list`);
    return;
  }

  try {
    const stats = await getPlayerStats(username, tracked[username]);

    const textChannel = newState.guild.channels.cache.find(
      ch => ch.name === "chicken-checker" && ch.type === 0 // GUILD_TEXT
    );

    if (textChannel) {
      await textChannel.send(`📊 **${username} PUBG Stats**
KD: ${stats.kd} | Win%: ${stats.winPct}`);
    } else {
      console.warn("❌ Could not find #chicken-checker channel");
    }
  } catch (err) {
    console.error(`❌ Failed to fetch stats for ${username}`, err);
  }
});

client.login(process.env.DISCORD_TOKEN);
