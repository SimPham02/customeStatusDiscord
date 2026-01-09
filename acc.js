const Discord = require('discord.js-selfbot-v13');
const { CustomStatus } = require('discord.js-selfbot-v13');
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

async function startDiscordClient() {
  const client = new Discord.Client({
    readyStatus: false,
    checkUpdate: false
  });

  currentClient = client;

  client.on('ready', async () => {
    console.clear();
    console.log(`${client.user.tag} - login success`);

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

    const rawTexts = process.env.CUSTOM_STATUS_TEXTS || process.env.CUSTOM_STATUS_TEXT || "Gần đây bạn đang đọc gì?";
    const statusTexts = String(rawTexts).split('|').map(s => s.trim()).filter(Boolean);
    const rawEmojis = process.env.CUSTOM_STATUS_EMOJIS || process.env.CUSTOM_STATUS_EMOJI || "😊";
    const statusEmojis = String(rawEmojis).split('|').map(s => s.trim()).filter(Boolean);
    let statusIndex = 0;

    const custom = new CustomStatus(client)
      .setState(statusTexts[statusIndex])
      .setEmoji(statusEmojis[statusIndex % statusEmojis.length]);

    client.user.setPresence({ status: "dnd", activities: [custom, r] });
    console.log("Started custom status rotation:", statusTexts);
    const rotateSeconds = Math.max(1, parseInt(process.env.CUSTOM_STATUS_INTERVAL, 10) || 5);
    const rotateMs = rotateSeconds * 1000;
    console.log(`Custom status rotate interval: ${rotateSeconds}s`);
    setInterval(() => {
      statusIndex = (statusIndex + 1) % statusTexts.length;
      custom.setState(statusTexts[statusIndex]);
      custom.setEmoji(statusEmojis[statusIndex % statusEmojis.length]);
      client.user.setPresence({ status: "dnd", activities: [custom, r] });
      console.log("Custom status updated to:", statusTexts[statusIndex]);
    }, rotateMs);

    let prevTime = null;
    setInterval(() => {
      const newTime = formatTime();
      if (newTime !== prevTime) {
        r.setDetails(`sleep [${newTime}]`);
        client.user.setPresence({ status: "dnd", activities: [custom, r] });
        prevTime = newTime;
      }
    }, 1000);
  });

  client.login(process.env.DISCORD_TOKEN);
}

startDiscordClient();
