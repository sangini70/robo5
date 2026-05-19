import { HomeContent } from '@/src/components/HomeContent';

export const dynamic = 'force-dynamic';

export default async function PaginatedHome({ params }: { params: Promise<{ page: string }> }) {
  const resolvedParams = await params;
  const page = parseInt(resolvedParams.page, 10);
  
  if (isNaN(page) || page < 1) {
    return <HomeContent page={1} />;
  }
  
  return <HomeContent page={page} />;
}
