const { GiveawaysManager } = require("discord-giveaways");
const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require('fs')
client.giv = require('./giveaways.json')
Array.prototype.random = function() {
    return this[Math.floor(Math.random() * this.length)];
}
client.setInterval(() => {

        fs.readFile('giveaways.json', function (err, data) {
            var json = JSON.parse(data)
        const time = json.time
       

        if(Date.now() > time) {
            const channel = client.channels.cache.find(channel => channel.id === json.cId)
            delete client.giv;
            fs.writeFile("./giveaways.json", JSON.stringify({}), err => {
                if(err) throw err;
            });
            fs.readFile('entries.json', function (err, data) {
            const winnerArray = JSON.parse(data).e
            channel.send(`Winner is <@${winnerArray[Math.floor(Math.random() * winnerArray.length)]}>`)
            })
        }
    })
    
}, 5000);
client.entry = require('./entries.json')
client.on("messageReactionAdd", (reaction, user) => {
    if(reaction.emoji.name == "🎉") {
        for(let i in client.giv) {
            let id = client.giv.mId;
            if(user.id === client.user.id) { return;}
            if(reaction.message.id == id) {
                let Users = reaction.message.guild.members.fetch(user);
                const moreEntryRoleId = "757912205957005382"
                //If person who reacts have moreEntryRoleId:
                if (reaction.message.member.roles.cache.find(r => r.id === moreEntryRoleId)) {
                    fs.readFile('entries.json', function (err, data) {
                        var json = JSON.parse(data)
                        //Customize Entries (i put 3 by default)
                        json.e.push(user.id)
                        json.e.push(user.id)
                        json.e.push(user.id)

                        fs.writeFileSync("entries.json", JSON.stringify(json))
                        
                    })
                    // Else:
                } else {
                    fs.readFile('entries.json', function (err, data) {
                        
                        var json = JSON.parse(data)
                        console.log(json)
                        json.e.push(reaction.message.member.id)
                        fs.writeFileSync("entries.json", JSON.stringify(json))
                    })
                    
                }
            
           
        }
                
        }
    
    }

})
client.on("message", async message => {    
    var prefix = "?"    
    const command = message.content.slice(prefix.length).trim().split(' ')[0];
    const args = message.content.slice(prefix.length).trim().split(' ');
    var totalTime;
    if(command == "gstart") {
        // if (!reaction.message.member.roles.cache.find(r => r.id === "")) { }
        // if(!message.author.id == "") { return }
        args.shift()
        let time = args[0]
        args.shift()
        let hd = args[0]
         args.shift()
        let prize = args.join(" ")
        if(hd == "s"|| "sec" || "seconds") {
            
            totalTime = time * 1000
        } else if(hd == "m" || "min" || "minutes") {
            totalTime = time * 1000 * 60
        } else if(hd == "h" || "hrs" || "hours") {
            totalTime = time * (1000*60*60*60) 
        } else if(hd == "d" || "day" || "days") {
            totalTime = time * (1000*60*60*60*24) 
        }
        data = (Date.now() + time * 1000)
        var id;
        const embed = new Discord.MessageEmbed()
                .setTitle(`${prize}`)
                .setColor('36393F')
                .setDescription(`React with 🎉 to enter!\nTime duration: **${time}${hd}** \nHosted by: ${message.author}`)
                .setTimestamp(data)
                .setFooter('Ends at')
                let msg = await message.channel.send(':tada: **GIVEAWAY** :tada:', embed).then(message => {
                    id = message.id
                    client.giv = {
                        "time": totalTime,
                        "mId": message.id,
                        "cId": message.channel.id
                    }
                    fs.writeFile("./giveaways.json", JSON.stringify(client.giv, null, 4), err => {
                        if(err) throw err;
                        
                    });
                    message.react("🎉")
                    fs.writeFile("./entries.json", JSON.stringify({e: []}), err => {
                        if(err) throw err;
                    });
                })
    } else if(command === "reroll") {
         // if (!reaction.message.member.roles.cache.find(r => r.id === "")) { }
        // if(!message.author.id == "") { return }
        fs.readFile('giveaways.json', function (err, data) {
            var json = JSON.parse(data)
        const time = json.time
       

        if(Date.now() > time) {
            const channel = client.channels.cache.find(channel => channel.id === json.cId)
            delete client.giv;
            channel.send("done")
            fs.writeFile("./giveaways.json", JSON.stringify({}), err => {
                if(err) throw err;
            });
            fs.readFile('entries.json', function (err, data) {
            const winnerArray = JSON.parse(data).e
            channel.send(`The new Winner is <@${winnerArray.random()}>`)
            })
        } else {
            message.channel.reply("The giveaway is currently not over, run this command once it is over.").then(msg => {msg.delete({timeout: 5000})})
        }
    })
    }
})    


client.login("");