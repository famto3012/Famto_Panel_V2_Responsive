import useApiClient from "@/api/apiClient";

// Merchant Discounts / Shop Discounts
// ---------------------------------------
export const fetchAllMerchantDiscount = async (role, merchantId, navigate) => {
  try {
    const endPoint =
      role === "Admin"
        ? `/admin/shop-discount/get-merchant-discount-admin/${merchantId}`
        : `/merchant/shop-discount/get-merchant-discount`;

    const api = useApiClient(navigate);
    const res = await api.get(endPoint);

    return res.status === 200 ? res.data.data : [];
  } catch (err) {
    console.error(`Error in fetching all merchant discounts: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to fetch all merchant discounts"
    );
  }
};

export const createMerchantDiscount = async (role, data, navigate) => {
  try {
    const endPoint =
      role === "Admin"
        ? `/admin/shop-discount/add-merchant-discount-admin`
        : `/merchant/shop-discount/add-merchant-discount`;

    console.log("data: ", data);

    const api = useApiClient(navigate);
    const res = await api.post(endPoint, data);

    return res.status === 201 ? res.data.message : null;
  } catch (err) {
    console.error(`Error in creating new merchant discount: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to create new merchant discount"
    );
  }
};

export const updateMerchantDiscountStatus = async (
  role,
  discountId,
  navigate
) => {
  try {
    const endPoint =
      role === "Admin"
        ? `/admin/shop-discount/merchant-status-admin/${discountId}`
        : `/merchant/shop-discount/merchant-status/${discountId}`;

    const api = useApiClient(navigate);
    const res = await api.put(endPoint, {});

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    console.error(`Error in updating merchant discount status: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to update merchant discount status"
    );
  }
};

export const fetchSingleMerchantDiscount = async (discountId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(
      `/merchant/shop-discount/get-merchant-discount-id/${discountId}`
    );

    return res.status === 200 ? res.data.data : null;
  } catch (err) {
    console.error(`Error in fetching single merchant discount: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to fetch single merchant discount"
    );
  }
};

export const updateMerchantDiscount = async (
  role,
  discountId,
  data,
  navigate
) => {
  try {
    const endPoint =
      role === "Admin"
        ? `/admin/shop-discount/edit-merchant-discount-admin/${discountId}`
        : `/admin/shop-discount/edit-merchant-discount/${discountId}`;

    const api = useApiClient(navigate);
    const res = await api.put(endPoint, data);

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    console.error(`Error in updating single merchant discount: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to update single merchant discount"
    );
  }
};

export const deleteMerchantDiscount = async (role, discountId, navigate) => {
  try {
    const endPoint =
      role === "Admin"
        ? `/admin/shop-discount/delete-merchant-discount-admin/${discountId}`
        : `/admin/shop-discount/delete-merchant-discount/${discountId}`;

    const api = useApiClient(navigate);
    const res = await api.delete(endPoint);

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    console.error(`Error in deleting merchant discount: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to delete merchant discount"
    );
  }
};

// Product Discounts
// ---------------------------------------
export const fetchAllProductDiscount = async (role, merchantId, navigate) => {
  try {
    const endPoint =
      role === "Admin"
        ? `/admin/product-discount/get-product-discount-admin/${merchantId}`
        : `/merchant/product-discount/get-product-discount`;

    const api = useApiClient(navigate);
    const res = await api.get(endPoint);

    return res.status === 200 ? res.data.data : [];
  } catch (err) {
    console.error(`Error in fetching all product discounts: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to fetch all product discounts"
    );
  }
};

export const createProductDiscount = async (role, data, navigate) => {
  try {
    const endPoint =
      role === "Admin"
        ? `/admin/product-discount/add-product-discount-admin`
        : `/merchant/product-discount/add-product-discount`;

    console.log("data: ", data);

    const api = useApiClient(navigate);
    const res = await api.post(endPoint, data);

    return res.status === 201 ? res.data.message : null;
  } catch (err) {
    console.error(`Error in creating new product discount: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to create new product discount"
    );
  }
};

export const updateProductDiscountStatus = async (
  role,
  discountId,
  navigate
) => {
  try {
    const endPoint =
      role === "Admin"
        ? `/admin/product-discount/product-status-admin/${discountId}`
        : `/merchant/product-discount/product-status/${discountId}`;

    const api = useApiClient(navigate);
    const res = await api.put(endPoint, {});

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    console.error(`Error in updating product discount status: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to update product discount status"
    );
  }
};

export const fetchSingleProductDiscount = async (discountId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(
      `/merchant/product-discount/get-product-discount-id/${discountId}`
    );

    return res.status === 200 ? res.data.data : null;
  } catch (err) {
    console.error(`Error in fetching single product discount: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to fetch single product discount"
    );
  }
};

export const updateProductDiscount = async (
  role,
  discountId,
  data,
  navigate
) => {
  try {
    const endPoint =
      role === "Admin"
        ? `/admin/product-discount/edit-product-discount-admin/${discountId}`
        : `/admin/product-discount/edit-product-discount/${discountId}`;

    const api = useApiClient(navigate);
    const res = await api.put(endPoint, data);

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    console.error(`Error in updating single product discount: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to update single product discount"
    );
  }
};

export const deleteProductDiscount = async (role, discountId, navigate) => {
  try {
    const endPoint =
      role === "Admin"
        ? `/admin/product-discount/delete-product-discount-admin/${discountId}`
        : `/merchant/product-discount/delete-product-discount/${discountId}`;

    const api = useApiClient(navigate);
    const res = await api.delete(endPoint);

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    console.error(`Error in deleting product discount: ${err}`);
    throw new Error(
      err.response?.data?.message || "Failed to delete product discount"
    );
  }
};
