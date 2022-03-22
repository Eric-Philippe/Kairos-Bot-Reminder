const Discord = require("discord.js");

const { ClientOptions } = require("./clientOption");

/**
 * Export of the client object, usable everywhere
 */
module.exports.client = new Discord.Client(ClientOptions);
