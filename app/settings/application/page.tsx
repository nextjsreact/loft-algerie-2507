import React from 'react';
import { getSetting, updateSetting } from '@/app/actions/app-settings';
import { revalidatePath } from 'next/cache';
import { Heading } from '@/components/ui/heading'; // Assuming this component exists

// Server Actions must be defined at the top level
async function updateThemeSetting(formData: FormData) {
  "use server";
  const newTheme = formData.get('theme') as string;
  await updateSetting('theme', newTheme);
  revalidatePath('/settings/application');
}

async function updateAdminEmailSetting(formData: FormData) {
  "use server";
  const newEmail = formData.get('admin_email') as string;
  await updateSetting('admin_email', newEmail);
  revalidatePath('/settings/application');
}

export default async function ApplicationSettingsPage() {
  const { data: themeSetting } = await getSetting('theme');
  const { data: adminEmailSetting } = await getSetting('admin_email');

  return (
    <div className="p-4">
      <Heading title="Application Settings" description="Manage application-wide settings." />

      <div className="mt-6 space-y-6">
        {/* Theme Setting */}
        <div className="p-4 border rounded-md shadow-sm bg-white">
          <h2 className="text-xl font-semibold mb-4">Theme Settings</h2>
          <form action={updateThemeSetting}>
            <label htmlFor="theme" className="block text-sm font-medium text-gray-700">Application Theme</label>
            <select id="theme" name="theme" defaultValue={themeSetting?.value || 'light'} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
            <button type="submit" className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Save Theme</button>
          </form>
        </div>

        {/* Admin Email Setting */}
        <div className="p-4 border rounded-md shadow-sm bg-white">
          <h2 className="text-xl font-semibold mb-4">Administrator Email</h2>
          <form action={updateAdminEmailSetting}>
            <label htmlFor="admin_email" className="block text-sm font-medium text-gray-700">Admin Contact Email</label>
            <input type="email" id="admin_email" name="admin_email" defaultValue={adminEmailSetting?.value || ''} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            <button type="submit" className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Save Email</button>
          </form>
        </div>

        {/* Add more settings sections as needed */}
      </div>
    </div>
  );
}
