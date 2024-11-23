import { useState } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import CategerySelect from "../components/CategerySelect";
import ProductSelect from "../components/ProductTable";

function BrowseProducts() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    number | undefined
  >();

  return (
    <div>
      <h1>Products</h1>
      <div className="max-w-xs">
        <CategerySelect
          onChange={(categoryId) => setSelectedCategoryId(categoryId)}
        />
      </div>
      <ProductSelect selectedCategoryId={selectedCategoryId} />
    </div>
  );
}

export default BrowseProducts;
