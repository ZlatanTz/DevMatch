import { z } from "zod";

const baseRegistrationSchema = z.object({
  email: z.string().email("Email is not valid"),
  password: z.string().min(6, "Min 6 characters"),
  repeatPassword: z.string().min(6, "Min 6 characters"),
  phone: z.string().min(6, "Phone are not valid"),
  location: z.string().min(2, "Locations are not valid"),
  country: z.string().min(2, "State are not valid"),
});

export const candidateRegistrationSchema = baseRegistrationSchema
  .extend({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    years_experiance: z.number().min(0),
    skills: z.array(z.number()).min(1, "Choose at least one skill"),
    bio: z.string().min(10, "Bio must have at least 10 characters"),
    desired_salary: z.number().min(0, "Salary must be ≥ 0"),

    resumeUrl: z
      .any()
      .refine((files) => files?.length > 0, "CV is required")
      .transform((files) => files[0]),

    imgPath: z
      .any()
      .refine((files) => files?.length > 0, "Profile photo is required")
      .transform((files) => files[0]),

    seniority: z.enum(["intern", "junior", "medior", "senior"], {
      required_error: "Seniority is required",
      invalid_type_error: "Invalid seniority option",
    }),

    prefers_remote: z.boolean({
      invalid_type_error: "Invalid option",
    }),
  })
  .refine((data) => data.password === data.repeatPassword, {
    path: ["repeatPassword"],
    message: "Passwords doesn't match",
  });

export const employerRegistrationSchema = baseRegistrationSchema
  .extend({
    companyName: z.string().min(2, "Company name is required"),
    website: z.string().url("Enter valid url"),
    about: z.string().min(10, "About must have at least 10 characters"),

    companyLogo: z
      .any()
      .refine((files) => files?.length > 0, "Company logo is required")
      .transform((files) => files[0]),
  })
  .refine((data) => data.password === data.repeatPassword, {
    path: ["repeatPassword"],
    message: "Passwords doesn't match",
  });
