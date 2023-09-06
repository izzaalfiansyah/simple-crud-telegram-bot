const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

// replace the value below with the Telegram token you receive from @BotFather
const token = "6396611624:AAG5EewQF1tmY-FX_Nr45yEnH7og8498j9Q";
const api_url = "http://localhost:3000";

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

const http = axios.default.create({
  baseURL: api_url,
});

// Matches "/echo [whatever]"
bot.onText(/\/help/, async (msg, match) => {
  const chatId = msg.chat.id;

  console.log(msg);

  bot.sendMessage(
    chatId,
    "\
  Aku bisa membantumu mengatur jadwal untuk pakan ikan. Kamu bisa mengontrolku menggunakan perintah berikut:\n \
  /help - lihat dokumentasi\n \
  /list_schedule - melihat jadwal tersimpan\n \
  /new_schedule - menambah list baru\n \
  "
  );
});

bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});
