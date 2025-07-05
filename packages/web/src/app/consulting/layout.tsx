// packages/web/src/app/consulting/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '창업 컨설팅 - 박수진 대표 | 하이브창업',
  description: '창업 컨설팅 10년 경력, 창업 만족도 1위, 재문의율 1위 박수진 대표와 함께 성공적인 창업을 시작하세요.',
  keywords: '창업컨설팅, 박수진대표, 창업전문가, 창업상담, 하이브창업',
  openGraph: {
    title: '창업 컨설팅 전문가 박수진 대표 | 하이브창업',
    description: '10년 경력의 창업 전문가와 함께하는 성공 창업의 길',
    images: ['/images/team/park-soojin.jpg'],
  },
};

export default function ConsultingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}