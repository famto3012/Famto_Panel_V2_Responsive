import useApiClient from "@/api/apiClient";

export const fetchAllManagers = async (navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(`/admin/managers`);

    return res.status === 200 ? res.data.data : [];
  } catch (err) {
    console.log(`Error in fetching managers: ${err}`);
    throw new Error(err.response?.data?.message || "Failed to fetch managers.");
  }
};
