import { requireUser } from '@/lib/auth';
import { AdminShell } from '@/components/admin-shell';
export const dynamic='force-dynamic';
export const metadata={title:'Quản trị website',robots:{index:false,follow:false}};
export default async function Layout({children}:{children:React.ReactNode}){const user=await requireUser();return <AdminShell user={user}>{children}</AdminShell>;}
