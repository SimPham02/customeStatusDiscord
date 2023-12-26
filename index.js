const Discord = require('discord.js-selfbot-v13');
const client = new Discord.Client({
  readyStatus: false,
  checkUpdate: false
});

function formatTime() {
    const date = new Date();
    const options = {
      timeZone: 'Asia/Ho_Chi_Minh',
      hour12: true, 
      hour: 'numeric',
      minute: 'numeric'
    };
    return new Intl.DateTimeFormat('en-US', options).format(date); 
  }

client.on('ready', async () => {
  console.clear();
  console.log(`${client.user.tag} - rich presence started!`);

  const r = new Discord.RichPresence()
    .setApplicationId('') // id bot
    .setType('STREAMING')
    .setURL('https://www.youtube.com') //Must be a youtube video link 
    .setState('') // play in ....
    .setName('') // name
    .setDetails(`sleep [${formatTime()}]`)
    .setStartTimestamp(Date.now())
    .setAssetsLargeImage('') //You can put links in tenor or discord and etc.
    .setAssetsLargeText('') //Text when you hover the Large image
    .setAssetsSmallImage('') //You can put links in tenor or discord and etc.
    .setAssetsSmallText('') //Text when you hover the Small image
    .addButton('name', 'link')
    .addButton('', '');

  client.user.setActivity(r);
  client.user.setPresence({ status: "dnd" }); //dnd, online, idle, offline

  let prevTime = null;
  setInterval(() => {
    const newTime = formatTime();
    if (newTime !== prevTime) {
      const newDetails = `sleep [${newTime}]`;
      r.setDetails(newDetails);
      client.user.setActivity(r);
      prevTime = newTime;
    }
  }, 1000); // Update every second
});

client.login("");