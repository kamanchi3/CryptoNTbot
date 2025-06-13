const { Telegraf } = require('telegraf');
const { getTop100, getMarketChart } = require('./coinService');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.command('top', async (ctx) => {
  try {
    const coins = await getTop100();
    const message = coins
      .map(
        (c, i) =>
          `${i + 1}. ${c.name} (${c.symbol.toUpperCase()}) – $${c.current_price}`
      )
      .join('\n');
    ctx.reply(message);
  } catch (err) {
    console.error(err);
    ctx.reply('Не удалось получить данные о монетах.');
  }
});

// пример команды для графика конкретной монеты
bot.command('chart', async (ctx) => {
  const coinId = ctx.message.text.split(' ')[1]; // например: /chart bitcoin
  if (!coinId) return ctx.reply('Укажите id монеты, например: /chart bitcoin');
  try {
    const data = await getMarketChart(coinId, 1); // последние сутки
    // здесь можно сформировать изображение/ссылку на график или вывести последние цены
    ctx.reply(`Получено ${data.length} точек для ${coinId}`);
  } catch (err) {
    console.error(err);
    ctx.reply('Ошибка при получении графика.');
  }
});

bot.launch();
