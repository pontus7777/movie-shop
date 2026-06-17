"use client";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { useState } from "react";
import { createMovie } from "../../_actions/create-movie-action";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
const formSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(32, "Title must be less than 32 characters"),
  description: z.string().min(1, "Description is required").max(1000),
  price: z.number().min(1),
  releaseYear: z.number().min(4).max(4),
  stock: z.boolean(),
  runtime: z.number(),
});

function CreateMovieForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      releaseYear: new Date().getFullYear(),
      stock: false,
      runtime: 0,
    },
    validators: {
      onSubmit: formSchema,
      onBlur: formSchema,
    },
    onSubmit: async ({ value }) => {
      setLoading(true);
      try {
        const newMovie = await createMovie(value);

        toast.success("Movie created successfully");

        // router.push(`/admin/movies/${newMovie.id}`); //need and issue to work on that!!!
      } catch (err) {
        console.log(err);
        toast.error("Failed to submit form", {
          position: "bottom-center",
        });
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <>
      <form
        method="POST"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <FieldGroup>
          <form.Field name="title">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
        </FieldGroup>

        <div className="flex justify-end gap-2">
          {/* <Button variant="outline" type="button" asChild>
              <Link href={`/admin/movies`}>
                <MoveLeft className="ml-2" />
                Back
              </Link>
            </Button> */}

          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Creating..." : "Create Movie"}
          </Button>
        </div>
      </form>
    </>
  );
}

export { CreateMovieForm };
