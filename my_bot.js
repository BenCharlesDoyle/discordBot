//initiate discord API
const Discord = require('discord.js');
const client = new Discord.Client();
//initiate R6Stats API
const R6StatsAPI = require('r6statsapi').default;
const R6Stats = new R6StatsAPI('');
//R6Stats argument list
let statsArray = ["assists", "barricades_deployed", "blind_kills", "bullets_fired", "bullets_hit", "dbnos", "deaths", "distance_travelled",
"draws", "gadgets_destroyed", "games_played", "headshots", "kd", "kills", "losses", "melee_kills", "penetration_kills", "playtime", "rappel_breeches",
"reinforcements_deployed", "revives", "suicides", "wins", "wl"];


client.on('ready', () => {
    console.log("Conneted as " + client.user.tag);

    client.user.setActivity("YouTube", {type: "WATCHING"});
    console.log(statsArray);
    client.guilds.forEach((guild) => {
        console.log(guild.name);
        guild.channels.forEach((channel) => {
            console.log(` -  ${channel.name} ${channel.type} ${channel.id} `);
        });
    });
    let generalChannel = client.channels.get("");
    const attatchment = new Discord.Attachment("https://upload.wikimedia.org/wikipedia/commons/4/45/A_small_cup_of_coffee.JPG");
    generalChannel.send(attatchment);
});

client.on('message', (receivedMessage) => {
    //check if bot sent the message to avoid recursion
    if (receivedMessage.author == client.user) {
        return;
    }

    
    if (!receivedMessage.content.startsWith("!")) {
    receivedMessage.channel.send("Nice message, " + receivedMessage.author.toString()+ "\"" + receivedMessage.content + "\"");
    console.log(receivedMessage.author.id);
    receivedMessage.react("👍");
    }
    
    if (receivedMessage.content.startsWith("!")) {
        processCommand(receivedMessage);
    }
});


function processCommand(receivedMessage) {
    let fullCommand = receivedMessage.content.substr(1);
    let splitCommand = fullCommand.split(" ");
    let primaryCommand = splitCommand[0];
    let comArguments = splitCommand.slice(1);
    console.log(primaryCommand.length);

    if (primaryCommand == "help") {
        helpCommand(comArguments, receivedMessage);
    } else if (primaryCommand == "multiply") {
        multiplyCommand(comArguments, receivedMessage);
    } else if (primaryCommand == "stats") {
        statsCommand(comArguments, receivedMessage);
    } else if (primaryCommand == "statoptions") {
        statOptions(receivedMessage);
    } else {
        receivedMessage.channel.send("I don't know that command");
    }
}

function statOptions(receivedMessage) {
    receivedMessage.channel.send("Options are: " + "\n" +  statsArray.toString().replace(/,/g, "\n"));
}

function statsCommand(comArguments, receivedMessage) {
    if (comArguments.length !== 2 ) {
        receivedMessage.channel.send("Error, must be in specific format: \"!stats Name Option\"");
        return;
    } 

    R6Stats.getGenericStats(`${comArguments[0]}`, `pc`, 'all').then(userStats => {
    let stat = comArguments[1].toLowerCase();
    let statIndex = statsArray.indexOf(stat);
    if (statIndex == -1) {
        receivedMessage.channel.send("Error, bad value. for list of options type \"statOptions\"");
    }
    receivedMessage.channel.send(receivedMessage.author.toString() + " Your " + stat + " is: " + userStats.stats.general[statsArray[statIndex]]);
    })
    .catch(err => {
        receivedMessage.channel.send("Sorry " + receivedMessage.author.toString() + " could not find " + "\"" + comArguments[0] + "\"" + " did you spell it properly?");
    });
}

function multiplyCommand(comArguments, receivedMessage) {
    receivedMessage.channel.send("Your total is " + (parseInt(comArguments[0]) * parseInt(comArguments[1])));

}

function helpCommand(comArguments, receivedMessage) {
    if (comArguments.length == 0) {
        receivedMessage.channel.send("I'm not sure what you need help with. Try `!help [topic]`");
    } else {
        receivedMessage.channel.send("It looks like you need help with " + comArguments);
    }
}

client.login('');
