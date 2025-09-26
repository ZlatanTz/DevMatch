import axios from "axios";

export async function profileLoader({ params }) {
  const { id } = params;

  try {
    // Try candidate first
    try {
      const res = await axios.get(`http://127.0.0.1:8000/candidates/${id}`);
      return res.data;
    } catch (err) {
      console.log("Candidate not found, trying employer...", err);
    }

    // Try employer if candidate not found
    const res = await axios.get(`http://127.0.0.1:8000/employers/${id}`);
    return res.data;
  } catch (err) {
    throw new Response(err, { status: 404 });
  }
}
