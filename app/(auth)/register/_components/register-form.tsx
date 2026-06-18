"use client";
import { authClient } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import z from "zod";
const formSchema = z
  .object({
    name: z.string().min(2),
    email: z.email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    error: "Passwords don't match!",
  });
function RegisterForm() {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      console.log(value);
      const result = await authClient.signUp.email({
        name: value.name,
        email: value.email,
        password: value.password,
      });

      if (result.error) {
        toast.error(result.error.message || "Could not register account");
        return;
      }

      toast.success("Registered account!");
      router.push("/");
      router.refresh();
    },
  });

  return (
    <form
      onSubmit={(ev) => {
        ev.preventDefault();
        form.handleSubmit();
      }}
    ></form>
  );
}

export { RegisterForm };
