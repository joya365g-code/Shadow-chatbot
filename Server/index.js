require("dotenv").config();
const express = require("express");
const path = require("path");
const { loadCommands } = require("../bot/utils/loader");
const config = require("../bot/config.json");

// Load all commands from Scripts/cmds/
const commandsPath = path.join(__dirname, "../Scripts/cmds");
const commands = loadCommands(commandsPath);

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send(`${config.botName} is online 🚀 | Loaded ${commands.size} commands`);
});

app.post("/run", async (req, res) => {
  const { input } = req.body;
  if (!input) return res.status(400).json({ error: "Missing input" });

  const [cmdName, ...args] = input.trim().split(/\s+/);
  const cmd = commands.get(cmdName);
  if (!cmd) return res.status(404).json({ error: "Command not found" });

  try {
    const output = await cmd.run({ args });
    res.json({ ok: true, output });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🌐 Server running on port ${PORT}`));
