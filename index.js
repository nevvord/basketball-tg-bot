const TelegramBot = require('node-telegram-bot-api');

const token = '6806749520:AAFDVok9NJKXLpJWLNfPR95aV_Pd07j3eis';
const bot = new TelegramBot(token, { polling: true });

let scores = {};

bot.on('message', (msg) => {
  const { dice, chat, from, text } = msg
  const chatId = chat.id;
  const userId = from.id;

  if (text && text === 'score') {
    const list = Object.keys(scores)

    if (!list.length) {
      bot.sendMessage(chatId, 'Сначала кинь в кольцо а потом задавай вопросы!');

      return
    }
    let score = ''

    list.forEach((item) => {
      score += `${scores[item].name}: ${scores[item].score}\n`
    })

    bot.sendMessage(chatId, score);

    return
  }

  if (text && text === 'reset') {
    scores = JSON.parse('{}')

    bot.sendMessage(chatId, 'Кто-то слился? Или просто по новой? Ресетим сука!');
    return
  }


  // Проверяем, является ли стикер "баскетбольный мяч"
  if (dice && dice.emoji === '🏀') {


    // Инициализируем счет для чата, если его еще нет
    if (!scores[userId]) {
      scores[userId] = {
        name: from.username || from.first_name,
        score: 0
      };
    }

    if (dice.value < 4) {

      setTimeout(() => {
        bot.sendMessage(chatId, `Мимо лох! Стабильно: ${scores[userId].score} очков`);
      }, 3000)

      return
    }

    // Обновляем счет и отправляем сообщение
    scores[userId].score += scores[userId].score < 30 ? 3 : 1;
    setTimeout(() => {
      bot.sendMessage(chatId, `Попопопопал! ${scores[userId].name} получил по очку: ${scores[userId].score}`);
    }, 3000)

    // Проверяем, достиг ли кто-то 33 очка
    if (scores[userId].score >= 33) {
      setTimeout(() => {
        bot.sendMessage(chatId, `Хуя ты хитрый жук ${scores[userId].name}! Ты победил`);
        bot.sendMessage(chatId, 'Игра окончена');

        scores = JSON.parse('{}')
      }, 4000)
    }
  }
});




console.log('Бот запущен');
