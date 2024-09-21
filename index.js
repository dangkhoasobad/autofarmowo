require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

let isFarming = false;
let token, farmChannelId, notifyChannelId, webhookUrl;

client.on('ready', () => {
    console.log(`Đăng nhập thành công với tài khoản: ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    console.log(`Received message: ${message.content}`);

    if (!message.content.startsWith('!')) return;

    const args = message.content.slice(1).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // Lệnh webhook
    if (command === 'webhook') {
        if (args.length < 1) {
            return message.channel.send('Cần cung cấp URL webhook.');
        }

        webhookUrl = args[0];

        // Xác thực webhook
        try {
            await axios.post(webhookUrl, { content: 'Webhook đã được xác thực thành công!' });
            message.channel.send('Webhook đã được xác thực thành công!');

            // Gửi thông báo vào kênh thông báo
            await axios.post(`https://discord.com/api/v9/channels/${notifyChannelId}/messages`, {
                content: 'Webhook xác thực thành công!',
            }, {
                headers: { Authorization: token },
            });

            // Bắt đầu quá trình farm ngay sau khi xác thực thành công
            if (!isFarming) {
                isFarming = true;
                startFarming();
            }

        } catch (error) {
            console.error('Lỗi xác thực webhook:', error);
            message.channel.send('Xác thực webhook thất bại. Vui lòng kiểm tra lại URL.');
        }
    }

    // Lệnh owogrind
    else if (command === 'owogrind') {
        if (args.length < 3) {
            return message.channel.send('Cần cung cấp token, channel ID farm và channel ID thông báo.');
        }

        token = args[0]; // Token tài khoản cá nhân
        farmChannelId = args[1]; // Channel ID để farm
        notifyChannelId = args[2]; // Channel ID để gửi thông báo

        message.channel.send('Lệnh owogrind đã được thiết lập thành công!');

        // Bắt đầu quá trình farm ngay sau khi thiết lập
        if (!isFarming) {
            isFarming = true;
            startFarming();
        }
    }

    // Lệnh captcha_done
    else if (command === 'captcha_done') {
        if (!isFarming) return message.channel.send('Chưa bắt đầu quá trình farm.');
        message.channel.send('Tiếp tục farm thú.');
        isFarming = true; // Đảm bảo farm đang chạy
        startFarming(); // Tiếp tục farm
    }

    // Lệnh set_status
    else if (command === 'set_status') {
        isFarming = !isFarming;
        message.channel.send(isFarming ? 'Đã tiếp tục quá trình farm.' : 'Đã tạm dừng quá trình farm.');
    }

    // Lệnh delete_my_data
    else if (command === 'delete_my_data') {
        // Logic để xóa dữ liệu
        token = null;
        farmChannelId = null;
        notifyChannelId = null;
        webhookUrl = null;
        message.channel.send('Dữ liệu đã được xóa.');
    }
});

async function startFarming() {
    console.log('Bắt đầu quá trình farm');

    // Gửi "owo pray" song song
    const sendOwopray = async () => {
        while (isFarming) {
            try {
                console.log(`[${new Date().toLocaleTimeString()}] Đang gửi lệnh "owo pray"`);
                await axios.post(`https://discord.com/api/v9/channels/${farmChannelId}/messages`, {
                    content: 'owo pray',
                }, {
                    headers: { Authorization: token },
                });

                await new Promise(resolve => setTimeout(resolve, 390000)); // Đợi 6 phút 30 giây
            } catch (error) {
                console.error('Lỗi khi gửi lệnh "owo pray":', error);
                await new Promise(resolve => setTimeout(resolve, 10000)); // Đợi 10 giây trước khi thử lại
            }
        }
    };

    sendOwopray();

    while (isFarming) {
        try {
            console.log(`[${new Date().toLocaleTimeString()}] Đang gửi lệnh "owo hunt"`);
            const huntResponse = await axios.post(`https://discord.com/api/v9/channels/${farmChannelId}/messages`, {
                content: 'owo hunt',
            }, {
                headers: { Authorization: token },
            });

            // Kiểm tra thú hiếm
            await checkForRarePets(huntResponse.data.content);

            await new Promise(resolve => setTimeout(resolve, 20000)); // Đợi 20 giây

            console.log(`[${new Date().toLocaleTimeString()}] Đang gửi lệnh "owo b"`);
            const battleResponse = await axios.post(`https://discord.com/api/v9/channels/${farmChannelId}/messages`, {
                content: 'owo b',
            }, {
                headers: { Authorization: token },
            });

            // Kiểm tra thú hiếm
            await checkForRarePets(battleResponse.data.content);

            await new Promise(resolve => setTimeout(resolve, 20000)); // Đợi 20 giây

            // Kiểm tra captcha
            if (huntResponse.data.content.includes('https://owobot.com/captcha')) {
                console.log('Phát hiện captcha! Tạm dừng farm...');
                isFarming = false;

                // Gửi thông báo đến webhook
                await axios.post(webhookUrl, {
                    content: `@everyone Phát hiện yêu cầu captcha! Farm đã bị tạm dừng. Vui lòng kiểm tra và hoàn thành captcha tại https://owobot.com/captcha.`,
                });

                // Gửi thông báo đến kênh thông báo
                await axios.post(`https://discord.com/api/v9/channels/${notifyChannelId}/messages`, {
                    content: `@everyone Phát hiện yêu cầu captcha! Farm đã bị tạm dừng. Vui lòng kiểm tra và hoàn thành captcha tại https://owobot.com/captcha.`,
                    headers: { Authorization: token },
                });

                break; // Tạm dừng farm
            }

        } catch (error) {
            console.error('Lỗi trong quá trình farm:', error);
            await new Promise(resolve => setTimeout(resolve, 10000)); // Đợi 10 giây trước khi thử lại
        }
    }
}

async function checkForRarePets(messageContent) {
    const rarePets = ['patreon', 'cpatreon', 'gem', 'legendary'];

    for (const pet of rarePets) {
        if (messageContent.includes(pet)) {
            console.log(`[${new Date().toLocaleTimeString()}] Phát hiện thú hiếm: ${pet}`);
            await axios.post(webhookUrl, {
                content: `🎉 Phát hiện thú hiếm: ${pet}!`,
            });
        }
    }
}

client.login(process.env.BOT_TOKEN); // Đăng nhập bằng token bot
