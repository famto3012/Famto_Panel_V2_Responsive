import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import DataContext from "@/context/DataContext";

import RenderIcon from "@/icons/RenderIcon";

import { Switch } from "@/components/ui/switch";
import { toaster } from "@/components/ui/toaster";

import ShowSpinner from "@/components/others/ShowSpinner";

import {
  fetchSingleProductDetail,
  updateProductStatus,
} from "@/hooks/product/useProduct";
import AdditionalProductDetail from "@/components/product/AdditionalProductDetail";
import EditProduct from "@/models/general/product/EditProduct";
import ChangeCategory from "@/models/general/product/ChangeCategory";
import DeleteProduct from "@/models/general/product/DeleteProduct";
import EnlargeImage from "@/models/common/EnlargeImage";

const ProductDetail = ({ merchantId }) => {
  const [modal, setModal] = useState({
    edit: false,
    delete: false,
    change: false,
    enlarge: false,
  });
  const [imageLink, setImageLink] = useState(null);

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { selectedProduct, setSelectedProduct } = useContext(DataContext);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["product-detail", selectedProduct.productId],
    queryFn: () =>
      fetchSingleProductDetail(selectedProduct.productId, navigate),
    enabled: !!selectedProduct.productId,
  });

  const handleUpdateProductStatus = useMutation({
    mutationKey: ["toggle-product-status"],
    mutationFn: () => updateProductStatus(selectedProduct?.productId, navigate),
    onSuccess: () => {
      setSelectedProduct(selectedProduct);
      queryClient.invalidateQueries([
        "product-detail",
        selectedProduct.productId,
      ]);
      toaster.create({
        title: "Success",
        description: "Inventory updated successfully",
        type: "success",
      });
    },
    onError: (data) => {
      toaster.create({
        title: "Error",
        description: data?.message || "Error while updating inventory",
        type: "error",
      });
    },
  });

  const toggleModal = (type, link = null) => {
    setImageLink(link);
    setModal({ ...modal, [type]: true });
  };

  const closeModal = () => {
    setModal({
      edit: false,
      delete: false,
      change: false,
      enlarge: false,
    });
    setImageLink(null);
  };

  return (
    <div
      className={`w-full ${!data || Object?.keys(data)?.length === 0 ? "" : "border-l"} `}
    >
      {isLoading ? (
        <div className="flex justify-center items-center h-[55dvh]">
          <ShowSpinner />
        </div>
      ) : isError ? (
        <div className="flex justify-center my-3 ">
          <Error />
        </div>
      ) : !data || Object?.keys(data)?.length === 0 ? (
        <div className="flex justify-center items-center min-h-[50dvh]">
          <p>No Data available</p>
        </div>
      ) : (
        data &&
        Object?.keys(data)?.length > 0 && (
          <>
            <div className="p-5 flex items-start w-full">
              <div className="flex gap-3 items-start w-full">
                <div className="flex flex-1 gap-3">
                  <figure
                    onClick={() =>
                      toggleModal(
                        "enlarge",
                        data?.productImageURL ||
                          import.meta.env.VITE_APP_DEFAULT_PRODUCT_IMAGE
                      )
                    }
                    className="h-[90px] w-[90px] flex-shrink-0 cursor-pointer"
                  >
                    <img
                      src={
                        data?.productImageURL ||
                        import.meta.env.VITE_APP_DEFAULT_PRODUCT_IMAGE
                      }
                      alt={data?.productName}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </figure>

                  <div className="flex-1 w-5">
                    <p className="font-semibold text-wrap text-gray-800">
                      {data?.productName}
                    </p>
                    <p className="text-teal-800 font-bold">₹ {data?.price}</p>
                  </div>
                </div>

                <button
                  className="bg-yellow-200/50 p-3 font-medium rounded-lg"
                  onClick={() => toggleModal("change")}
                >
                  Change Category
                </button>
              </div>
            </div>

            <div className="flex justify-between p-5 items-center">
              <p className="font-semibold">Product Details</p>
              <div className="flex gap-5 items-center">
                Inventory
                <Switch
                  colorPalette="teal"
                  checked={data?.inventory}
                  onCheckedChange={() => handleUpdateProductStatus.mutate()}
                />
                <button
                  className="bg-blue-50 p-2 flex items-center outline-none focus:outline-none px-5 rounded-lg"
                  onClick={() => toggleModal("edit")}
                >
                  <RenderIcon iconName="EditIcon" size={16} loading={6} />
                  <span>Edit</span>
                </button>
                <button
                  className="bg-red-100 p-2 flex items-center rounded-lg px-3"
                  onClick={() => toggleModal("delete")}
                >
                  <span className="text-red-500">
                    <RenderIcon iconName="DeleteIcon" size={18} loading={6} />
                  </span>
                  Delete
                </button>
              </div>
            </div>

            <AdditionalProductDetail data={data} />
          </>
        )
      )}

      {/* Modal */}

      <EditProduct
        isOpen={modal.edit}
        onClose={closeModal}
        merchantId={merchantId}
      />

      <DeleteProduct
        isOpen={modal.delete}
        onClose={closeModal}
        merchantId={merchantId}
      />

      <ChangeCategory
        isOpen={modal.change}
        onClose={closeModal}
        merchantId={merchantId}
      />

      <EnlargeImage
        isOpen={modal.enlarge}
        onClose={closeModal}
        source={imageLink}
      />
    </div>
  );
};

export default ProductDetail;
