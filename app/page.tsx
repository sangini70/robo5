import { HomeContent } from '@/src/components/HomeContent';

export const dynamic = 'force-dynamic';

export default function Home() {
  return <HomeContent page={1} />;
}
