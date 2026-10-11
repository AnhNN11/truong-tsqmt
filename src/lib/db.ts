import 'server-only';
import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { randomBytes, scryptSync } from 'node:crypto';
import type { Category, Post, Settings, User, Media, HeroSlide } from './types';
import { schoolMedia } from './school-media';

// Vercel's deployed filesystem is read-only except for /tmp. Keep local
// development on .data, while allowing the public site to boot in a
// serverless function. A durable production database can be supplied later
// by replacing this adapter with a hosted SQLite/Postgres provider.
const configuredDatabasePath = process.env.DATABASE_PATH;
const databasePath = process.env.VERCEL
 ? (configuredDatabasePath?.startsWith('/tmp/') ? configuredDatabasePath : '/tmp/tsqmt/site.db')
 : resolve(configuredDatabasePath || '.data/site.db');
mkdirSync(dirname(databasePath), { recursive: true });
const globalDb = globalThis as unknown as { tsqDb?: DatabaseSync };
export const db = globalDb.tsqDb ?? new DatabaseSync(databasePath);
globalDb.tsqDb = db;
db.exec(`PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000;
CREATE TABLE IF NOT EXISTS users(id TEXT PRIMARY KEY,name TEXT NOT NULL,email TEXT UNIQUE NOT NULL,password TEXT NOT NULL,role TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS sessions(token TEXT PRIMARY KEY,user_id TEXT REFERENCES users(id) ON DELETE CASCADE,expires INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS categories(id TEXT PRIMARY KEY,name TEXT NOT NULL,slug TEXT UNIQUE NOT NULL);
CREATE TABLE IF NOT EXISTS posts(id TEXT PRIMARY KEY,title TEXT NOT NULL,slug TEXT UNIQUE NOT NULL,excerpt TEXT NOT NULL,content TEXT NOT NULL,cover TEXT NOT NULL,category TEXT NOT NULL REFERENCES categories(id),status TEXT NOT NULL,featured INTEGER NOT NULL DEFAULT 0,demo INTEGER NOT NULL DEFAULT 0,author_id TEXT NOT NULL REFERENCES users(id),created_at TEXT NOT NULL,updated_at TEXT NOT NULL,published_at TEXT,source TEXT NOT NULL DEFAULT '',version INTEGER NOT NULL DEFAULT 1);
CREATE TABLE IF NOT EXISTS settings(id INTEGER PRIMARY KEY,value TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS media(id TEXT PRIMARY KEY,name TEXT NOT NULL,url TEXT NOT NULL,mime TEXT NOT NULL,size INTEGER NOT NULL,created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS hero_slides(id TEXT PRIMARY KEY,eyebrow TEXT NOT NULL,title TEXT NOT NULL,description TEXT NOT NULL,image TEXT NOT NULL,source TEXT NOT NULL DEFAULT '',order_index INTEGER NOT NULL DEFAULT 0,active INTEGER NOT NULL DEFAULT 1);
CREATE TABLE IF NOT EXISTS audit(id INTEGER PRIMARY KEY,actor TEXT,action TEXT,entity TEXT,created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS revisions(id INTEGER PRIMARY KEY,post_id TEXT NOT NULL,snapshot TEXT NOT NULL,actor TEXT NOT NULL,created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS messages(id TEXT PRIMARY KEY,name TEXT NOT NULL,email TEXT NOT NULL,phone TEXT NOT NULL,message TEXT NOT NULL,created_at TEXT NOT NULL,handled INTEGER DEFAULT 0);
CREATE TABLE IF NOT EXISTS rate_limits(key TEXT PRIMARY KEY,count INTEGER NOT NULL,reset_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS login_otp_challenges(id TEXT PRIMARY KEY,user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,code_hash TEXT NOT NULL,expires INTEGER NOT NULL,attempts INTEGER NOT NULL DEFAULT 0,created_at INTEGER NOT NULL,consumed INTEGER NOT NULL DEFAULT 0);
CREATE INDEX IF NOT EXISTS posts_status_date ON posts(status,published_at);
`);
export function hashPassword(value: string) { const salt=randomBytes(16).toString('hex'); return salt+':'+scryptSync(value,salt,64).toString('hex'); }
// Keep bundled starter stories visible on serverless deployments before an
// admin account has been configured. This account cannot be used to log in.
const seedAuthorId = db.prepare('SELECT id FROM users WHERE id=?').get('admin') ? 'admin' : 'system';
if (seedAuthorId === 'system' && !db.prepare('SELECT id FROM users WHERE id=?').get('system')) {
 db.prepare('INSERT INTO users VALUES (?,?,?,?,?)').run('system','Nội dung hệ thống','system@tsqmt.local',hashPassword(randomBytes(32).toString('hex')),'editor');
}
if (!db.prepare('SELECT id FROM users WHERE id=?').get('admin') && process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD.length >= 14) {
 db.prepare('INSERT OR IGNORE INTO users VALUES (?,?,?,?,?)').run('admin','Quản trị viên',process.env.ADMIN_EMAIL||'admin@tsq.local',hashPassword(process.env.ADMIN_PASSWORD),'admin');
}
export const defaults: Settings = {
 schoolName:'Trường Thiếu sinh quân miền Trung',branch:'Phân hiệu 1',tagline:'Tri thức vững vàng · Kỷ luật vững bước',
 heroTitle:'Ươm mầm tri thức.\nRèn luyện bản lĩnh.',heroDescription:'Nơi nuôi dưỡng ước mơ, bồi đắp nhân cách và chắp cánh cho thế hệ trẻ tự tin viết tiếp tương lai.',heroImage:'/images/campus.webp',
 introTitle:'Một mái trường.\nMột hành trình trưởng thành.',introText:'Học tập bằng sự say mê, trưởng thành bằng ý chí. Phân hiệu 1 – Trường Thiếu sinh quân miền Trung hướng đến môi trường giáo dục an toàn, kỷ cương và nhân ái, đồng hành cùng các em trên hành trình phát triển toàn diện.',
 address:'534 Phạm Văn Đồng, Phường Thống Nhất, Tỉnh Gia Lai, Việt Nam',phone:'',email:'',facebook:'https://www.facebook.com/profile.php?id=61595020737189',
 recruitmentText:'Thông tin tuyển sinh và hướng dẫn hồ sơ sẽ được nhà trường công bố tại chuyên mục Tuyển sinh. Phụ huynh vui lòng theo dõi các thông báo được duyệt hoặc liên hệ qua trang Facebook của Phân hiệu để được hướng dẫn.',
 educationText:'Định hướng giáo dục kết hợp học tập văn hóa, xây dựng nền nếp, rèn luyện thể chất và phát triển kỹ năng sống. Nhà trường đồng hành cùng học sinh trong học tập và sinh hoạt, xây dựng tinh thần đoàn kết, ý thức trách nhiệm và khát vọng vươn lên.'
};
if (!db.prepare('SELECT id FROM settings WHERE id=1').get()) db.prepare('INSERT INTO settings VALUES(1,?)').run(JSON.stringify(defaults));
if (!db.prepare('SELECT id FROM hero_slides LIMIT 1').get()) {
 for (const slide of [
  ['hero-main','PHÂN HIỆU 1','Ươm mầm tri thức.\nRèn luyện bản lĩnh.','Nơi nuôi dưỡng ước mơ, bồi đắp nhân cách và chắp cánh cho thế hệ trẻ tự tin viết tiếp tương lai.','/images/campus.webp','',1,1],
  ['hero-ceremony','TIN TỨC TỪ GIA LAI','Một khởi đầu được ghi dấu bằng trách nhiệm.','Lễ công bố quyết định thành lập và khai giảng năm học đầu tiên của Phân hiệu 1.','/images/school-ceremony.jpg',schoolMedia.vovArticle,2,1],
  ['hero-students','HỌC SINH KHÓA I','Cùng học tập, rèn luyện và trưởng thành.','160 học sinh khóa đầu tiên bắt đầu hành trình dưới mái trường Thiếu sinh quân miền Trung.','/images/school-students.jpg',schoolMedia.vovArticle,3,1]
 ]) db.prepare('INSERT INTO hero_slides VALUES(?,?,?,?,?,?,?,?)').run(...slide);
}
if (!db.prepare('SELECT id FROM categories LIMIT 1').get()) {
 for (const [id,name] of [['hoat-dong','Hoạt động nhà trường'],['giao-duc','Giáo dục & rèn luyện'],['tuyen-sinh','Tuyển sinh'],['thong-bao','Thông báo']]) db.prepare('INSERT OR IGNORE INTO categories VALUES(?,?,?)').run(id,name,id);
}
if (!db.prepare('SELECT id FROM posts LIMIT 1').get() && db.prepare('SELECT id FROM users WHERE id=?').get(seedAuthorId)) {
 const source='https://baogialai.com.vn/khai-giang-nam-hoc-2026-2027-phan-hieu-1-truong-thieu-sinh-quan-mien-trung-post600756.html';
 const rows=[
  ['khoi-dau-hanh-trinh-moi','Khởi đầu hành trình mới dưới mái trường Thiếu sinh quân','hoat-dong','Ngày 01/10/2026, Phân hiệu 1 tổ chức lễ công bố quyết định thành lập và khai giảng năm học 2026–2027 tại Gia Lai.','/images/school-ceremony.jpg',0,source],
  ['hoc-tap-va-truong-thanh','Học tập mỗi ngày, trưởng thành từng bước','giao-duc','Một không gian học tập khơi dậy sự chủ động, tinh thần sẻ chia và niềm vui khám phá.','/images/school-students.jpg',1,''],
  ['mai-truong-xanh','Cùng vun đắp một mái trường xanh, an toàn và thân thiện','hoat-dong','Từ những việc làm nhỏ, hình thành ý thức trách nhiệm với tập thể và môi trường sống.','/images/school-overview.jpg',1,''],
  ['dong-hanh-cung-phu-huynh','Đồng hành cùng phụ huynh trên hành trình của con','thong-bao','Kết nối gia đình và nhà trường để cùng chăm lo việc học tập, sinh hoạt và rèn luyện của học sinh.','/images/school-speech.jpg',1,''],
  ['thong-tin-tuyen-sinh','Theo dõi thông tin tuyển sinh của Phân hiệu 1','tuyen-sinh','Kênh cập nhật thông báo và hướng dẫn dành cho phụ huynh, học sinh quan tâm đến nhà trường.','/images/school-students.jpg',1,''],
  ['nep-song-noi-tru','Nếp sống nội trú: tự lập từ những điều giản dị','giao-duc','Ngăn nắp, đúng giờ và biết quan tâm đến bạn bè — những thói quen làm nên sự trưởng thành.','/images/school-overview.jpg',1,'']
 ];
 for (const [i,r] of rows.entries()) {
 const [slug,title,category,excerpt,cover,demo,src]=r; const time=`2026-10-0${Math.max(1,7-i)}T02:00:00.000Z`;
 const content=demo?`<p>${excerpt}</p><h2>Cùng học tập, cùng trưởng thành</h2><p>Nội dung bài viết được biên tập từ hoạt động thực tế của nhà trường và có thể cập nhật theo từng đợt thông tin.</p><p>Mỗi ngày đến trường là một cơ hội để học thêm điều mới, rèn luyện thói quen tốt và xây dựng tình bạn. Sự đồng hành của thầy cô, gia đình và tập thể là nền tảng để học sinh tự tin phát triển.</p>`:`<p>${excerpt}</p><p>Theo Báo Gia Lai, khóa đầu tiên có 160 học sinh nam, nữ, được tổ chức thành bốn lớp ở khối 6 và khối 10.</p><p>Nhà trường định hướng kết hợp học tập với rèn luyện nền nếp và kỹ năng sống, tạo môi trường phát triển toàn diện cho học sinh.</p><p>Bản tin tóm lược từ nguồn báo chí được liên kết bên dưới. Ảnh sự kiện sẽ được nhà trường cập nhật trong trang quản trị.</p>`;
 db.prepare('INSERT INTO posts VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)').run(`seed-${i}`,title,slug,excerpt,content,cover,category,'published',i===0?1:0,demo,seedAuthorId,time,time,demo?time:'2026-10-01T07:39:00.000Z',src,1);
 }
}
// Public Facebook posts captured from the school's page and kept as editable content records.
// The sync action can be extended with the Meta Graph API when an official page token is available.
const facebookSeeds = [
 ['fb-chia-tay','GIÂY PHÚT CHIA TAY – ĐONG ĐẦY NHỮNG KỶ NIỆM YÊU THƯƠNG','hoat-dong','Một ngày nhiều cảm xúc dưới mái trường Thiếu sinh quân. Những khoảnh khắc bên nhau trở thành ký ức đẹp trên hành trình trưởng thành.','/images/school-overview.jpg','https://www.facebook.com/profile.php?id=61595020737189'],
 ['fb-hoc-sinh-dtts','Học sinh DTTS tự hào khoác áo học viên thiếu sinh quân','hoat-dong','Câu chuyện về những học sinh dân tộc thiểu số tự tin hòa nhập, học tập và rèn luyện trong môi trường mới.','/images/school-ceremony.jpg','https://www.facebook.com/profile.php?id=61595020737189']
];
if (db.prepare('SELECT id FROM users WHERE id=?').get(seedAuthorId)) for (const [id,title,category,excerpt,cover,source] of facebookSeeds) {
 const t=new Date().toISOString(); const content=`<p>${excerpt}</p><p>Nội dung được biên tập lại từ bài đăng công khai trên Facebook của Phân hiệu 1 để hiển thị trong mục Tin tức và trang bài viết. Vui lòng mở nguồn gốc để xem đầy đủ hình ảnh và tương tác.</p>`;
 db.prepare('INSERT OR IGNORE INTO posts VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)').run(id,title,id,excerpt,content,cover,category,'published',0,0,seedAuthorId,t,t,t,source,1);
}
// Keep imported Facebook stories linked back to the school's official page.
db.prepare("UPDATE posts SET source=? WHERE id LIKE 'fb-%' AND (source='' OR source NOT LIKE '%facebook.com%')").run('https://www.facebook.com/profile.php?id=61595020737189');
db.prepare("UPDATE posts SET content=REPLACE(content,'để hiển thị trên landing page','để hiển thị trong mục Tin tức và trang bài viết') WHERE id LIKE 'fb-%'").run();
const officialStories = [
 ['bao-chi-thanh-lap-phan-hieu-1','Thành lập Phân hiệu 1 Trường Thiếu sinh quân miền Trung tại Gia Lai','hoat-dong','Ngày 1/10/2026, Quân khu 5 tổ chức lễ công bố quyết định thành lập và khai giảng năm học mới cho Phân hiệu 1 tại phường Thống Nhất, tỉnh Gia Lai.','/images/school-ceremony.jpg',schoolMedia.vovArticle],
 ['khai-giang-khoa-hoc-dau-tien','Khai giảng năm học đầu tiên với 160 học sinh','giao-duc','Năm học 2026–2027, Phân hiệu đón 160 học sinh nam, nữ, tổ chức thành bốn lớp ở khối 6 và khối 10.','/images/school-students.jpg',schoolMedia.baogiaLaiArticle],
 ['xay-dung-nep-song-chinh-quy','Xây dựng nếp sống chính quy, an toàn và thân thiện','giao-duc','Phân hiệu tập trung ổn định tổ chức, duy trì nền nếp học tập và rèn luyện, đồng hành cùng học sinh trong môi trường giáo dục an toàn.','/images/school-overview.jpg',schoolMedia.vovArticle]
];
if (db.prepare('SELECT id FROM users WHERE id=?').get(seedAuthorId)) for (const [id,title,category,excerpt,cover,source] of officialStories) {
 const t='2026-10-01T07:39:00.000Z'; const content=`<p>${excerpt}</p><p>Phân hiệu hướng đến mô hình trường học xanh, an toàn, kỷ cương, thông minh và hiện đại; kết hợp học tập văn hóa với rèn luyện nền nếp, kỹ năng sống và tinh thần trách nhiệm.</p><p>Thông tin được biên tập từ nguồn báo chí liên kết bên dưới.</p>`;
 db.prepare('INSERT OR IGNORE INTO posts VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)').run(id,title,id,excerpt,content,cover,category,'published',id==='bao-chi-thanh-lap-phan-hieu-1'?1:0,0,seedAuthorId,t,t,t,source,1);
}
db.prepare("UPDATE posts SET cover=? WHERE id='seed-0'").run('/images/school-ceremony.jpg');
db.prepare("UPDATE posts SET cover=? WHERE id='seed-1'").run('/images/school-students.jpg');
db.prepare("UPDATE posts SET cover=? WHERE id='seed-2'").run('/images/school-overview.jpg');
db.prepare("UPDATE posts SET cover=? WHERE id='seed-3'").run('/images/school-speech.jpg');
db.prepare("UPDATE posts SET cover=? WHERE id='seed-4'").run('/images/school-students.jpg');
db.prepare("UPDATE posts SET cover=? WHERE id='seed-5'").run('/images/school-overview.jpg');
export function getSettings(): Settings { return {...defaults,...JSON.parse((db.prepare('SELECT value FROM settings WHERE id=1').get() as {value:string}).value)}; }
export function getCategories() { return db.prepare('SELECT * FROM categories ORDER BY rowid').all().map(r=>({...r})) as Category[]; }
export function getPosts(options: {all?:boolean;category?:string;q?:string}={}) {
 let sql='SELECT p.*,u.name AS author_name FROM posts p JOIN users u ON u.id=p.author_id WHERE 1=1'; const args:string[]=[];
 if (!options.all) sql+=" AND p.status='published'";
 if(options.category) {sql+=' AND p.category=?';args.push(options.category);}
 if(options.q) {sql+=' AND (p.title LIKE ? OR p.excerpt LIKE ?)';args.push('%'+options.q+'%','%'+options.q+'%');}
 return db.prepare(sql+' ORDER BY p.featured DESC,COALESCE(p.published_at,p.created_at) DESC').all(...args).map(r=>({...r})) as Post[];
}
export function getPost(id:string) { const row=db.prepare('SELECT p.*,u.name AS author_name FROM posts p JOIN users u ON u.id=p.author_id WHERE p.id=?').get(id); return row ? {...row} as Post : undefined; }
export function getPublicPost(slug:string) { const row=db.prepare("SELECT p.*,u.name AS author_name FROM posts p JOIN users u ON u.id=p.author_id WHERE p.slug=? AND p.status='published'").get(slug); return row ? {...row} as Post : undefined; }
export function getFacebookPosts() { return db.prepare("SELECT p.*,u.name AS author_name FROM posts p JOIN users u ON u.id=p.author_id WHERE p.status='published' AND p.id LIKE 'fb-%' ORDER BY p.published_at DESC").all().map(r=>({...r})) as Post[]; }
export function getUsers() { return db.prepare('SELECT id,name,email,role FROM users ORDER BY name').all().map(r=>({...r})) as User[]; }
export function getMedia() { return db.prepare('SELECT * FROM media ORDER BY created_at DESC').all().map(r=>({...r})) as Media[]; }
export function getHeroSlides(includeInactive = false) { return db.prepare('SELECT * FROM hero_slides' + (includeInactive ? '' : ' WHERE active=1') + ' ORDER BY order_index,id').all().map(r=>({...r})) as HeroSlide[]; }
export function audit(actor:string,action:string,entity:string) {db.prepare('INSERT INTO audit(actor,action,entity) VALUES(?,?,?)').run(actor,action,entity);}

