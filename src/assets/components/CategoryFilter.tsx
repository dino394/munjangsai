import type { Category } from "../../types/types.ts";

interface CategoryFilterProps {
  selectedCategory: "전체" | Category;
  onCategoryChange: (
    category: "전체" | Category
  ) => void;
}

const categories: ("전체" | Category)[] = [
  "전체",
  "철학",
  "문학",
  "사회",
  "과학",
  "예술",
  "문화",
];

function CategoryFilter({
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <nav className="categories">
      {categories.map((category) => (
        <button
          key={category}
          className={`category ${
            selectedCategory === category
              ? "active"
              : ""
          }`}
          onClick={() =>
            onCategoryChange(category)
          }
        >
          {category}
        </button>
      ))}
    </nav>
  );
}

export default CategoryFilter;