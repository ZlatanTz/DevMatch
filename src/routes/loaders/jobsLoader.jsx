export async function jobsLoader({ request }) {
  const url = `${import.meta.env.BASE_URL}mock/jobs.json`;
  const res = await fetch(url, { signal: request.signal });

  if (!res.ok) {
    throw new Response("Failed to load jobs", { status: res.status });
  }

  const data = await res.json();
  return data;
}
