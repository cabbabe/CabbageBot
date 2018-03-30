const Discord = require("discord.js");
const YTDL = require("ytdl-core");

const TOKEN = "NDI5MDY2OTEyNTA5NzIyNjI0.DZ8l2Q.We6jbelAHeAvTLh8uw_C21j80qw";
const PREFIX = "!c";

function play(connection, message) {
    var server = servers[message.guild.id];

    server.dispatcher = connection.playStream(YTDL(server.queue[0], {filter: "audioonly"}));

    server.queue.shift();

    server.dispatcher.on("end", function(){
        if(server.queue[0]) play(connection, message);
        else connection.disconnect();
    });
}

var fortunes = [
    "Yes",
    "No",
    "Maybe",
    "It is likely"
]

var bot = new Discord.Client();

var servers = {};

bot.on("ready", function() {
    console.log("Hehe, im live/ready!");
});

bot.on("message", function(message) {
    if (message.author.equals(bot.user)) return;

    if(!message.content.startsWith(PREFIX)) return;

    var args = message.content.substring(PREFIX.length).split(" ");

    switch (args[0].toLowerCase()) {
        case "ping":
            message.channel.sendMessage("Pong!");
            break;
        case "info":
            message.channel.sendMessage("Commands: !c info: Lists all the commands and info. ping: Pong!")
            break;
        case "8ball":
            if(args[1]){
                message.channel.sendMessage(fortunes[Math.floor(Math.random() * fortunes.length)]);
            }else{
                message.channel.sendMessage("Can't read that.")
            }
            break;
        case "play":
            if(!args[1]) {
                message.channel.sendMessage("Please provide a link..");
                return;
            }

            if(!message.member.voiceChannel) {
                message.channel.sendMessage("Get in a voice channel if your gonna use music dumbass");
                return;
            }
            if(!servers[message.guild.id]) servers[message.guild.id] = {
                queue: []
            }

            var server = servers[message.guild.id]

            server.queue.push(args[1]);

            if(!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {
                play(connection, message);
            });
            break;
        case "skip":
            var server = servers[message.guild.id];

            if (server.dispatcher) server.dispatcher.end();
            break;
        case "stop":
            var server = servers[message.guild.id];

            if (messgae.guild.voiceConnection) message.guild.voiceConnection.disconnect();
            break;
        default:
            message.channel.sendMessage("Invalid command");
    }
});

bot.login(process.env.TOKEN);
