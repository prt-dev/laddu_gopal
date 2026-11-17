"use client";
import ShopSidebarCategories, { CategoryItem } from "./ShopSidebarCategories";
import ShopSidebarSizeFilter from "./ShopSidebarSizeFilter";
import ShopSidebarFeatured from "./ShopSidebarFeatured";

interface ShopSidebarProps {
  categories?: CategoryItem[];
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
  selectedSize?: string;
  onSelectSize?: (size: string) => void;
}

export default function ShopSidebar({
  categories,
  selectedCategory,
  onSelectCategory,
  selectedSize,
  onSelectSize,
}: ShopSidebarProps) {
  return (
    <aside className="w-full lg:w-1/4 order-2 lg:order-1">
      <div className="space-y-5">
        <ShopSidebarCategories
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={onSelectCategory}
        />
        <ShopSidebarSizeFilter selectedSize={selectedSize} onSelectSize={onSelectSize} />
        <ShopSidebarFeatured />
      </div>
    </aside>
  );
}


