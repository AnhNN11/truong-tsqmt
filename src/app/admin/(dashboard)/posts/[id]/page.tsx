import { notFound } from 'next/navigation';
import { PostEditor } from '@/components/post-editor';
import { getCategories,getPost } from '@/lib/db';
import { requireUser } from '@/lib/auth';
export default async function EditPost({params}:{params:Promise<{id:string}>}){const user=await requireUser();const post=getPost((await params).id);if(!post||(user.role==='author'&&post.author_id!==user.id))notFound();return <PostEditor key={post.id+':'+post.version} categories={getCategories()} user={user} post={post}/>;}
