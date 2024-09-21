# Hướng Dẫn Sử Dụng Bot Discord

## Giới Thiệu
Bot Discord này được thiết kế để tự động thực hiện các lệnh "owo" nhằm farm thú trong trò chơi OwO. Bot có thể gửi thông báo khi phát hiện captcha hoặc khi có thú hiếm xuất hiện.

## Cài Đặt

1. **Clone repository**
   ```bash
   git clone https://github.com/dangkhoasobad/autofarmowo
   cd autofarmowo

2. Cài đặt các module yêu cầu
npm install
npm install axios
npm install discord.js

3. Tạo file .env Tạo một file .env trong thư mục gốc của dự án và thêm dòng sau:
BOT_TOKEN=YOUR_TOKEN_BOT

4. Chạy bot
node index.js

Lệnh Sử Dụng
1. Xác thực Webhook
Cú pháp: !webhook <URL>
Mô tả: Cung cấp URL webhook để bot có thể gửi thông báo. Nếu xác thực thành công, bot sẽ gửi thông báo vào kênh thông báo đã thiết lập.
2. Thiết lập Farm
Cú pháp: !owogrind <token> <farm_channel_id> <notify_channel_id>
Mô tả: Thiết lập token cá nhân và ID kênh để bot thực hiện các lệnh farm và gửi thông báo.
3. Xác nhận hoàn thành Captcha
Cú pháp: !captcha_done
Mô tả: Sử dụng lệnh này khi bạn đã hoàn thành captcha. Bot sẽ tiếp tục quá trình farm.
4. Thay đổi trạng thái
Cú pháp: !set_status
Mô tả: Chuyển đổi trạng thái farm giữa "tiếp tục" và "tạm dừng".
5. Xóa dữ liệu
Cú pháp: !delete_my_data
Mô tả: Xóa dữ liệu đã thiết lập của bot.
Lưu Ý
Đảm bảo bạn đã cấp quyền đầy đủ cho bot trong server Discord.
Theo dõi các thông báo từ bot để kịp thời xử lý captcha hoặc các sự cố khác.
Ghi Chú
Nếu bạn muốn ngừng farm, hãy sử dụng lệnh !set_status để tạm dừng.
