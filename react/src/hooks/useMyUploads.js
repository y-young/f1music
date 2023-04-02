import useSWR from "swr";
import { View } from "services/upload";

const useMyUploads = () => useSWR("/api/uploads", View);

export default useMyUploads;
