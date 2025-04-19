client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
  const member = newState.member;
  console.log(`[VOICE] ${member?.user?.username} joined ${newState.channel?.name}`);

  if (!member || !newState.channel || oldState.channel === newState.channel) return;

  const username = member.displayName;

  if (!tracked[username]) return;

  try {
    const stats = await getPlayerStats(username, tracked[username]);

    const textChannel = newState.guild.channels.cache.find(
      ch => ch.name === "chicken-checker" && ch.type === 0
    );

    if (textChannel) {
      await textChannel.send(`📊 **${username} PUBG Stats**
KD: ${stats.kd} | Win%: ${stats.winPct}`);
    } else {
      console.warn("⚠️ chicken-checker text channel not found!");
    }
  } catch (err) {
    console.error(`❌ Failed to fetch stats for ${username}`, err);
  }
});

