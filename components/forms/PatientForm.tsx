"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import CustomFormField from "../CustomFormField";
import { useState } from "react";
import SubmitButton from "../SubmitButton";
import { UserFormValidation } from "@/lib/validation";
import { createUser } from "@/lib/actions/patient.actions";

export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  CHECKBOX = "checkbox",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  SKELETON = "skeleton"
}

const PatientForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // 1. Define form.
  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: ""
    }
  });

  // 2. Define a submit handler.
  async function onSubmit({ name, email, phone }: z.infer<typeof UserFormValidation>) {
    setIsLoading(true);

    try {
      const userData = { name, email, phone };
      const newUser = await createUser(userData);
      if (newUser) {
        router.push(`/patients/${newUser.$id}/register`);
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6">
        <section className="mb-12 space-y-4">
          <h1 className="header">Hi there 👋</h1>
          <p className="text-dark-700">Get started with appointments.</p>
        </section>

        <CustomFormField control={form.control} fieldType={FormFieldType.INPUT} name="name" label="Full Name" placeholder="John Doe" iconSrc="/assets/icons/user.svg" iconAlt="user" />
        <CustomFormField control={form.control} fieldType={FormFieldType.INPUT} name="email" label="Email" placeholder="johndoe@jsmastery.pro" iconSrc="/assets/icons/email.svg" iconAlt="email" />
        <CustomFormField control={form.control} fieldType={FormFieldType.PHONE_INPUT} name="phone" label="Phone Number" placeholder="(555) 123-4567" />

        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  );
};
export default PatientForm;
