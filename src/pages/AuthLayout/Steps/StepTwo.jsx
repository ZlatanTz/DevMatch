import Input from "../Input";
import MultiSelect from "../MultiSelect";
import FileInput from "./FileInput";

const StepTwo = ({ role, register, errors, control }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
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
          <MultiSelect label="* Skills" name="skills" control={control} error={errors.skills} />
          <Input
            label="* Bio"
            name="bio"
            placeholder="Enter your bio"
            register={register}
            error={errors.bio}
          />
          <FileInput label="* CV" name="resume" register={register} error={errors.resume} />
          <FileInput
            label="* Profile photo"
            name="profilePicture"
            register={register}
            error={errors.profilePicture}
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
            name="companyLogoPicture"
            register={register}
            error={errors.companyLogoPicture}
          />
        </>
      )}
    </div>
  );
};

export default StepTwo;
