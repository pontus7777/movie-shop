import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SignInForm } from "./_components/sign-in-form";

export default async function SinInPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/");
  }

  return (
    <>
      <div className="mx-auto max-w-prose p-4">
        <h1 className="mb-4 text-2xl font-bold">SignIn Page</h1>
        <SignInForm />
      </div>
    </>
  );
}
