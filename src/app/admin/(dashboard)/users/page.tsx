import { requireAdmin } from '@/lib/auth';
import { getUsers } from '@/lib/db';
import { UsersForm } from '@/components/admin-forms';
export default async function Users(){await requireAdmin();return <><div className="admin-title"><div><h1>Tài khoản & phân quyền</h1><p>Cấp quyền phù hợp cho từng thành viên ban biên tập.</p></div></div><UsersForm users={getUsers()}/></>;}
