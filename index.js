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

function checkIsTime(val) {
  const times = val.split(":");

  if (times.length != 2) {
    throw new Error("waktu tidak valid");
  }

  if (
    parseInt(times[0]) == NaN ||
    parseInt(times[0]) < 0 ||
    parseInt(times[0]) > 23
  ) {
    throw new Error("waktu tidak valid");
  }

  if (
    parseInt(times[1]) == NaN ||
    parseInt(times[1]) < 0 ||
    parseInt(times[1]) > 59
  ) {
    throw new Error("waktu tidak valid");
  }

  return true;
}

const startText =
  "\
Aku bisa membantumu mengatur jadwal untuk pakan ikan. Kamu bisa mengontrolku menggunakan perintah berikut:\n \
/help - lihat dokumentasi\n \
/get_jadwal - melihat jadwal tersimpan\n \
/new_jadwal - menambah list baru\n \
/del_jadwal - menghapus jadwal\n \
/beri_pakan - memberikan pakan secara manual\n \
";

bot.onText(/\/start/, async (msg, match) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, startText);
});

// Matches "/echo [whatever]"
bot.onText(/\/help/, async (msg, match) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, startText);
});

bot.onText(/\/get_jadwal/, async (msg) => {
  const chatId = msg.chat.id;

  const res = await http.get("/jadwal");

  let message = "Jadwal tersimpan:\n";
  res.data.forEach((item, index) => {
    const no = index + 1;
    message += `${no}. Pukul ${item.waktu}\n`;
  });

  bot.sendMessage(chatId, message);
});

bot.onText(/\/new_jadwal (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const val = match[1];

  if (val) {
    try {
      checkIsTime(val);

      await http.post("/jadwal", {
        waktu: val,
      });

      bot.sendMessage(chatId, "jadwal baru berhasil disimpan");
    } catch (e) {
      bot.sendMessage(chatId, "gagal menyimpan jadwal. " + e.toString());
    }
  } else {
    bot.sendMessage(
      chatId,
      "OK. berikan format seperti berikut: /new_jadwal waktu_jadwal. \nContoh: /new_jadwal 00:00"
    );
  }
});

bot.onText(/\/new_jadwal/, (msg, match) => {
  const chatId = msg.chat.id;

  if (match.input == "/new_jadwal") {
    bot.sendMessage(
      chatId,
      "OK. berikan format seperti berikut: /new_jadwal waktu_jadwal. \nContoh: /new_jadwal 00:00"
    );
  }
});

bot.onText(/\/del_jadwal (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const val = match[1];

  if (val) {
    try {
      const res = await http.get("/jadwal", {
        waktu: val,
      });

      const item = res.data[val - 1];

      await http.delete("/jadwal/" + item.id);

      bot.sendMessage(chatId, `jadwal berhasil dihapus`);
    } catch (e) {
      bot.sendMessage(chatId, "gagal menghapus jadwal. " + e.toString());
    }
  } else {
    bot.sendMessage(
      chatId,
      "OK. berikan format seperti berikut: /del_jadwal nomor_jadwal. \nContoh: /del_jadwal 1"
    );
  }
});

bot.onText(/\/del_jadwal/, async (msg, match) => {
  const chatId = msg.chat.id;

  if (match.input == "/del_jadwal") {
    bot.sendMessage(
      chatId,
      "OK. berikan format seperti berikut: /del_jadwal nomor_jadwal. \nContoh: /del_jadwal 1"
    );
  }
});

bot.onText(/\/beri_pakan/, async (msg, match) => {
  const chatId = msg.chat.id;

  await http.put("/status/1", {
    on: true,
  });

  bot.sendMessage(chatId, "OK. Pakan diberikan");
});
