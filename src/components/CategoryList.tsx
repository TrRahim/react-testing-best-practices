import axios from "axios";
import { useQuery } from "react-query";
import { Category } from "../entities";

function CategoryList() {
  const {
    data: categories,
    isLoading: loading,
    error,
  } = useQuery<Category[], Error>({
    queryKey: ["categories"],
    queryFn: () => axios.get<Category[]>("/categories").then((res) => res.data),
  });

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Category List</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul>
          {categories!.map((category) => (
            <li key={category.id}>{category.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CategoryList;
