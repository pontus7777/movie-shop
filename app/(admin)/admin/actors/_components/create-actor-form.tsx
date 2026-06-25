"use client"
import { z } from "zod"
import { useForm } from "@tanstack/react-form"
import { toast } from "sonner"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { createActor } from "../_actions/create-actor-action"

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Title is required")
    .max(32, "Title must be less than 32 characters"),
})
function CreateActorForm({ actors }: { actors?: [] } = {}) {

  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const form = useForm({
    defaultValues: {
      name: "",
    },
    validators: {
      onSubmit: formSchema,
      //   onChange: formSchema,
      onBlur: formSchema,
    },

    onSubmit: async ({ value }) => {
      setLoading(true)
      try {
        const newActor = await createActor(value)

        toast.success("Actor created successfully")

        router.push(`/admin/actors/${newActor.id}`)
      } catch (err) {
        console.log(err)
        toast.error("Failed to submit form", {
          position: "bottom-center",
        })
      } finally {
        setLoading(false)
      }
    },
  })

  return (
    <>
      <form
        method="POST"
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
        className="space-y-4"
      >
        <FieldGroup>
          <form.Field name="name">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid

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
              )
            }}
          </form.Field>

          <FieldSeparator />

          <div className="flex justify-end gap-2">

            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Creating..." : "Create an actor"}
            </Button>
          </div>

        </FieldGroup>
      </form>
    </>
  )
}

export { CreateActorForm }