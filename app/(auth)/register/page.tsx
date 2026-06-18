import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { RegisterForm } from "./_components/register-form";

export default async function RegisterPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/");
  }

  return (
    <div className="mx-auto min-w-3xs max-w-prose p-4">
      <h1 className="mb-4 text-2xl font-bold">Register Page</h1>
      <RegisterForm />
    </div>
  );
}
