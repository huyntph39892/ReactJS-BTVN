import React, { useEffect, useState } from "react";
import UseQueryParams from "../hooks/useQueryParams.js";
import useFetchListWithParams from "../hooks/useFetchListWithParams.js";
import useDebouce from "../hooks/useDebouce.js";

const ProductList = () => {
  const [params, updateParams, resetParams] = UseQueryParams({
    search: "",
    skip: 0,
    limit: 12,
    sortBy: "",
    order: "",
  });

  const [products, loading, error] = useFetchListWithParams("products", params);
  const [search, setSearch] = useState(params.search);
  const debounceSearch = useDebouce(search);

  const currentPage = Math.floor(params.skip / params.limit) + 1;

  useEffect(() => {
    updateParams({
      ...params,
      search: debounceSearch,
      skip: 0,
    });
  }, [debounceSearch]);

  const handlePage = (newPage) => {
    if (newPage < 1) return;
    updateParams({
      ...params,
      skip: (newPage - 1) * params.limit,
    });
  };

  const handleLimit = (e) => {
    const newLimit = parseInt(e.target.value, 10);
    if (!isNaN(newLimit)) {
      updateParams({
        ...params,
        limit: newLimit,
        skip: 0,
      });
    }
  };

  const handleSearch = (e) => setSearch(e.target.value);

  const handleSortPrice = (e) => {
    const value = e.target.value;
    updateParams({
      ...params,
      order: value || "",
      sortBy: value ? "price" : "",
      skip: 0,
    });
  };

  const handleSortTitle = (e) => {
    const value = e.target.value;
    updateParams({
      ...params,
      order: value || "",
      sortBy: value ? "title" : "",
      skip: 0,
    });
  };

  if (error) return <div className="alert alert-danger">Error...</div>;

  return (
    <div className="container py-4">
      <div className="row g-3 mb-4 align-items-end">
        <div className="col-md-4 mb-2">
          <input
            value={search}
            onChange={handleSearch}
            type="text"
            className="form-control"
            placeholder="Tìm kiếm sản phẩm..."
          />
        </div>

        <div className="col-md-4 mb-2">
          <select onChange={handleSortPrice} className="form-select">
            <option value="">Sắp xếp theo giá</option>
            <option value="desc">Cao → Thấp</option>
            <option value="asc">Thấp → Cao</option>
          </select>
        </div>

        <div className="col-md-4 mb-2">
          <select onChange={handleSortTitle} className="form-select">
            <option value="">Sắp xếp theo tên</option>
            <option value="asc">Từ A → Z</option>
            <option value="desc">Từ Z → A</option>
          </select>
        </div>
      </div>

      <div className="row mb-3 justify-content-between align-items-center">
        <div className="col-auto">
          <nav>
            <ul className="pagination mb-0">
              <li className="page-item">
                <button
                  className="page-link"
                  onClick={() => handlePage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  &laquo;
                </button>
              </li>
              <li className="page-item active">
                <span className="page-link">{currentPage}</span>
              </li>
              <li className="page-item">
                <button
                  className="page-link"
                  onClick={() => handlePage(currentPage + 1)}
                >
                  &raquo;
                </button>
              </li>
            </ul>
          </nav>
        </div>

        <div className="col-auto">
          <select
            className="form-select form-select-sm"
            onChange={handleLimit}
            value={params.limit}
          >
            <option disabled>Chọn số sản phẩm/trang</option>
            <option value="12">12</option>
            <option value="24">24</option>
            <option value="36">36</option>
            <option value="48">48</option>
          </select>
        </div>
      </div>

      <div className="row">
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          products.map((item) => (
            <div
              key={item.id}
              className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
            >
              <div className="card h-100 shadow-sm">
                <img
                  src={item.thumbnail}
                  className="card-img-top"
                  alt={item.title}
                />
                <div className="card-body">
                  <h5 className="card-title">{item.title}</h5>
                  <p className="card-text">${item.price}</p>
                  <a href="#" className="btn btn-outline-primary btn-sm">
                    Xem chi tiết
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductList;
