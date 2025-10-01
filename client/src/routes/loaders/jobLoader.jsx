import { getJobByIdDetailed } from "../../api/services/jobs";

export async function jobLoader({ params }) {
  const { id } = params;

  try {
    const data = await getJobByIdDetailed(id);
    await new Promise((resolve) => setTimeout(resolve, 200));
    return data;
  } catch (error) {
    console.error(error);
    throw new Response("Failed to load job", { status: error.response?.status || 500 });
  }
}
