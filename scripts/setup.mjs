import { existsSync, writeFileSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
if (existsSync('.env.local')) { console.log('.env.local đã có; giữ nguyên cấu hình hiện tại.'); process.exit(0); }
const password = randomBytes(18).toString('base64url');
writeFileSync('.env.local', `ADMIN_EMAIL=admin@tsq.local\nADMIN_PASSWORD=${password}\nDATABASE_PATH=.data/site.db\nCOOKIE_SECURE=false\nNEXT_PUBLIC_SITE_URL=http://localhost:3000\n`);
writeFileSync('admin-access.txt', `Trang quản trị: http://localhost:3000/admin\nEmail: admin@tsq.local\nMật khẩu: ${password}\n\nThông tin truy cập riêng cho máy này. Không đưa file này lên Git.\n`);
console.log('Đã tạo .env.local và admin-access.txt với mật khẩu ngẫu nhiên.');
