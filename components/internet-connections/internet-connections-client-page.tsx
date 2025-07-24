"use client";

import { getInternetConnectionTypes, deleteInternetConnectionType } from '@/app/actions/internet-connections';
import { Heading } from '@/components/ui/heading';
import { InternetConnectionTypeForm } from '@/components/forms/internet-connection-type-form';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { InternetConnectionType } from '@/lib/types';

export default function InternetConnectionsClientPage({
  initialInternetConnectionTypes,
}: {
  initialInternetConnectionTypes: InternetConnectionType[];
}) {
  const [internetConnectionTypes, setInternetConnectionTypes] = useState<InternetConnectionType[]>(initialInternetConnectionTypes);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setInternetConnectionTypes(initialInternetConnectionTypes);
  }, [initialInternetConnectionTypes]);

  const handleDelete = async (id: string) => {
    try {
      await deleteInternetConnectionType(id);
      toast.success("Internet connection type deleted successfully.");
      setInternetConnectionTypes(internetConnectionTypes.filter(ict => ict.id !== id));
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  const onCreated = (newType: InternetConnectionType) => {
    setInternetConnectionTypes([newType, ...internetConnectionTypes]);
  };

  return (
    <div className="p-4">
      <Heading title="Internet Connection Types" description="Manage available internet connection types." />

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Add New Connection Type</h2>
        <InternetConnectionTypeForm onCreated={onCreated} />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Existing Connection Types</h2>
        {internetConnectionTypes && internetConnectionTypes.length > 0 ? (
          <ul className="space-y-4">
            {internetConnectionTypes.map((ict) => (
              <li key={ict.id} className="p-4 border rounded-md shadow-sm bg-white flex justify-between items-center">
                <div>
                  <p className="font-medium">{ict.type} ({ict.speed} from {ict.provider})</p>
                  <p className="text-sm text-gray-600">Status: {ict.status}, Cost: {ict.cost}</p>
                </div>
                <div className="flex space-x-2">
                  <Link href={`/settings/internet-connections/${ict.id}`}>
                    <Button variant="outline" size="sm">Edit</Button>
                  </Link>
                  <form action={() => handleDelete(ict.id)}>
                    <Button type="submit" variant="destructive" size="sm">Delete</Button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No internet connection types found.</p>
        )}
      </div>
    </div>
  );
}
