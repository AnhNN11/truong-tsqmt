import Link from 'next/link';
import { Plus } from 'lucide-react';
import { getPosts,getCategories } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import { AdminPosts } from '@/components/admin-posts';
export default async function Posts(){const user=await requireUser();return <><div className="admin-title"><div><h1>Quản lý bài viết</h1><p>Biên tập, duyệt và xuất bản nội dung của nhà trường.</p></div><Link className="button" href="/admin/posts/new"><Plus size={18}/>Viết bài mới</Link></div><AdminPosts posts={getPosts({all:true}).filter(p=>user.role!=='author'||p.author_id===user.id)} categories={getCategories()} user={user}/></>;}
