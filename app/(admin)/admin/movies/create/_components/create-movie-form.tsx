import { z } from "zod";

const createMovieSchema = z.object({
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

function CreateMovieForm() {}

export { CreateMovieForm };
