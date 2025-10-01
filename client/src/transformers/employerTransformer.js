const getFileName = (file) => (file instanceof File ? file.name : file || undefined);

export const transformEmployerFormToPayload = (form) => {
  return {
    email: form.email,
    password: form.password,
    employer: {
      company_name: form.companyName,
      website: form.website,
      about: form.about,
      location: form.location,
      country: form.country,
      tel: form.phone,
      company_logo: getFileName(form.companyLogo),
    },
  };
};
