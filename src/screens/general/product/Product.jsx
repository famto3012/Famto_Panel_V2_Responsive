import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Select from "react-select";

import AuthContext from "@/context/AuthContext";
import DataContext from "@/context/DataContext";

import { Switch } from "@/components/ui/switch";
import { toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";

import RenderIcon from "@/icons/RenderIcon";

import GlobalSearch from "@/components/others/GlobalSearch";

import Loader from "@/components/others/Loader";
import Error from "@/components/others/Error";

import ListCategory from "@/components/product/ListCategory";
import ListProduct from "@/components/product/ListProduct";
import ProductDetail from "@/components/product/ProductDetail";

import { fetchMerchantsForDropDown } from "@/hooks/merchant/useMerchant";
import { updateCategoryStatus } from "@/hooks/product/useProduct";
import EditCategory from "@/models/general/product/EditCategory";
import DeleteCategory from "@/models/general/product/DeleteCategory";
import CSVOperation from "@/models/general/product/CSVOperation";

const Product = () => {
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [modal, setModal] = useState({
    edit: false,
    delete: false,
    csv: false,
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { role, userId } = useContext(AuthContext);
  const { selectedCategory, setSelectedCategory } = useContext(DataContext);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["merchant-dropdown"],
    queryFn: () => fetchMerchantsForDropDown(navigate),
    enabled: role && role === "Admin",
  });

  useEffect(() => {
    if (role === "Admin" && data && data.length > 0) {
      setSelectedMerchant(data[0]._id);
    }

    if (role === "Merchant") {
      setSelectedMerchant(userId);
    }
  }, [data]);

  const merchantOptions = data?.map((merchant) => ({
    label: merchant.merchantName,
    value: merchant._id,
  }));

  const toggleModal = (type) => {
    setModal({ ...modal, [type]: true });
  };

  const closeModal = () => {
    setModal({
      edit: false,
      delete: false,
      csv: false,
    });
  };

  const handleUpdateCategoryStatus = useMutation({
    mutationKey: ["toggle-category-status"],
    mutationFn: () =>
      updateCategoryStatus(
        role,
        selectedCategory?.categoryId,
        selectedMerchant,
        navigate
      ),
    onSuccess: () => {
      setSelectedCategory({
        ...selectedCategory,
        categoryStatus: !selectedCategory.categoryStatus,
      });
      queryClient.invalidateQueries(["all-category", selectedMerchant]);
      toaster.create({
        title: "Success",
        description: "Status updated successfully",
        type: "success",
      });
    },
    onError: (data) => {
      toaster.create({
        title: "Error",
        description: data?.message || "Error while updating status",
        type: "error",
      });
    },
  });

  if (isLoading) return <Loader />;
  if (isError) return <Error />;

  return (
    <>
      <div className="bg-gray-100 min-h-full">
        <GlobalSearch />

        <div className="flex justify-between bg-white p-5 mx-[20px] mt-5 rounded-md">
          {role === "Admin" && (
            <Select
              className="w-[200px] outline-none focus:outline-none"
              value={merchantOptions?.find(
                (option) => option.value === selectedMerchant
              )}
              isSearchable
              onChange={(option) =>
                setSelectedMerchant(option ? option.value : null)
              }
              options={merchantOptions}
            />
          )}

          <div className="flex gap-3">
            <Button
              onClick={() => toggleModal("csv")}
              className="bg-cyan-100 text-black rounded-md py-2 px-4 font-semibold flex gap-[5px] items-center"
            >
              CSV
            </Button>
          </div>
        </div>

        <div className="flex">
          <ListCategory merchantId={selectedMerchant} />

          <div className="w-4/5 bg-white rounded-md m-5 ml-2">
            <div className="border-b-2 flex justify-between p-5">
              <h1 className="font-semibold flex ml-3 items-center text-[18px] capitalize">
                {selectedCategory?.categoryName}
              </h1>

              <div className="flex gap-5 items-center">
                Disabled
                <Switch
                  disabled={
                    handleUpdateCategoryStatus.isPending ||
                    !selectedCategory.categoryId
                  }
                  colorPalette="teal"
                  checked={selectedCategory?.categoryStatus}
                  onCheckedChange={() => handleUpdateCategoryStatus.mutate()}
                />
                Enable
                <Button
                  disabled={!selectedCategory.categoryId}
                  className="bg-blue-50 p-2 flex items-center gap-x-2 px-5 rounded-md"
                  onClick={() => toggleModal("edit")}
                >
                  <RenderIcon iconName="EditIcon" size={16} loading={6} />
                  <span>Edit</span>
                </Button>
                <Button
                  disabled={!selectedCategory.categoryId}
                  className="bg-red-100 p-2 flex items-center gap-x-2 rounded-md px-3"
                  onClick={() => toggleModal("delete")}
                >
                  <span className="text-red-500">
                    <RenderIcon iconName="DeleteIcon" size={18} loading={6} />
                  </span>
                  Delete
                </Button>
              </div>
            </div>

            <div className="flex">
              <ListProduct merchantId={selectedMerchant} />

              <ProductDetail merchantId={selectedMerchant} />
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <EditCategory
        isOpen={modal.edit}
        onClose={closeModal}
        merchantId={selectedMerchant}
      />

      <DeleteCategory
        isOpen={modal.delete}
        onClose={closeModal}
        merchantId={selectedMerchant}
      />

      <CSVOperation
        isOpen={modal.csv}
        onClose={closeModal}
        merchantId={selectedMerchant}
      />
    </>
  );
};

export default Product;
