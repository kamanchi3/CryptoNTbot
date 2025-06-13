const axios = require('axios');

// Получить список топ‑100 монет по капитализации
async function getTop100() {
  const url = 'https://api.coingecko.com/api/v3/coins/markets';
  const params = {
    vs_currency: 'usd',
    order: 'market_cap_desc',
    per_page: 100,
    page: 1,
  };
  const { data } = await axios.get(url, { params });
  return data; // массив объектов с информацией о монетах
}

// Получить данные для графика конкретной монеты
async function getMarketChart(id, days = 7) {
  const url = `https://api.coingecko.com/api/v3/coins/${id}/market_chart`;
  const params = { vs_currency: 'usd', days };
  const { data } = await axios.get(url, { params });
  return data.prices; // массив [timestamp, price]
}

module.exports = { getTop100, getMarketChart };
