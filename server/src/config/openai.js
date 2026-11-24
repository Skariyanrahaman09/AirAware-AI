const { OpenAI } = require('openai');

const apiKey = process.env.OPENAI_API_KEY;
const isOpenAIConfigured = Boolean(apiKey && apiKey !== 'your_openai_api_key_here' && apiKey.startsWith('sk-'));

let openai = null;
if (isOpenAIConfigured) {
  openai = new OpenAI({
    apiKey: apiKey,
  });
}

module.exports = {
  openai,
  isOpenAIConfigured,
  defaultModel: process.env.OPENAI_MODEL || 'gpt-4o-mini',
};
