const { Telegraf } = require('telegraf');
const axios = require('axios');
const { getTop100, getMarketChart } = require('./coinService');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);
const userRisk = new Map();

bot.command('risk', (ctx) => {
  const risk = ctx.message.text.split(' ')[1];
  const allowed = ['light', 'medium', 'ultamegalastdep'];
  if (!allowed.includes(risk)) {
    return ctx.reply('Укажите уровень риска: light|medium|ultamegalastdep');
  }
  userRisk.set(ctx.from.id, risk);
  ctx.reply(`Уровень риска установлен: ${risk}`);
});

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

  const openaiKey = process.env.OPENAI_API_KEY;
  if (!openaiKey) {
    return ctx.reply('OpenAI API key не настроен.');
  }

  const risk = userRisk.get(ctx.from.id) || 'medium';

  try {
    const data = await getMarketChart(coinId, 1); // последние сутки
   
    const recent = data.slice(-5).map((p) => p[1]).join(', ');

    const prompt = `Prices for ${coinId}: ${recent}. Provide trading advice for a ${risk} risk strategy.`;

    const { data: aiRes } = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 200,            // ограничивает длину ответа
    temperature: 0.7,   
      },
      { headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openaiKey}`
      }}
    );

    const advice = aiRes.choices[0].message.content.trim();
    ctx.reply(advice);
  } catch (err) {
    console.error(err);
    ctx.reply('Ошибка при получении графика.');
  }
});

bot.launch();