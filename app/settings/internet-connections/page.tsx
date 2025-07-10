import React from 'react';
import { getInternetConnectionTypes, createInternetConnectionType, updateInternetConnectionType, deleteInternetConnectionType } from '@/app/actions/internet-connections';
import { InternetConnectionType } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { Heading } from '@/components/ui/heading'; // Assuming this component exists

export default async function InternetConnectionsPage() {
  const { data: internetConnectionTypes, error } = await getInternetConnectionTypes();

  if (error) {
    return <div className="p-4 text-red-500">Error loading internet connection types: {error.message}</div>;
  }

  const handleCreate = async (formData: FormData) => {
    "use server";
    const type = formData.get('type') as string;
    const speed = formData.get('speed') as string | null;
    const provider = formData.get('provider') as string | null;
    const status = formData.get('status') as string | null;
    const cost = parseFloat(formData.get('cost') as string) || null;

    await createInternetConnectionType(type, speed, provider, status, cost);
    revalidatePath('/settings/internet-connections');
  };

  const handleUpdate = async (id: string, formData: FormData) => {
    "use server";
    const updates: Partial<InternetConnectionType> = {};
    const type = formData.get('type') as string;
    const speed = formData.get('speed') as string | null;
    const provider = formData.get('provider') as string | null;
    const status = formData.get('status') as string | null;
    const cost = parseFloat(formData.get('cost') as string) || null;

    if (type) updates.type = type;
    if (speed) updates.speed = speed;
    if (provider) updates.provider = provider;
    if (status) updates.status = status;
    if (cost) updates.cost = cost;

    await updateInternetConnectionType(id, updates);
    revalidatePath('/settings/internet-connections');
  };

  const handleDelete = async (id: string) => {
    "use server";
    await deleteInternetConnectionType(id);
    revalidatePath('/settings/internet-connections');
  };

  return (
    <div className="p-4">
      <Heading title="Internet Connection Types" description="Manage available internet connection types." />

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Add New Connection Type</h2>
        <form action={handleCreate} className="space-y-4">
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
            <input type="text" id="type" name="type" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
          </div>
          <div>
            <label htmlFor="speed" className="block text-sm font-medium text-gray-700">Speed</label>
            <input type="text" id="speed" name="speed" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
          </div>
          <div>
            <label htmlFor="provider" className="block text-sm font-medium text-gray-700">Provider</label>
            <input type="text" id="provider" name="provider" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
            <input type="text" id="status" name="status" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
          </div>
          <div>
            <label htmlFor="cost" className="block text-sm font-medium text-gray-700">Cost</label>
            <input type="number" step="0.01" id="cost" name="cost" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
          </div>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Add Connection Type</button>
        </form>
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
                  {/* Edit form can be a dialog or separate page */}
                  <form action={handleDelete.bind(null, ict.id)}>
                    <button type="submit" className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600">Delete</button>
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
