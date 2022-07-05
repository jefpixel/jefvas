const DJS = require("discord.js")
const Canvas = require('@napi-rs/canvas')
const { token } = require("./config.json")
const { readFile } = require('fs/promises')
const client = new DJS.Client({
  intents: [
        "GUILDS",
        "GUILD_MEMBERS",
        "GUILD_BANS",
        "GUILD_INTEGRATIONS",
        "GUILD_WEBHOOKS",
        "GUILD_INVITES",
        "GUILD_VOICE_STATES",
        "GUILD_PRESENCES",
        "GUILD_MESSAGES",
        "GUILD_MESSAGE_REACTIONS",
        "GUILD_MESSAGE_TYPING",
        "DIRECT_MESSAGES",
        "DIRECT_MESSAGE_REACTIONS",
        "DIRECT_MESSAGE_TYPING",
    ],
})

client.on("ready", async () => {
  console.log("jefvas is ready!")

  const guildId = "993758357859074068"
  const guild = client.guilds.cache.get(guildId)
  let commands

  if (guild) {
    commands = guild.commands
  } else {
    commands = client.applications.commands
  }

  commands.create({
    name: "ping",
    description: "How fast the bot is"
  })

  commands.create({
    name: "plus",
    description: "Collects two numbers",
    options: [
      {
        name: "number_1",
        description: "What the number",
        type: "NUMBER",
        required: true
      },
      {
        name: "number_2",
        description: "What the number",
        type: "NUMBER",
        required: true
      }
      ]
  })

  commands.create({
    name: "profile",
    description: "Shows your profile",
    options: [
      {
        name: "user",
        description: "What the user",
        type: "USER",
        required: false,
      }
      ]
  })
})

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) {
    return
  }

  if (interaction.commandName === "ping") {
    var date = new Date()

    await interaction.reply({
      content: "Loading..."
    })

    await interaction.editReply({
      content: `🏓 Ping: "${Math.round(Date.now() - date)}ms"\n\n🤖 Api Latency: "${Math.round(client.ws.ping)}ms"`
    })
  }

  if (interaction.commandName === "plus") {
    const num1 = interaction.options.getNumber("number_1")
    const num2 = interaction.options.getNumber("number_2")

    let reply = num1 + num2

    await interaction.reply({
      content: `The sum is: ${reply}`
    })
  }

  if (interaction.commandName === "profile") {
    let user = interaction.options.getUser("user")
    if (!user) user = interaction.user

    const canvas = Canvas.createCanvas(700, 250)
    const context = canvas.getContext('2d')
    const backgroundFile = await readFile('./canvas.jpg')
    const background = new Canvas.Image()
    background.src = backgroundFile
    context.drawImage(background, 0, 0, canvas.width, canvas.height)
    const attachment = new DJS.MessageAttachment(canvas.toBuffer('image/png'), 'profile-image.png')

    await interaction.reply({ files: [attachment] })
  }
})

client.login(token)