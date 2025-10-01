import { useSkills } from "@/hooks/useSkills";
import Input from "../Input";
import MultiSelect from "../MultiSelect";
import FileInput from "./FileInput";

const StepTwo = ({ role, register, errors, control }) => {
  const { skills } = useSkills();

  const selectOptions = skills.map((skill) => ({
    value: skill.id,
    label: skill.name,
  }));

  const seniorityOptions = [
    { value: "intern", label: "intern" },
    { value: "junior", label: "junior" },
    { value: "medior", label: "medior" },
    { value: "senior", label: "senior" },
  ];

  const preferRemoteOptions = [
    { value: true, label: "Yes, I prefer" },
    { value: false, label: "No, I don't" },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-4/5 xl:w-full">
      {/* Shared fields */}
      <Input
        label="* Email"
        name="email"
        placeholder="Enter your email"
        register={register}
        error={errors.email}
      />
      <Input
        label="* Phone"
        placeholder="Enter your phone number"
        name="phone"
        register={register}
        error={errors.phone}
      />
      <Input
        label="* Password"
        name="password"
        placeholder="Enter your password"
        type="password"
        register={register}
        error={errors.password}
      />
      <Input
        label="* Repeat Password"
        name="repeatPassword"
        placeholder="Repeat your password"
        type="password"
        register={register}
        error={errors.repeatPassword}
      />

      <Input
        label="* Location"
        name="location"
        placeholder="Enter your location"
        register={register}
        error={errors.location}
      />
      <Input
        label="* Country"
        placeholder="Enter your country"
        name="country"
        register={register}
        error={errors.country}
      />
      {/* Role-specific */}
      {role === "candidate" && (
        <>
          <Input
            label="* First Name"
            name="firstName"
            placeholder="Enter your first name"
            register={register}
            error={errors.firstName}
          />
          <Input
            label="* Last Name"
            placeholder="Enter your last name"
            name="lastName"
            register={register}
            error={errors.lastName}
          />
          <Input
            label="* Experiance Years"
            name="years_experiance"
            placeholder="Enter your experiance years"
            type="number"
            register={register}
            error={errors.years_experiance}
            {...register("years_experiance", { valueAsNumber: true })}
          />
          <Input
            label="* Desired Salary"
            name="desired_salary"
            type="number"
            placeholder="Enter your salary"
            register={register}
            registerOptions={{ valueAsNumber: true }}
            error={errors.desired_salary}
          />
          <MultiSelect
            label="* Seniority"
            options={seniorityOptions}
            isMulti={false}
            name="seniority"
            control={control}
            error={errors.seniority}
          />
          <MultiSelect
            label="Do you prefer remote work?"
            options={preferRemoteOptions}
            name="prefers_remote"
            control={control}
            error={errors.skills}
          />
          <MultiSelect
            label="Skills"
            options={selectOptions}
            isMulti={true}
            name="skills"
            control={control}
            error={errors.skills}
          />
          <Input
            label="Bio"
            name="bio"
            placeholder="Enter your bio"
            register={register}
            error={errors.bio}
          />
          <FileInput
            label="* Resume"
            name="resumeUrl"
            register={register}
            error={errors.resumeUrl}
            accept=".pdf"
          />
          <FileInput
            label="Profile photo"
            name="imgPath"
            accept=".jpg,.jpeg,.png"
            register={register}
            error={errors.imgPath}
          />
        </>
      )}

      {role === "employer" && (
        <>
          <Input
            label="* Company name"
            placeholder="Enter your company name"
            name="companyName"
            register={register}
            error={errors.companyName}
          />
          <Input
            label="* Website"
            name="website"
            placeholder="Enter your website url"
            register={register}
            error={errors.website}
          />
          <Input
            label="* About Company"
            placeholder="Tell us something about your company"
            name="about"
            register={register}
            error={errors.about}
          />
          <FileInput
            label="* Company Logo"
            name="companyLogo"
            accept=".jpg,.jpeg,.png"
            register={register}
            error={errors.companyLogo}
          />
        </>
      )}
    </div>
  );
};

export default StepTwo;
