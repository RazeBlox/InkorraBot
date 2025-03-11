const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
require('dotenv').config();
const express = require('express');
const path = require('path');

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`\x1b[36m[ SERVER ]\x1b[0m Running at: \x1b[32mhttp://localhost:${port} ✅\x1b[0m`);
});

const statusMessages = [
  { name: "Diamonds✨ by Rihanna", type: ActivityType.Listening },
];

const statusTypes = ['online', 'dnd', 'idle'];
let statusIndex = 0;
let typeIndex = 0;

async function login() {
  if (!process.env.TOKEN) {
    console.error('\x1b[31m[ ERROR ]\x1b[0m Missing bot token in environment variables!');
    process.exit(1);
  }

  try {
    await client.login(process.env.TOKEN);
    console.log(`\x1b[36m[ LOGIN ]\x1b[0m Logged in as: \x1b[32m${client.user.tag} ✅\x1b[0m`);
    console.log(`\x1b[36m[ INFO ]\x1b[0m Bot ID: \x1b[35m${client.user.id}\x1b[0m`);
    console.log(`\x1b[36m[ INFO ]\x1b[0m Connected to \x1b[34m${client.guilds.cache.size}\x1b[0m server(s)`);
  } catch (error) {
    console.error('\x1b[31m[ ERROR ]\x1b[0m Failed to log in:', error);
    process.exit(1);
  }
}

function updateStatus() {
  const { name, type } = statusMessages[statusIndex];
  const status = statusTypes[typeIndex];

  client.user.setPresence({
    activities: [{ name, type }],
    status,
  });

  console.log(`\x1b[33m[ STATUS ]\x1b[0m Updated to: ${name} (${status})`);

  statusIndex = (statusIndex + 1) % statusMessages.length;
  typeIndex = (typeIndex + 1) % statusTypes.length;
}

function heartbeat() {
  setInterval(() => {
    console.log(`\x1b[35m[ HEARTBEAT ]\x1b[0m Bot alive at ${new Date().toLocaleTimeString()}`);
  }, 30000);
}

client.once('ready', () => {
  console.log(`\x1b[36m[ INFO ]\x1b[0m Ping: \x1b[34m${client.ws.ping}ms\x1b[0m`);
  updateStatus();
  setInterval(updateStatus, 10000);
  heartbeat();
});

login();
