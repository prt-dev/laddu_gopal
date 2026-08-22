import ShopSidebar from "./ShopSidebar";
import ShopProducts from "./ShopProducts";
import { siteConfig } from "../../config/site";

export default function ShopSection() {
  return (
    <div className="container-fluid fruite py-5">
      <div className="container py-5">
        <h1 className="mb-4 fw-bold">{siteConfig.name} Publications &amp; Guides</h1>
        <div className="row g-4">
          <div className="col-lg-12">

            {/* Toolbar: search + sort */}
            <div className="row g-4">
              <div className="col-xl-3">
                <div className="input-group w-100 mx-auto d-flex">
                  <input
                    type="search"
                    className="form-control p-3"
                    placeholder="Search guides, books & articles..."
                    aria-describedby="shop-search-icon"
                  />
                  <span id="shop-search-icon" className="input-group-text p-3">
                    <i className="fa fa-search" />
                  </span>
                </div>
              </div>
              <div className="col-6" />
              <div className="col-xl-3">
                <div className="bg-light ps-3 py-3 rounded d-flex justify-content-between mb-4">
                  <label htmlFor="shop-sort">Default Sorting:</label>
                  <select
                    id="shop-sort"
                    name="fruitlist"
                    className="border-0 form-select-sm bg-light me-3"
                  >
                    <option value="">Featured</option>
                    <option value="popularity">Most Popular</option>
                    <option value="recent">Latest Releases</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Sidebar + Products */}
            <div className="row g-4">
              <ShopSidebar />
              <ShopProducts />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
