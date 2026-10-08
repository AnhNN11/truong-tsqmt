import { PostEditor } from '@/components/post-editor';
import { getCategories } from '@/lib/db';
import { requireUser } from '@/lib/auth';
export default async function NewPost(){return <PostEditor categories={getCategories()} user={await requireUser()}/>;}
