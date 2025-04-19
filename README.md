# Chicken Checker Bot

A Discord bot that announces PUBG KD and Win % when tracked users join a voice channel.

## Setup

1. Copy `.env.example` to `.env` and fill in your secrets.
2. Install dependencies:

```bash
npm install discord.js dotenv node-fetch
```

3. Run the bot:

```bash
node index.js
```

## Secrets

- `DISCORD_TOKEN` – your Discord bot token
- `PUBG_API_KEY` – your PUBG Developer API key
