import { getAllJobsDetailed } from "../../api/services/jobs";

// export async function jobsLoader({ request }) {
//   // const url = `${import.meta.env.BASE_URL}mock/jobs.json`;
//   const url = `${import.meta.env.VITE_API_BASE_URL}/jobs/?page=1&page_size=15&sort_by=created_at&sort_dir=desc`;
//   const res = await fetch(url, { signal: request.signal });
//   if (!res.ok) {
//     throw new Response("Failed to load jobs", { status: res.status });
//   }

//   const data = await res.json();
//   await new Promise((resolve) => setTimeout(resolve, 700));

//   // console.log(data.items);
//   // return data;
//   return data.items || [];
// }

export async function jobsLoader() {
  try {
    const data = await getAllJobsDetailed(); // koristi default parametre
    await new Promise((resolve) => setTimeout(resolve, 700));
    return data.items || [];
  } catch (error) {
    console.error(error);
    throw new Response("Failed to load jobs", { status: error.response?.status || 500 });
  }
}
