import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import Header from "@/components/shared/Header";
import TranformationForm from '@/components/shared/tranformationForm';
import { transformationTypes } from "@/constants";
import { getUserById } from "@/lib/actions/user.actions";
import { GetImagebyId } from "@/lib/actions/image.actions";

const Page = async ({ params: { id } }) => {
  const { userId } = auth();

  if (!userId) redirect("/sign-in");

  const user = await getUserById(userId);
  const image = await GetImagebyId(id);

  const transformation =
    transformationTypes[image.transformationType ];

  return (
    <>
      <Header title={transformation.title} subtitle={transformation.subTitle} />

      <section className="mt-10">
        <TranformationForm
          action="Update"
          userId={user._id}
          type={image.transformationType}
          creditBalance={user.creditBalance}
          config={image.config}
          data={image}
        />
      </section>
    </>
  );
};

export default Page;