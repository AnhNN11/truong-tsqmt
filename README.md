# Phân hiệu 1 · Trường Thiếu sinh quân miền Trung

Website landing page và CMS nội dung xây dựng bằng Next.js App Router, SQLite và Tiptap.

## Chạy local

```bash
npm install
npm run setup
npm run dev
```

Mở `http://localhost:3000`. Thông tin đăng nhập local được tạo ngẫu nhiên trong [admin-access.txt](./admin-access.txt), không commit file này.

## Những gì đã có

- Landing page responsive với hero, giới thiệu, giáo dục & rèn luyện, tuyển sinh, tin tức, thư viện và liên hệ.
- Admin `/admin`: đăng nhập phiên cookie HttpOnly, phân quyền quản trị/biên tập/người viết.
- CMS bài viết: bản nháp, chờ duyệt, xuất bản, thùng rác, tìm kiếm, chuyên mục, bài nổi bật, ảnh đại diện, trình soạn thảo rich text, chèn ảnh/PDF, lịch sử chỉnh sửa và kiểm tra phiên bản chống ghi đè.
- Thư viện tệp nhận PNG/JPEG/WebP/PDF tối đa 10 MB; tệp được kiểm tra magic bytes trước khi lưu.
- Quản lý banner, giới thiệu, nội dung giáo dục, tuyển sinh và thông tin liên hệ từ admin.
- Biểu mẫu liên hệ có honeypot, giới hạn tần suất và hộp thư quản trị.
- Ba bài viết công khai được biên tập từ feed Facebook đã kiểm tra; mỗi bài có link nguồn để mở bài gốc.

## Facebook

Facebook hiện render nội dung bằng JavaScript và không cung cấp RSS công khai ổn định. Các bài đã kiểm tra được lưu vào CMS (`id` bắt đầu bằng `fb-`) và hiển thị chung trong mục Tin tức cùng trang bài viết riêng, để website không phụ thuộc việc Facebook có cho nhúng hay không. Ban biên tập có thể sửa, ẩn hoặc thay ảnh trong admin. Khi trường có Meta Page Access Token, có thể nối thêm job Graph API để đồng bộ tự động theo lịch.

## Kiểm tra

```bash
npm run typecheck
npm run build
```

`build` có cảnh báo tracing SQLite vì cơ sở dữ liệu được chọn bằng biến môi trường; đây là cảnh báo đóng gói, không phải lỗi build.

## Deploy trên Vercel

Vercel dùng filesystem tạm thời cho Serverless Function. Website vẫn có các bài tin mẫu ngay sau khi deploy, nhưng nội dung tạo từ `/admin` sẽ không tồn tại lâu dài nếu chỉ dùng SQLite ở `/tmp`.

Trong Project Settings → Environment Variables, thêm tối thiểu:

```env
ADMIN_EMAIL=dia-chi-email-quan-tri
ADMIN_PASSWORD=mat-khau-it-nhat-14-ky-tu
COOKIE_SECURE=true
NEXT_PUBLIC_SITE_URL=https://ten-mien-cua-ban.vn
```

Để CMS lưu bài viết bền vững, cần thay adapter SQLite trong `src/lib/db.ts` bằng một cơ sở dữ liệu có lưu trữ lâu dài như Neon Postgres, Supabase hoặc Turso. Khi chưa nối cơ sở dữ liệu ngoài, hãy xem bản deploy như bản giới thiệu có tin mẫu; không nên dùng `/tmp` làm kho dữ liệu sản xuất.
