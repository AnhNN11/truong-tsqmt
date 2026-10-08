import { requireUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getCategories } from '@/lib/db';
import { CategoriesForm } from '@/components/admin-forms';
export default async function Categories(){if((await requireUser()).role==='author')redirect('/admin');return <><div className="admin-title"><div><h1>Chuyên mục</h1><p>Sắp xếp nội dung giúp người đọc tìm đúng thông tin.</p></div></div><CategoriesForm categories={getCategories()}/></>;}
