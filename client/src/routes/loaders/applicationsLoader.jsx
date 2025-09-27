export async function applicationsLoader({ request }) {
  const url = `${import.meta.env.BASE_URL}mock/applications.json`;
  const res = await fetch(url, { signal: request.signal });
  if (!res.ok) {
    throw new Response("Failed to load applications", { status: res.status });
  }
  const applications = await res.json();
  await new Promise((resolve) => setTimeout(resolve, 700));

  const url2 = `${import.meta.env.BASE_URL}mock/jobs.json`;
  const res2 = await fetch(url2, { signal: request.signal });
  if (!res.ok) {
    throw new Response("Failed to load jobs", { status: res2.status });
  }
  const jobs = await res2.json();

  return { applications, jobs };
}
