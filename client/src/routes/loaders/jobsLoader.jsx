import { getAllJobsDetailed } from "../../api/services/jobs";

export async function jobsLoader({ request }) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);

    // Učitavamo sve jobove (ili dovoljno veliki broj da pokrije sve)
    const data = await getAllJobsDetailed({ page_size: 100 });

    return {
      items: data.items || [],
      page,
      pageSize: 15, // koliko želimo prikazati po stranici
    };
  } catch (error) {
    console.error(error);
    throw new Response("Failed to load jobs", { status: error.response?.status || 500 });
  }
}

// export async function jobsLoader({ request }) {
//   try {
//     const url = new URL(request.url);
//     const page = parseInt(url.searchParams.get("page") || "1", 10);
//     const data = await getAllJobsDetailed({ page, page_size: 15 });

//     await new Promise((resolve) => setTimeout(resolve, 700));

//     return {
//       items: data.items || [],
//       total: data.meta?.total || 0,
//       page: data.meta?.page || page,
//       pageSize: data.meta?.page_size || 15,
//     };
//   } catch (error) {
//     console.error(error);
//     throw new Response("Failed to load jobs", { status: error.response?.status || 500 });
//   }
// }

// export async function jobsLoader() {
//   try {
//     const data = await getAllJobsDetailed(); // koristi default parametre
//     await new Promise((resolve) => setTimeout(resolve, 700));
//     return data.items || [];
//   } catch (error) {
//     console.error(error);
//     throw new Response("Failed to load jobs", { status: error.response?.status || 500 });
//   }
// }

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
