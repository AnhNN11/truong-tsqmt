import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { db } from '@/lib/db';
export async function GET(_request:Request,{params}:{params:Promise<{file:string}>}) {
 const {file}=await params;if(!/^[0-9a-f-]{36}\.(png|jpg|webp|pdf|mp4|webm)$/.test(file))return new Response(null,{status:404});
 const record=db.prepare('SELECT mime FROM media WHERE url=?').get('/media/'+file) as {mime:string}|undefined;if(!record)return new Response(null,{status:404});
 try{const bytes=await readFile(resolve('.data/uploads',file));return new Response(bytes,{headers:{'Content-Type':record.mime,'X-Content-Type-Options':'nosniff','Content-Disposition':record.mime==='application/pdf'?`attachment; filename="${file}"`:'inline','Cache-Control':'public, max-age=31536000, immutable'}});}catch{return new Response(null,{status:404});}
}
