import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { HeroBanner } from '@/components/home/HeroBanner';
import { StatsCounters } from '@/components/home/StatsCounters';
import { Categories } from '@/components/home/Categories';
import { BeginnerTeaser } from '@/components/home/BeginnerTeaser';

export default function HomePage() {
  useDocumentTitle();
  return (
    <>
      <HeroBanner />
      <StatsCounters />
      <Categories />
      <BeginnerTeaser />
    </>
  );
}
