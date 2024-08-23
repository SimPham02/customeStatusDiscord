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

const largeImageMessageUrl = 'https://discord.com/channels/1132649645655461888/1177698786278117487/1233956279689416744';
const smallImageMessageUrl = 'https://discord.com/channels/1132649645655461888/1132649646125219912/1225292740464480327';
  
client.on('ready', async () => {
  console.clear();
  console.log(`${client.user.tag} - login successful`);
  
  const r = new Discord.RichPresence()
    .setApplicationId('1102290365937090721')
    .setType('STREAMING')
    .setURL('') //link tw or ytb
    .setState('')
    .setName('')
    .setDetails(`sleep [${formatTime()}]`)
    .setStartTimestamp(Date.now())
    .setAssetsLargeText('')
    .setAssetsSmallText('')
    .addButton("", "")
  
  async function updateImages() {
    try {
      const [largeImageGuildId, largeImageChannelId, largeImageMessageId] = largeImageMessageUrl.split('/').slice(-3);
      const largeImageChannel = await client.channels.fetch(largeImageChannelId);
      const largeImageMessage = await largeImageChannel.messages.fetch(largeImageMessageId);
      if (largeImageMessage.attachments.size > 0) {
        const largeImageAttachment = largeImageMessage.attachments.first();
        const largeImageURL = largeImageAttachment.url;
        r.setAssetsLargeImage(largeImageURL);
      } else {
        console.log("No attachments found in the specified message for the large image.");
      }
      const [smallImageGuildId, smallImageChannelId, smallImageMessageId] = smallImageMessageUrl.split('/').slice(-3);
      const smallImageChannel = await client.channels.fetch(smallImageChannelId);
      const smallImageMessage = await smallImageChannel.messages.fetch(smallImageMessageId);
        
      if (smallImageMessage.attachments.size > 0) {
        const smallImageAttachment = smallImageMessage.attachments.first();
        const smallImageURL = smallImageAttachment.url;
        r.setAssetsSmallImage(smallImageURL);
      } else {
        console.log("No attachments found in the specified message for the small image.");
      }
      client.user.setActivity(r);
    } catch (error) {
      console.error("Error fetching the messages:", error);
    }
  }
  await updateImages();
    // Update images every 5 minutes
  setInterval(updateImages, 300000);
  
  client.user.setPresence({ status: "dnd" });
  
  let prevTime = null;
  setInterval(() => {
    const newTime = formatTime();
    if (newTime !== prevTime) {
      const newDetails = `sleep [${newTime}]`;
      r.setDetails(newDetails);
      client.user.setActivity(r);
      prevTime = newTime;
    }
  }, 1000);
});

client.login("");
