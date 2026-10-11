'use server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import sanitize from 'sanitize-html';
import { z } from 'zod';
import { db, audit, getPost, hashPassword, getSettings } from './db';
import { allowAttempt, currentUser, digest, requireAdmin, requireUser, startSession, verifyPassword } from './auth';
import { slugify } from './utils';
import type { User } from './types';
const str=(f:FormData,key:string)=>String(f.get(key)||'');
const safeUrl=z.string().max(1000).refine(v=>!v||/^https:\/\//.test(v)||/^\/(images|media)\/[a-zA-Z0-9._-]+$/.test(v),'Liên kết cần là HTTPS hoặc tệp đã tải lên.');
const refresh=()=>revalidatePath('/','layout');
export async function login(_prev:{error:string},form:FormData) {
 const email=str(form,'email').trim().toLowerCase();const password=str(form,'password');
 if(email.length>254||password.length>256||!allowAttempt('login:'+email,8,15*60*1000))return {error:'Quá nhiều lần thử. Vui lòng thử lại sau 15 phút.'};
 const user=db.prepare('SELECT * FROM users WHERE email=?').get(email) as (User&{password:string})|undefined;
 if(!user||!verifyPassword(password,user.password))return {error:'Email hoặc mật khẩu không đúng.'};
 db.prepare('DELETE FROM rate_limits WHERE key=?').run('login:'+email);
 db.prepare('DELETE FROM login_otp_challenges WHERE user_id=? OR expires<?').run(user.id,Date.now());
 await startSession(user.id);
 redirect('/admin');
}
export async function logout() { const jar=await cookies(); const token=jar.get('tsq_session')?.value;if(token)db.prepare('DELETE FROM sessions WHERE token=?').run(digest(token));jar.delete('tsq_session');redirect('/admin/login'); }
export async function savePost(form:FormData) {
 const user=await requireUser();
 const schema=z.object({title:z.string().trim().min(5).max(200),slug:z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(220),excerpt:z.string().trim().max(500),content:z.string().max(250000),cover:safeUrl,category:z.string().min(1),status:z.enum(['draft','pending','published']),source:z.union([z.literal(''),z.url().startsWith('https://')])});
 const parsed=schema.safeParse({title:str(form,'title'),slug:str(form,'slug')||slugify(str(form,'title')),excerpt:str(form,'excerpt'),content:str(form,'content'),cover:str(form,'cover'),category:str(form,'category'),status:str(form,'status'),source:str(form,'source')});
 if(!parsed.success)return {error:'Kiểm tra tiêu đề (ít nhất 5 ký tự), đường dẫn, chuyên mục và các liên kết.'};
 const data=parsed.data;const id=str(form,'id')||randomUUID();const old=getPost(id);
 if(old&&(user.role==='author'&&(old.author_id!==user.id||!['draft','pending'].includes(old.status))))return {error:'Bạn chỉ được sửa bài nháp hoặc chờ duyệt của mình.'};
 if(user.role==='author'&&data.status==='published')return {error:'Bài viết cần được người duyệt xuất bản.'};
 if(!db.prepare('SELECT id FROM categories WHERE id=?').get(data.category))return {error:'Chuyên mục không tồn tại.'};
 if(old&&old.version!==Number(form.get('version')))return {error:'Bài đã được chỉnh sửa ở nơi khác. Vui lòng tải lại trang để tránh ghi đè.'};
 if(db.prepare('SELECT id FROM posts WHERE slug=? AND id!=?').get(data.slug,id))return {error:'Đường dẫn đã được sử dụng. Hãy chọn đường dẫn khác.'};
 const content=sanitize(data.content,{allowedTags:['p','br','h2','h3','strong','em','u','s','ul','ol','li','blockquote','a','img','video','source','hr','table','thead','tbody','tr','td','th'],allowedAttributes:{a:['href','target','rel'],img:['src','alt','title'],video:['src','controls','poster','width','height'],source:['src','type'],td:['colspan','rowspan'],th:['colspan','rowspan']},allowedSchemes:['https','http'],allowProtocolRelative:false,transformTags:{a:sanitize.simpleTransform('a',{rel:'noopener noreferrer'})}});
 const now=new Date().toISOString();const published=data.status==='published'?(old?.published_at||now):null;
 db.exec('BEGIN IMMEDIATE');
 try {
 if(old){db.prepare('INSERT INTO revisions(post_id,snapshot,actor) VALUES(?,?,?)').run(id,JSON.stringify(old),user.id);db.prepare('UPDATE posts SET title=?,slug=?,excerpt=?,content=?,cover=?,category=?,status=?,featured=?,demo=?,updated_at=?,published_at=?,source=?,version=version+1 WHERE id=?').run(data.title,data.slug,data.excerpt,content,data.cover,data.category,data.status,user.role==='author'?old.featured:form.get('featured')==='on'?1:0,form.get('demo')==='on'?1:0,now,published,data.source,id);}
 else db.prepare('INSERT INTO posts VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)').run(id,data.title,data.slug,data.excerpt,content,data.cover,data.category,data.status,user.role==='author'?0:form.get('featured')==='on'?1:0,form.get('demo')==='on'?1:0,user.id,now,now,published,data.source,1);
 audit(user.id,'Lưu bài: '+data.status,id);db.exec('COMMIT');
 }catch{db.exec('ROLLBACK');return {error:'Không thể lưu bài. Vui lòng thử lại.'};}
 refresh();return {success:true,id};
}
export async function changePostStatus(id:string,status:string) {
 const user=await requireUser();const post=getPost(id);if(!post)throw new Error('Bài không tồn tại.');
 if(!['draft','trash','published','pending'].includes(status))throw new Error('Trạng thái không hợp lệ.');
 if(user.role==='author'&&(post.author_id!==user.id||!['draft','pending'].includes(post.status)||!['draft','pending','trash'].includes(status)))throw new Error('Bạn không có quyền thực hiện thao tác này.');
 db.prepare('INSERT INTO revisions(post_id,snapshot,actor) VALUES(?,?,?)').run(id,JSON.stringify(post),user.id);
 db.prepare('UPDATE posts SET status=?,published_at=?,updated_at=?,version=version+1 WHERE id=?').run(status,status==='published'?(post.published_at||new Date().toISOString()):null,new Date().toISOString(),id);audit(user.id,status,id);refresh();
}
export async function saveSettings(form:FormData) {
 const user=await requireAdmin();const data={...getSettings()};
 for(const key of Object.keys(data) as (keyof typeof data)[])if(form.has(key)) data[key]=str(form,key).trim();
 if(!data.schoolName||!data.heroTitle||Object.values(data).some(v=>v.length>5000))return {error:'Tên trường và tiêu đề không được trống; mỗi mục tối đa 5.000 ký tự.'};
 if(!safeUrl.safeParse(data.heroImage).success||!z.url().startsWith('https://').safeParse(data.facebook).success)return {error:'Liên kết ảnh hoặc Facebook không hợp lệ.'};
 if(data.email&&!z.email().safeParse(data.email).success)return {error:'Email không hợp lệ.'};
 db.prepare('UPDATE settings SET value=? WHERE id=1').run(JSON.stringify(data));audit(user.id,'Cập nhật website','settings');refresh();return {success:true};
}
export async function saveHeroSlide(form:FormData) {
 const user=await requireAdmin();
 const parsed=z.object({id:z.string().max(80),eyebrow:z.string().trim().min(2).max(100),title:z.string().trim().min(2).max(180),description:z.string().trim().max(500),image:safeUrl,source:z.union([z.literal(''),z.url().startsWith('https://')]),order:z.coerce.number().int().min(0).max(999),active:z.string().optional()}).safeParse({id:str(form,'id'),eyebrow:str(form,'eyebrow'),title:str(form,'title'),description:str(form,'description'),image:str(form,'image'),source:str(form,'source'),order:str(form,'order'),active:str(form,'active')});
 if(!parsed.success)return {error:'Kiểm tra tiêu đề, ảnh và liên kết nguồn của slide.'};
 const d=parsed.data;const id=d.id||randomUUID();db.prepare('INSERT INTO hero_slides(id,eyebrow,title,description,image,source,order_index,active) VALUES(?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET eyebrow=excluded.eyebrow,title=excluded.title,description=excluded.description,image=excluded.image,source=excluded.source,order_index=excluded.order_index,active=excluded.active').run(id,d.eyebrow,d.title,d.description,d.image,d.source,d.order,d.active==='on'?1:0);audit(user.id,'Cập nhật slide hero',id);refresh();return {success:true};
}
export async function addCategory(form:FormData) {
 const user=await requireUser();if(user.role==='author')return {error:'Bạn không có quyền quản lý chuyên mục.'};
 const name=str(form,'name').trim();const slug=slugify(name);if(name.length<2||name.length>80||!slug)return {error:'Tên chuyên mục cần từ 2 đến 80 ký tự.'};
 try{db.prepare('INSERT INTO categories VALUES(?,?,?)').run(randomUUID(),name,slug);}catch{return {error:'Chuyên mục đã tồn tại.'};}audit(user.id,'Tạo chuyên mục',name);refresh();return {success:true};
}
export async function deleteCategory(id:string) {const user=await requireUser();if(user.role==='author')throw new Error('Không có quyền.');if(db.prepare('SELECT id FROM posts WHERE category=? LIMIT 1').get(id))return {error:'Chuyên mục đang có bài viết. Chuyển bài sang chuyên mục khác trước.'};db.prepare('DELETE FROM categories WHERE id=?').run(id);audit(user.id,'Xóa chuyên mục',id);refresh();return {success:true};}
export async function createUser(form:FormData) {
 const user=await requireAdmin();const result=z.object({name:z.string().trim().min(2).max(80),email:z.email().max(254),password:z.string().min(14).max(256),role:z.enum(['admin','editor','author'])}).safeParse({name:str(form,'name'),email:str(form,'email').toLowerCase(),password:str(form,'password'),role:str(form,'role')});
 if(!result.success)return {error:'Nhập tên, email hợp lệ và mật khẩu tối thiểu 14 ký tự.'};
 const d=result.data;try{db.prepare('INSERT INTO users VALUES(?,?,?,?,?)').run(randomUUID(),d.name,d.email,hashPassword(d.password),d.role);}catch{return {error:'Email đã tồn tại.'};}audit(user.id,'Tạo tài khoản',d.email);refresh();return {success:true};
}
export async function changePassword(form:FormData) {const user=await requireUser();const old=db.prepare('SELECT password FROM users WHERE id=?').get(user.id) as {password:string};const password=str(form,'password');if(!verifyPassword(str(form,'currentPassword'),old.password))return {error:'Mật khẩu hiện tại không đúng.'};if(password.length<14||password.length>256)return {error:'Mật khẩu mới cần từ 14 đến 256 ký tự.'};db.prepare('UPDATE users SET password=? WHERE id=?').run(hashPassword(password),user.id);db.prepare('DELETE FROM sessions WHERE user_id=?').run(user.id);await startSession(user.id);return {success:true};}
export async function uploadMedia(form:FormData) {
 const user=await requireUser();const file=form.get('file');if(!(file instanceof File)||file.size===0||file.size>10*1024*1024)return {error:'Chọn ảnh, video hoặc PDF tối đa 10 MB.'};
 const bytes=Buffer.from(await file.arrayBuffer());let ext='';let mime='';
 if(bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))){ext='png';mime='image/png';}
 else if(bytes[0]===255&&bytes[1]===216&&bytes[2]===255){ext='jpg';mime='image/jpeg';}
 else if(bytes.toString('ascii',0,4)==='RIFF'&&bytes.toString('ascii',8,12)==='WEBP'){ext='webp';mime='image/webp';}
 else if(bytes.toString('ascii',0,5)==='%PDF-'){ext='pdf';mime='application/pdf';}
 else if(bytes.toString('ascii',4,8)==='ftyp'){ext='mp4';mime='video/mp4';}
 else if(bytes.subarray(0,4).equals(Buffer.from([0x1a,0x45,0xdf,0xa3]))){ext='webm';mime='video/webm';}
 else return {error:'Chỉ nhận PNG, JPEG, WebP, MP4, WebM và PDF hợp lệ.'};
 const id=randomUUID();const filename=id+'.'+ext;const dir=process.env.VERCEL?'/tmp/tsqmt/uploads':resolve('.data/uploads');await mkdir(dir,{recursive:true});await writeFile(resolve(dir,filename),bytes);const url='/media/'+filename;
 db.prepare('INSERT INTO media VALUES(?,?,?,?,?,?)').run(id,file.name.slice(0,250),url,mime,file.size,new Date().toISOString());audit(user.id,'Tải tệp',id);revalidatePath('/admin/media');return {success:true,url,mime};
}
export async function sendContact(_prev:{error?:string;success?:boolean},form:FormData):Promise<{error?:string;success?:boolean}> {
 if(str(form,'website'))return {success:true};
 const parsed=z.object({name:z.string().trim().min(2).max(100),email:z.email().max(254),phone:z.string().max(30),message:z.string().trim().min(10).max(3000)}).safeParse({name:str(form,'name'),email:str(form,'email'),phone:str(form,'phone'),message:str(form,'message')});
 if(!parsed.success)return {error:'Vui lòng nhập tên, email hợp lệ và nội dung từ 10 đến 3.000 ký tự.'};
 if(!allowAttempt('contact:'+parsed.data.email.toLowerCase(),3,60*60*1000))return {error:'Bạn đã gửi nhiều yêu cầu. Vui lòng thử lại sau một giờ.'};
 const d=parsed.data;db.prepare('INSERT INTO messages(id,name,email,phone,message,created_at) VALUES(?,?,?,?,?,?)').run(randomUUID(),d.name,d.email,d.phone,d.message,new Date().toISOString());revalidatePath('/admin/messages');return {success:true};
}
export async function handleMessage(id:string) {const user=await requireUser();if(user.role==='author')throw new Error('Không có quyền.');db.prepare('UPDATE messages SET handled=1 WHERE id=?').run(id);refresh();}
export async function checkSession() { return !!(await currentUser()); }

