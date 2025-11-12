import { useEffect, useState, useCallback } from "react";
import { fetchProjects } from "../utils/fetchProjects";
export interface ProjectsType {
  id: number;
  project_name: string;
  project_description: string;
  cover_image: string;
  project_location: string;
  project_field: string;
  project_products: string;
  project_document: string;
  user: number;
  created_at: string;
  updated_at: string;
}
const useFetchProjects = () => {
  const [projects, setprojects] = useState<ProjectsType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const fetchData = useCallback(async () => {

    setLoading(true);
    setError(null);
    try {
      const data = await fetchProjects();
      setprojects(data?.results || data || []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  return { projects, loading, error, refetch: fetchData };
};
export default useFetchProjects;