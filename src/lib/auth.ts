import 'server-only';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createHash, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { db } from './db';
import type { User } from './types';
export const digest=(s:string)=>createHash('sha256').update(s).digest('hex');
export async function currentUser() { const token=(await cookies()).get('tsq_session')?.value; if(!token)return null; const row=db.prepare('SELECT u.id,u.name,u.email,u.role FROM users u JOIN sessions s ON u.id=s.user_id WHERE s.token=? AND s.expires>?').get(digest(token),Date.now()) as User|undefined; return row ? {id:String(row.id),name:String(row.name),email:String(row.email),role:row.role} : null; }
export async function requireUser() { const user=await currentUser(); if(!user)redirect('/admin/login'); return user; }
export async function requireAdmin() { const user=await requireUser(); if(user.role!=='admin')throw new Error('Chỉ quản trị viên được thực hiện thao tác này.'); return user; }
export function verifyPassword(value:string,hash:string) {const [salt,key]=hash.split(':');const actual=scryptSync(value,salt,64);const expected=Buffer.from(key,'hex');return expected.length===actual.length&&timingSafeEqual(actual,expected);}
export async function startSession(userId:string) { const token=randomBytes(32).toString('hex');db.prepare('DELETE FROM sessions WHERE expires<?').run(Date.now());db.prepare('INSERT INTO sessions VALUES(?,?,?)').run(digest(token),userId,Date.now()+8*60*60*1000);(await cookies()).set('tsq_session',token,{httpOnly:true,secure:process.env.COOKIE_SECURE==='true',sameSite:'lax',path:'/',maxAge:8*60*60}); }
export function allowAttempt(key:string,max:number,windowMs:number) { const now=Date.now();db.prepare('DELETE FROM rate_limits WHERE reset_at<?').run(now);const row=db.prepare('SELECT count FROM rate_limits WHERE key=?').get(key) as {count:number}|undefined;if(row&&row.count>=max)return false; db.prepare('INSERT INTO rate_limits VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1').run(key,now+windowMs);return true; }
