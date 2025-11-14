const Discord = require('discord.js-selfbot-v13');
require('dotenv').config();

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

const largeImageMessageUrl = process.env.LARGE_IMAGE_URL;
const smallImageMessageUrl = process.env.SMALL_IMAGE_URL;

let currentLargeImageURL = '';
let currentSmallImageURL = '';

let currentClient = null;
let restartTimer = null; 

async function startDiscordClient() {
  const client = new Discord.Client({
    readyStatus: false,
    checkUpdate: false
  });

  currentClient = client;

  client.on('ready', async () => {
    console.clear();
    console.log(`${client.user.tag} - login success`);
    if (restartTimer) clearTimeout(restartTimer);
    restartTimer = setTimeout(restartClient, 6 * 60 * 60 * 1000);

    const r = new Discord.RichPresence()
      .setApplicationId(process.env.APPLICATION_ID)
      .setType(process.env.TYPE)
      .setState(process.env.STATE)
      .setName(process.env.NAME)
      .setDetails(`sleep [${formatTime()}]`)
      .setStartTimestamp(Date.now())
      .setAssetsLargeText(process.env.SET_ASSETS_LARGE_TEXT)
      .setAssetsSmallText(process.env.SET_ASSETS_SMALL_TEXT)
      .addButton(process.env.BUTTON_1_LABEL, process.env.BUTTON_1_URL)
      .addButton(process.env.BUTTON_2_LABEL, process.env.BUTTON_2_URL);

    async function checkAndUpdateImages() {
      try {
        const [_, largeImageChannelId, largeImageMessageId] =
          largeImageMessageUrl.split('/').slice(-3);
        const largeImageChannel = await client.channels.fetch(largeImageChannelId);
        const largeImageMessage = await largeImageChannel.messages.fetch(largeImageMessageId);
        if (largeImageMessage.attachments.size > 0) {
          const largeImageAttachment = largeImageMessage.attachments.first();
          const newLargeImageURL = largeImageAttachment.url;
          r.setAssetsLargeImage(newLargeImageURL);
          currentLargeImageURL = newLargeImageURL;
        }

        const [__, smallImageChannelId, smallImageMessageId] =
          smallImageMessageUrl.split('/').slice(-3);
        const smallImageChannel = await client.channels.fetch(smallImageChannelId);
        const smallImageMessage = await smallImageChannel.messages.fetch(smallImageMessageId);
        if (smallImageMessage.attachments.size > 0) {
          const smallImageAttachment = smallImageMessage.attachments.first();
          const newSmallImageURL = smallImageAttachment.url;
          r.setAssetsSmallImage(newSmallImageURL);
          currentSmallImageURL = newSmallImageURL;
        }

        client.user.setActivity(r);
        console.log("Đã cập nhật Rich Presence img.");
      } catch (error) {
        console.error("Lỗi khi lấy ảnh:", error);
      }
    }

    await checkAndUpdateImages();

    client.user.setPresence({ status: "dnd" });

    let prevTime = null;
    setInterval(() => {
      const newTime = formatTime();
      if (newTime !== prevTime) {
        r.setDetails(`sleep [${newTime}]`);
        client.user.setActivity(r);
        prevTime = newTime;
      }
    }, 1000);
  });

  client.login(process.env.DISCORD_TOKEN);
}

function restartClient() {
  console.log("Restarting Discord client...");

  if (currentClient) {
    currentClient.destroy();
  }
  setTimeout(() => {
    startDiscordClient();
  }, 10000);
}

startDiscordClient();
