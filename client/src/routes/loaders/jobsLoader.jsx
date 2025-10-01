import { getAllJobsDetailed } from "../../api/services/jobs";

export async function jobsLoader({ request }) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);

    const data = await getAllJobsDetailed({ page_size: 100 });

    return {
      items: data.items || [],
      page,
      pageSize: 12,
    };
  } catch (error) {
    console.error(error);
    throw new Response("Failed to load jobs", { status: error.response?.status || 500 });
  }
}
