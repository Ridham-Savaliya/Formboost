import axios from 'axios';
import config from '#config/index.js';

export async function sendToDiscord(channel, body) {
  const webhookUrls = config.discord.webhookUrl;
  const webhookUrl = webhookUrls[channel];

  // Check if Discord is properly configured
  if (
    !webhookUrl ||
    webhookUrl === 'discord_webhook_url_here' ||
    webhookUrl === 'discord_form_created_webhook_url_here' ||
    webhookUrl === 'discord_new_signup_webhook_url_here' ||
    webhookUrl === 'discord_error_channel_webhook_url_here'
  ) {
    console.warn(`Discord webhook not configured for channel: ${channel}, skipping notification`);
    return { success: false, message: 'Discord webhook not configured' };
  }

  body = {
    ...body,
    username: 'Formboom Backend - ' + config.app.env,
  };

  try {
    const response = await axios.post(webhookUrl, body);
    return response.data;
  } catch (error) {
    console.warn(`Discord notification failed for channel ${channel}:`, error.message);
    return { success: false, error: error.message };
  }
}
