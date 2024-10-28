import { Metadata } from 'next';
import { GBreadCrumb } from '@/components/gui/gbreadcrumb';

import Search from '@/app/ui/search';
import { CreateLead } from '@/app/ui/lead/buttons';
import Table from '@/app/ui/lead/table';
import { Suspense } from 'react';
import { LeadsTableSkeleton } from '@/app/ui/lead/skeletons';


export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  }
}) {
  const breadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Leads', href: '' },
  ];

  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  //const totalPages = await fetchLeadsPages(query);

  return (
    <>
      <GBreadCrumb breadcrumbs={breadcrumbs} />

      <div className="w-full">
        <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
          <Search placeholder="Search leads..." />
          <CreateLead />
        </div>
      </div>

      <Suspense key={query + currentPage} fallback={<LeadsTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>

    </>
  )
}


export const metadata: Metadata = {
  title: 'Leads',
};
