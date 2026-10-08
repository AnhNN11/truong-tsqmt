import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function CookiePolicy() {
 return <section className="section container policy-page"><Link href="/" className="text-link"><ArrowLeft size={16}/>Về trang chủ</Link><span className="eyebrow">THÔNG TIN MINH BẠCH</span><h1>Chính sách cookie</h1><p>Phân hiệu 1 sử dụng cookie và công nghệ lưu trữ tương tự ở mức cần thiết để website hoạt động ổn định, ghi nhớ lựa chọn của bạn và bảo vệ phiên quản trị.</p><h2>Cookie cần thiết</h2><p>Nhóm này phục vụ chức năng bảo mật, phiên đăng nhập quản trị và lựa chọn đồng ý cookie. Bạn không thể tắt nhóm này trong khi sử dụng các chức năng tương ứng.</p><h2>Cookie đo lường và bên thứ ba</h2><p>Website hiện không tự bật công cụ quảng cáo hoặc đo lường bên thứ ba. Nếu bổ sung trong tương lai, chúng chỉ được kích hoạt sau khi bạn chọn “Cho phép tất cả” và thông tin sẽ được cập nhật tại đây.</p><h2>Thay đổi lựa chọn</h2><p>Bạn có thể xóa dữ liệu website trong trình duyệt để hiển thị lại bảng lựa chọn cookie. Khi liên hệ nhà trường, nội dung bạn gửi qua biểu mẫu được xử lý theo mục đích tiếp nhận và phản hồi yêu cầu.</p></section>;
}
