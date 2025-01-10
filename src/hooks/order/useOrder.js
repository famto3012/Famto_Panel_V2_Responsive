import useApiClient from "@/api/apiClient";

export const fetchAllOrders = async (role, filter, page, limit, navigate) => {
  try {
    const api = useApiClient(navigate);

    let route;

    if (filter.selectedOption === "order" && role === "Admin") {
      route = `/orders/admin/get-orders`;
    } else if (filter.selectedOption === "order" && role === "Merchant") {
      route = `/orders/get-orders`;
    } else if (filter.selectedOption !== "order" && role === "Admin") {
      route = `/orders/admin/get-scheduled-orders`;
    } else if (filter.selectedOption !== "order" && role === "Merchant") {
      route = `/orders/get-scheduled-orders`;
    }

    const res = await api.get(route, {
      params: {
        page,
        limit,
        status: filter.status,
        paymentMode: filter.paymentMode,
        deliveryMode: filter.deliveryMode,
        startDate: filter.date[0]
          ? filter.date[0].toLocaleDateString("en-CA")
          : null,
        endDate: filter.date[1]
          ? filter.date[1].toLocaleDateString("en-CA")
          : null,
        merchantId: filter.selectedMerchant,
        orderId: filter.orderId,
      },
    });

    return res.status === 200 ? res.data : [];
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to fetch orders.");
  }
};

export const acceptOrder = async (orderId, role, navigate) => {
  try {
    const route =
      role === "Admin"
        ? `/orders/admin/confirm-order/${orderId}`
        : `/orders/confirm-order/${orderId}`;

    const api = useApiClient(navigate);
    const res = await api.patch(route, {});

    return res.status === 200 ? res.data : [];
  } catch (err) {
    throw err.response?.data?.message || "Failed to accept order.";
  }
};

export const rejectOrder = async (orderId, role, navigate) => {
  try {
    const route =
      role === "Admin"
        ? `/orders/admin/reject-order/${orderId}`
        : `/orders/reject-order/${orderId}`;

    const api = useApiClient(navigate);
    const res = await api.put(route, {});

    return res.status === 200 ? res.data : [];
  } catch (err) {
    throw err.response?.data?.message || "Failed to reject order.";
  }
};

export const markOrderAsReady = async (orderId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.put(`/orders/mark-as-ready/${orderId}`, {});

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    throw err.response?.data?.message || "Failed to mark order as ready";
  }
};

export const markOrderAsCompleted = async (orderId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.put(`/orders/mark-as-completed/${orderId}`, {});

    return res.status === 200 ? res.data.message : null;
  } catch (err) {
    throw err.response?.data?.message || "Failed to mark order as completed";
  }
};

export const getOrderDetail = async (orderId, role, navigate) => {
  try {
    const isStandardOrder = orderId.startsWith("O");

    // Dynamically set the route based on the order type and role
    const route = isStandardOrder
      ? role === "Admin"
        ? `/orders/admin/${orderId}`
        : `/orders/${orderId}`
      : role === "Admin"
        ? `/orders/admin/scheduled-order/${orderId}`
        : `/orders/scheduled-order/${orderId}`;

    const api = useApiClient(navigate);
    const res = await api.get(route);

    return res.status === 200 ? res.data.data : {};
  } catch (err) {
    console.error("Error in getOrderDetail:", err?.response?.data || err);
    throw new Error(
      err?.response?.data?.message || "Failed to fetch order detail."
    );
  }
};

export const searchCustomerForOrder = async (role, query, navigate) => {
  try {
    const api = useApiClient(navigate);

    const route =
      role === "Admin"
        ? `/admin/customers/search-for-order?query=${query}`
        : `/admin/customers/search-customer-of-merchant-for-order?query=${query}`;

    const res = await api.get(route);

    return res.status === 200 ? res.data.data : [];
  } catch (err) {
    throw new Error(
      err.response?.data?.message || "Failed to search customers for ordering."
    );
  }
};

export const searchMerchantForOrder = async (query, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(`/merchants/admin/search?query=${query}`);

    return res.status === 200 ? res.data.data : [];
  } catch (err) {
    throw new Error(
      err.response?.data?.message || "Failed to search merchants for ordering."
    );
  }
};

export const searchProductToOrder = async (
  merchantId,
  categoryId,
  query,
  navigate
) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(
      `/customers/search-products/${merchantId}/${categoryId}?query=${query}`
    );

    return res.status === 200 ? res.data.data : [];
  } catch (err) {
    throw new Error(
      err.response?.data?.message || "Failed to search products for ordering."
    );
  }
};

export const createInvoice = async (role, data, navigate) => {
  try {
    const route =
      role === "Admin"
        ? `/orders/admin/create-order-invoice`
        : `/orders/create-order-invoice`;

    const api = useApiClient(navigate);
    const res = await api.post(route, data);

    return res.status === 200 ? res.data.data : {};
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to create invoice.");
  }
};

export const createOrder = async (role, data, navigate) => {
  try {
    const route =
      role === "Admin" ? `/orders/admin/create-order` : `/orders/create-order`;

    const api = useApiClient(navigate);
    const res = await api.post(route, data);

    return res.status === 201 ? res.data.message : null;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to create order.");
  }
};

export const fetchMapplsAuthToken = async (navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(`/token/get-auth-token`);

    return res.status === 200 ? res.data.data : null;
  } catch (err) {
    throw new Error(
      err.response?.data?.message || "Failed to fetch mappls token"
    );
  }
};

export const downloadOrderCSV = async (role, filter, navigate) => {
  try {
    const route =
      role === "Admin"
        ? `/orders/admin/download-csv`
        : `/orders/download-order-csv`;

    const api = useApiClient(navigate);
    const res = await api.get(route, {
      params: {
        type: filter.selectedOption,
        status: filter.status,
        paymentMode: filter.paymentMode,
        deliveryMode: filter.deliveryMode,
        startDate: filter.date[0]
          ? filter.date[0].toLocaleDateString("en-CA")
          : null,
        endDate: filter.date[1]
          ? filter.date[1].toLocaleDateString("en-CA")
          : null,
        orderId: filter.orderId,
      },
      responseType: "blob",
    });

    return res.status === 200 ? res.data : null;
  } catch (err) {
    throw new Error(
      err.response?.data?.message || "Failed to download order csv"
    );
  }
};

export const fetchAvailableBusinessCategoriesOfMerchant = async (navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.get(`/orders/available-business-categories`);

    return res.status === 200 ? res.data.data : [];
  } catch (err) {
    throw new Error(
      err.response?.data?.message || "Failed to fetch available categories"
    );
  }
};

export const downloadInvoiceBill = async (cartId, deliveryMode, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.post(
      `/orders/download-invoice-bill`,
      { cartId, deliveryMode },
      {
        responseType: "blob",
      }
    );

    return res.status === 200 ? res.data : null;
  } catch (err) {
    throw err.response?.data?.message || "Failed to download invoice bill";
  }
};

export const fetchPolylineFromPickupToDelivery = async ({
  navigate,
  pickupLat,
  pickupLng,
  deliveryLat,
  deliveryLng,
}) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.post(`/admin/map/get-polyline`, {
      pickupLat,
      pickupLng,
      deliveryLat,
      deliveryLng,
    });

    return res.status === 200 ? res.data.routes[0].geometry.coordinates : [];
  } catch (err) {
    throw new Error(
      err.response?.data?.message || "Failed to fetch polyline for map"
    );
  }
};

export const downloadOrderBill = async (orderId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.post(
      `/orders/download-order-bill`,
      { orderId },
      {
        responseType: "blob",
      }
    );

    return res.status === 200 ? res.data : null;
  } catch (err) {
    throw err.response?.data?.message || "Failed to download order bill";
  }
};

export const markScheduledOrderAsViewed = async (orderId, userId, navigate) => {
  try {
    const api = useApiClient(navigate);
    const res = await api.put(
      `/orders/scheduled-order-view/${orderId}/${userId}`,
      {}
    );

    return res.status === 200 ? res.data : null;
  } catch (err) {
    throw (
      err.response?.data?.message || "Failed to mark scheduled order as viewed."
    );
  }
};
