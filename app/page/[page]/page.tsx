import { HomeContent } from '@/src/components/HomeContent';

export default async function PaginatedHome({ params }: { params: Promise<{ page: string }> }) {
  const resolvedParams = await params;
  const page = parseInt(resolvedParams.page, 10);
  
  if (isNaN(page) || page < 1) {
    return <HomeContent page={1} />;
  }
  
  return <HomeContent page={page} />;
}
