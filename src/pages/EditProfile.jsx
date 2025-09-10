import { useParams } from "react-router-dom";
import { useLoaderData, Link } from "react-router-dom";

const EditProfile = () => {
  const profile = useLoaderData();
  const { id } = useParams();

  return <></>;
};

export default EditProfile;
