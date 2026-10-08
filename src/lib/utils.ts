export function slugify(s: string) { return s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''); }
export function dateLabel(s: string) { return new Intl.DateTimeFormat('vi-VN', {day:'2-digit',month:'2-digit',year:'numeric',timeZone:'Asia/Ho_Chi_Minh'}).format(new Date(s)); }
export const statuses = { draft: 'Bản nháp', pending: 'Chờ duyệt', published: 'Đã xuất bản', trash: 'Thùng rác' };
