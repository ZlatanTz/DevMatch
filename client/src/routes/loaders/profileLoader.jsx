export async function profileLoader({ request }) {
  const url = `${import.meta.env.BASE_URL}mock/candidate_profiles.json`;
  const res = await fetch(url, { signal: request.signal });

  if (!res.ok) {
    throw new Response("Failed to load profile details", { status: res.status });
  }

  const data = await res.json();
  return data;
}
export async function updateProfileLoader({ params, request }) {
  const url = `${import.meta.env.BASE_URL}mock/candidate_profiles.json`;
  const res = await fetch(url, { signal: request.signal });

  if (!res.ok) {
    throw new Response("Failed to load profile details", { status: res.status });
  }

  const data = await res.json();

  // Convert to string in case your IDs are numbers
  const profile = data.find((el) => String(el.id) === params.id);

  if (!profile) {
    throw new Response("Profile not found", { status: 404 });
  }

  // Just return the object directly
  return profile;
}
