import { getMedia } from '@/lib/db';
import { MediaLibrary } from '@/components/admin-forms';
export default function Media(){return <><div className="admin-title"><div><h1>Thư viện tệp</h1><p>Quản lý ảnh và tài liệu dùng trong nội dung website.</p></div></div><MediaLibrary media={getMedia()}/></>;}
