import { FlaskConical, Landmark, Languages, Swords, type LucideIcon } from 'lucide-react';

export type Faculty = {
  slug: string;
  number: string;
  title: string;
  eyebrow: string;
  summary: string;
  description: string;
  image: string;
  icon: LucideIcon;
  theme: 'digital' | 'science' | 'social' | 'military';
  focus: string[];
  modules: string[];
  outcomes: string[];
};

export const faculties: Faculty[] = [
  {
    slug: 'tin-hoc-ngoai-ngu',
    number: '01',
    title: 'Tin học và Ngoại ngữ',
    eyebrow: 'KHOA 01 · NĂNG LỰC HỘI NHẬP',
    summary: 'Mở rộng thế giới bằng công nghệ, ngôn ngữ và tinh thần tự học.',
    description: 'Khoa Tin học và Ngoại ngữ giúp học viên tự tin bước vào môi trường học tập hiện đại: biết sử dụng công cụ số, giao tiếp rõ ràng và chủ động tìm kiếm tri thức mới.',
    image: '/images/school-students.jpg',
    icon: Languages,
    theme: 'digital',
    focus: ['Tư duy số và kỹ năng công nghệ', 'Giao tiếp tiếng Anh theo tình huống', 'Tự học với nguồn học liệu mở'],
    modules: ['Tin học ứng dụng', 'Kỹ năng trình bày số', 'Tiếng Anh giao tiếp', 'Đọc hiểu và thuyết trình'],
    outcomes: ['Sử dụng công cụ số an toàn, hiệu quả', 'Diễn đạt ý tưởng mạch lạc bằng tiếng Việt và tiếng Anh', 'Làm việc nhóm trong môi trường học tập số'],
  },
  {
    slug: 'khoa-hoc-tu-nhien',
    number: '02',
    title: 'Khoa học tự nhiên',
    eyebrow: 'KHOA 02 · KHÁM PHÁ VÀ THỰC NGHIỆM',
    summary: 'Từ câu hỏi nhỏ đến năng lực quan sát, suy luận và giải quyết vấn đề.',
    description: 'Khoa học tự nhiên nuôi dưỡng thói quen đặt câu hỏi, kiểm chứng bằng bằng chứng và nhìn thế giới bằng tư duy hệ thống.',
    image: '/images/activity-study.jpg',
    icon: FlaskConical,
    theme: 'science',
    focus: ['Quan sát và đặt câu hỏi', 'Thực hành, đo lường và kiểm chứng', 'Tư duy logic trong đời sống'],
    modules: ['Toán học ứng dụng', 'Khoa học thực nghiệm', 'Môi trường và sức khỏe', 'Dự án khám phá'],
    outcomes: ['Biết xây dựng cách giải cho một vấn đề', 'Đọc dữ liệu và rút ra kết luận có căn cứ', 'Giữ tinh thần chính xác, kiên trì khi thực hành'],
  },
  {
    slug: 'khoa-hoc-xa-hoi',
    number: '03',
    title: 'Khoa học xã hội',
    eyebrow: 'KHOA 03 · HIỂU MÌNH, HIỂU CỘNG ĐỒNG',
    summary: 'Bồi đắp nhân cách, hiểu biết về quê hương và trách nhiệm với tập thể.',
    description: 'Khoa học xã hội giúp học viên đọc hiểu những câu chuyện của con người, quê hương và đất nước để hình thành góc nhìn nhân văn, bản lĩnh và có trách nhiệm.',
    image: '/images/school-speech.jpg',
    icon: Landmark,
    theme: 'social',
    focus: ['Lịch sử và truyền thống', 'Ngữ văn, giao tiếp và kể chuyện', 'Công dân, cộng đồng và trách nhiệm'],
    modules: ['Lịch sử địa phương', 'Ngữ văn và diễn đạt', 'Địa lý Việt Nam', 'Kỹ năng sống cộng đồng'],
    outcomes: ['Biết lắng nghe và tôn trọng khác biệt', 'Trình bày quan điểm có lý lẽ và cảm xúc', 'Nhận ra vai trò của mình trong tập thể'],
  },
  {
    slug: 'quan-su-nang-khieu',
    number: '04',
    title: 'Quân sự năng khiếu',
    eyebrow: 'KHOA 04 · BẢN LĨNH VÀ THỂ CHẤT',
    summary: 'Rèn sức bền, tác phong và ý chí qua những thử thách vừa sức mỗi ngày.',
    description: 'Quân sự năng khiếu kết hợp vận động, kỹ năng đội ngũ và sinh hoạt tập thể để học viên biết giữ kỷ luật, chăm sóc bản thân và hỗ trợ đồng đội.',
    image: '/images/activity-march.jpg',
    icon: Swords,
    theme: 'military',
    focus: ['Thể lực nền tảng', 'Đội ngũ và tác phong', 'Ý chí, an toàn và tinh thần đồng đội'],
    modules: ['Thể dục và sức bền', 'Đội ngũ cơ bản', 'Kỹ năng dã ngoại', 'Sơ cứu và an toàn'],
    outcomes: ['Duy trì thói quen vận động đều đặn', 'Thực hiện đúng hiệu lệnh và phối hợp đội hình', 'Bình tĩnh, bền bỉ và biết hỗ trợ bạn bè'],
  },
];

export function getFaculty(slug: string) {
  return faculties.find((faculty) => faculty.slug === slug);
}
