export async function profileLoader({ request }) {
  const url = `${import.meta.env.BASE_URL}mock/candidate_profiles.json`;
  const res = await fetch(url, { signal: request.signal });

  if (!res.ok) {
    throw new Response("Failed to load profile details", { status: res.status });
  }

  const data = await res.json();
  return data;
}
