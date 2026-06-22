"use client";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/client";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

const editMovieSchema = z.object({
  id: z.string().min(1),
  title: z
    .string()
    .min(1, "Title is required")
    .max(32, "Title must be less than 32 characters"),
  description: z.string().min(1, "Description is required").max(1000),
  price: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/)
    .min(1),
  releaseYear: z.number().min(0).max(9999),
  stock: z.boolean(),
  runtime: z.number().min(10),
});

export async function editMovie(values: z.infer<typeof editMovieSchema>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const data = editMovieSchema.parse(values);

  try {
    const updatedMovie = await prisma.movie.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title,
        description: data.description,
        price: new Decimal(data.price),
        releaseYear: data.releaseYear,
        stock: data.stock,
        runtime: data.runtime,
      },
    });
    revalidatePath(`/admin/movies`);
    return updatedMovie;
  } catch (error) {
    console.log("Error editing a movie", error);
    throw new Error("Faild to edit a movie: ");
  }
}
