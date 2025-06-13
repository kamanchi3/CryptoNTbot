require('dotenv').config();
const { Telegraf } = require('telegraf');
const axios = require('axios');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => ctx.reply('Привет! Я бот для новостей о крипте.'));
bot.help((ctx) => ctx.reply('Напишите /news или название монеты.'));

bot.command('news', async (ctx) => {
  // здесь будет логика получения новостей
  ctx.reply('Скоро будут новости...');
});

bot.launch();
