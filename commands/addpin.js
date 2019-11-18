module.exports = {
  description: "Add a pintrigger so big milestones gets pinned in chat. Keep in mind this will only accept 50 pins de to Discord's limit.",
  usage: {
    "<mode: each|only>": "If you use each, it will pin every <count> count. If you use only, it will only pin count <count>.",
    "<count>": "The count you want to reference in your mode.",
    "<action: keep|repost>": "If you use keep, the message will be pinned as-is. If you use repost, it will repost the message and then pin it. We recommend reposting."
  },
  examples: {
    "each 1000 repost": "Will pin every 1000th count after reposting it, including 2000 and 3000 etc.",
    "only 420 keep": "Will pin the count 1337 as-is."
  },
  aliases: [],
  permissionRequired: 2,
  checkArgs: (args) => {
    return args.length >= 3;
  }
}

const modes = [ "each", "only" ], actions = [ "keep", "repost" ], { generateID } = require("../database.js")

module.exports.run = async function(client, message, args, config, gdb, { prefix }) {
  let mode = args[0].toLowerCase();
  if (!modes.includes(mode)) return message.channel.send("❌ Invalid mode argument. For help, type `" + prefix + "help addpin`")

  let count = parseInt(args[1]);
  if (!count) return message.channel.send("❌ Invalid count argument. For help, type `" + prefix + "help addpin`")

  let action = args[2].toLowerCase()
  if (!actions.includes(action)) return message.channel.send("❌ Invalid action argument. For help, type `" + prefix + "help addpin`")

  let { pins: alreadyGeneratedPins } = await gdb.get(), id = generateID(Object.keys(alreadyGeneratedPins))
  gdb.setPin(id, mode, count, action)
    .then(() => message.channel.send("✅ Pin trigger with ID `" + id + "` now saved."))
    .catch(e => console.log(e) && message.channel.send("🆘 An unknown database error occoured. Please try again, or contact support."))
}