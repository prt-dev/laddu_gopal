import ShopSidebar from "./ShopSidebar";
import ShopProducts from "./ShopProducts";

export default function ShopSection() {
  return (
    <div className="mx-auto max-w-[1100px] px-5 py-8">
      {/* Top Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 bg-[#fff0ad] p-4 rounded">
        <div className="w-full sm:w-72">
          <div className="relative">
            <input
              type="search"
              placeholder="Search poshak, pagdi, shringar..."
              className="w-full rounded border border-gray-300 bg-white py-1.5 pl-3 pr-8 text-xs text-black focus:border-[#d20b4f] focus:outline-hidden"
            />
            <span className="absolute right-2.5 top-2 text-[#d20b4f] text-xs">
              <i className="fa fa-search" />
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end text-xs font-bold text-black">
          <label htmlFor="shop-sort">Sort by:</label>
          <select
            id="shop-sort"
            className="rounded border border-gray-300 bg-white py-1 px-2 text-xs font-bold text-black focus:border-[#d20b4f] focus:outline-hidden cursor-pointer"
          >
            <option value="">Featured Items</option>
            <option value="bestseller">Top Selling</option>
            <option value="low-to-high">Price: Low to High</option>
            <option value="high-to-low">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row gap-6">
        <ShopSidebar />
        <ShopProducts />
      </div>
    </div>
  );
}
