interface ShopSidebarSizeFilterProps {
  sizes?: string[];
  selectedSize?: string;
  onSelectSize?: (size: string) => void;
}

const defaultSizes = ["Size 0", "Size 1", "Size 2", "Size 3", "Size 4", "Size 5", "Size 6"];

export default function ShopSidebarSizeFilter({
  sizes = defaultSizes,
  selectedSize,
  onSelectSize,
}: ShopSidebarSizeFilterProps) {
  return (
    <div className="rounded border border-[#fff0ad] bg-white p-4">
      <h4 className="heading-font text-base font-bold text-[#d20b4f] mb-3 border-b border-[#d20b4f]/20 pb-2">
        Laddu Gopal Size
      </h4>
      <div className="grid grid-cols-3 gap-2">
        {sizes.map((size) => {
          const isSelected = selectedSize === size;
          return (
            <button
              key={size}
              type="button"
              onClick={() => onSelectSize && onSelectSize(size)}
              className={`rounded border border-[#fff0ad] px-2 py-1 text-xs font-bold transition cursor-pointer ${
                isSelected
                  ? "bg-[#d20b4f] text-white"
                  : "bg-[#fff0ad] text-black hover:bg-[#d20b4f] hover:text-white"
              }`}
            >
              {size}
            </button>
          );
        })}
      </div>
    </div>
  );
}
