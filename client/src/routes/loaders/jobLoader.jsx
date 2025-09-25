// export async function jobLoader({ params, request }) {
//   const { id } = params;
//   // const url = `${import.meta.env.BASE_URL}mock/jobs.json`;
//   const url = `${import.meta.env.VITE_API_BASE_URL}/jobs/${id}`;
//   const res = await fetch(url, { signal: request.signal });

//   if (!res.ok) {
//     throw new Response("Failed to load jobs", { status: res.status });
//   }

//   const data = await res.json();
//   await new Promise((resolve) => setTimeout(resolve, 700));

//   // console.log(data.items);
//   return data;
//   // return data.items || [];
// }

import { getJobByIdDetailed } from "../../api/services/jobs";

export async function jobLoader({ params }) {
  const { id } = params;

  try {
    const data = await getJobByIdDetailed(id);
    await new Promise((resolve) => setTimeout(resolve, 700));
    return data;
  } catch (error) {
    console.error(error);
    throw new Response("Failed to load job", { status: error.response?.status || 500 });
  }
}
