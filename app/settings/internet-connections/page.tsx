import { getInternetConnectionTypes } from '@/app/actions/internet-connections';
import InternetConnectionsClientPage from '@/components/internet-connections/internet-connections-client-page';

export default async function InternetConnectionsPage() {
  const { data: internetConnectionTypes, error } = await getInternetConnectionTypes();

  if (error) {
    return <div className="p-4 text-red-500">Error loading internet connection types: {error.message}</div>;
  }

  return <InternetConnectionsClientPage initialInternetConnectionTypes={internetConnectionTypes || []} />;
}
