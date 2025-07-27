import { getInternetConnectionTypeById } from "@/app/actions/internet-connections";
import { InternetConnectionTypeForm } from "@/components/forms/internet-connection-type-form";
import { Heading } from "@/components/ui/heading";

export default async function EditInternetConnectionTypePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params
  const { data: internetConnectionType } = await getInternetConnectionTypeById(id);

  if (!internetConnectionType) {
    return <div>Internet connection type not found</div>;
  }

  return (
    <div className="p-4">
      <Heading
        title="Edit Internet Connection Type"
        description="Update the details of the internet connection type."
      />
      <div className="mt-6">
        <InternetConnectionTypeForm initialData={internetConnectionType} />
      </div>
    </div>
  );
}
