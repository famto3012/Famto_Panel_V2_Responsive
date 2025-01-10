import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Select from "react-select";
import { HStack } from "@chakra-ui/react";

import {
  DialogRoot,
  DialogContent,
  DialogCloseTrigger,
  DialogHeader,
  DialogTitle,
  DialogBody,
} from "@/components/ui/dialog";
import { toaster } from "@/components/ui/toaster";
import { Radio, RadioGroup } from "@/components/ui/radio";

import ModalLoader from "@/components/others/ModalLoader";

import { getAllGeofence } from "@/hooks/geofence/useGeofence";
import { getAllBusinessCategory } from "@/hooks/customerAppCustomization/useBusinessCategory";
import { createCustomerPricing } from "@/hooks/pricing/useCustomerPricing";

import { vehicleTypeOptions } from "@/utils/defaultData";

const AddCustomerPricing = ({ isOpen, onClose, pricingId }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    vehicleType: null,
    ruleName: "",
    baseFare: "",
    baseDistance: "",
    fareAfterBaseDistance: "",
    baseWeightUpto: "",
    fareAfterBaseWeight: "",
    waitingTime: "",
    waitingFare: "",
    purchaseFarePerHour: "",
    geofenceId: "",
    deliveryMode: "Home Delivery",
    businessCategoryId: null,
  });

  const {
    data: allGeofence,
    isLoading: geofenceLoading,
    isError: geofenceError,
  } = useQuery({
    queryKey: ["all-geofence"],
    queryFn: () => getAllGeofence(navigate),
    enabled: !!isOpen,
  });

  const { data: allBusinessCategory, isLoading: categoryLoading } = useQuery({
    queryKey: ["all-businessCategory"],
    queryFn: () => getAllBusinessCategory(navigate),
    enabled: !!isOpen,
  });

  const handleAddPricing = useMutation({
    mutationKey: ["new-customer-pricing"],
    mutationFn: (formData) => createCustomerPricing(formData, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["all-customer-pricing"]);
      setFormData({
        vehicleType: null,
        ruleName: "",
        baseFare: "",
        baseDistance: "",
        fareAfterBaseDistance: "",
        baseWeightUpto: "",
        fareAfterBaseWeight: "",
        waitingTime: "",
        waitingFare: "",
        purchaseFarePerHour: "",
        geofenceId: "",
        deliveryMode: "Home Delivery",
        businessCategoryId: null,
      });
      onClose();
      toaster.create({
        title: "Success",
        description: "New rule created successfully",
        type: "success",
      });
    },
    onError: () => {
      toaster.create({
        title: "Error",
        description: "Error in creating new rule",
        type: "error",
      });
    },
  });

  const geofenceOptions = allGeofence?.map((geofence) => ({
    label: geofence.name,
    value: geofence._id,
  }));

  const businessOptions = allBusinessCategory?.map((category) => ({
    label: category.title,
    value: category._id,
  }));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const showLoading = geofenceLoading;
  const showError = geofenceError;

  return (
    <DialogRoot
      open={isOpen}
      onInteractOutside={onClose}
      placement="center"
      motionPreset="slide-in-bottom"
    >
      <DialogContent>
        <DialogCloseTrigger onClick={onClose} />
        <DialogHeader>
          <DialogTitle className="font-[600] text-[18px]">Add Rule</DialogTitle>
        </DialogHeader>

        <DialogBody>
          {showLoading ? (
            <ModalLoader />
          ) : showError ? (
            <>
              <p>Error</p>
            </>
          ) : (
            <>
              <div className="flex flex-col  max-h-[30rem] overflow-auto gap-4 ">
                <div className="flex items-center">
                  <label className="w-1/3 text-gray-500" htmlFor="ruleName">
                    Rule Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="border-2 border-gray-300 rounded p-2 w-2/3 outline-none focus:outline-none"
                    type="text"
                    placeholder="Rule Name"
                    value={formData.ruleName}
                    id="ruleName"
                    name="ruleName"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex items-center">
                  <label className="w-1/3 text-gray-500" htmlFor="baseFare">
                    Base Fare <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="border-2 border-gray-300 rounded p-2 w-2/3 outline-none focus:outline-none"
                    type="text"
                    placeholder="Base Fare"
                    value={formData.baseFare}
                    id="baseFare"
                    name="baseFare"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex items-center">
                  <label className="w-1/3 text-gray-500" htmlFor="baseDistance">
                    Base Distance <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="border-2 border-gray-300 rounded p-2 w-2/3 outline-none focus:outline-none"
                    type="text"
                    placeholder="Base Distance"
                    value={formData.baseDistance}
                    id="baseDistance"
                    name="baseDistance"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex items-center">
                  <label
                    className="w-1/3 text-gray-500"
                    htmlFor="fareAfterBaseDistance"
                  >
                    Fare After Distance <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="border-2 border-gray-300 rounded p-2 w-2/3 outline-none focus:outline-none"
                    type="text"
                    placeholder="Fare After Distance"
                    value={formData.fareAfterBaseDistance}
                    id="fareAfterBaseDistance"
                    name="fareAfterBaseDistance"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex items-center">
                  <label
                    className="w-1/3 text-gray-500"
                    htmlFor="baseWeightUpto"
                  >
                    Base Weight upto(in kg)
                  </label>
                  <input
                    className="border-2 border-gray-300 rounded p-2 w-2/3 outline-none focus:outline-none"
                    type="text"
                    placeholder="Base Weight"
                    value={formData.baseWeightUpto}
                    id="baseWeightUpto"
                    name="baseWeightUpto"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex items-center">
                  <label
                    className="w-1/3 text-gray-500"
                    htmlFor="fareAfterBaseWeight"
                  >
                    Fare after base weight
                  </label>
                  <input
                    className="border-2 border-gray-300 rounded p-2 w-2/3 outline-none focus:outline-none"
                    type="text"
                    placeholder="Fare After Weight"
                    value={formData.fareAfterBaseWeight}
                    id="fareAfterBaseWeight"
                    name="fareAfterBaseWeight"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex items-center">
                  <label
                    className="w-1/3 text-gray-500"
                    htmlFor="purchaseFarePerHour"
                  >
                    Purchase Fare Hour
                  </label>
                  <input
                    className="border-2 border-gray-300 rounded p-2 w-2/3 outline-none focus:outline-none"
                    type="text"
                    placeholder="Purchase Fare Hour"
                    value={formData.purchaseFarePerHour}
                    id="purchaseFarePerHour"
                    name="purchaseFarePerHour"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex items-center">
                  <label className="w-1/3 text-gray-500" htmlFor="waitingFare">
                    Waiting Fare
                  </label>
                  <input
                    className="border-2 border-gray-300 rounded p-2 w-2/3 outline-none focus:outline-none"
                    type="text"
                    placeholder="Waiting Fare"
                    value={formData.waitingFare}
                    id="waitingFare"
                    name="waitingFare"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex items-center">
                  <label className="w-1/3 text-gray-500" htmlFor="waitingTime">
                    Waiting Time
                  </label>
                  <input
                    className="border-2 border-gray-300 rounded p-2 w-2/3 outline-none focus:outline-none"
                    type="text"
                    placeholder="Waiting Time"
                    value={formData.waitingTime}
                    id="waitingTime"
                    name="waitingTime"
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex items-center mt-1">
                  <label className="w-1/3 text-gray-500">
                    Select Delivery Mode <span className="text-red-500">*</span>
                  </label>

                  <RadioGroup
                    value={formData.deliveryMode}
                    onValueChange={(e) =>
                      setFormData({ ...formData, deliveryMode: e.value })
                    }
                    className="w-2/3"
                    size="sm"
                    colorPalette="teal"
                    variant="solid"
                  >
                    <HStack gap="8" direction="row">
                      <Radio value="Home Delivery">Home Delivery</Radio>
                      <Radio value="Pick and Drop">Pick and Drop</Radio>
                      <Radio value="Custom Order">Custom Order</Radio>
                    </HStack>
                  </RadioGroup>
                </div>

                {formData.deliveryMode === "Home Delivery" && (
                  <div className="flex items-center">
                    <label
                      className="w-1/3 text-gray-500"
                      htmlFor="businessCategoryId"
                    ></label>

                    <Select
                      options={businessOptions}
                      value={businessOptions?.find(
                        (option) =>
                          option.value === formData?.businessCategoryId
                      )}
                      onChange={(option) =>
                        setFormData({
                          ...formData,
                          businessCategoryId: option.value,
                        })
                      }
                      className="rounded outline-none focus:outline-none w-2/3"
                      placeholder="Select business category"
                      isSearchable
                      isMulti={false}
                      menuPlacement="top"
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          paddingRight: "",
                        }),
                        dropdownIndicator: (provided) => ({
                          ...provided,
                          padding: "10px",
                        }),
                      }}
                    />
                  </div>
                )}

                {formData.deliveryMode === "Pick and Drop" && (
                  <div className="flex items-center">
                    <label
                      className="w-1/3 text-gray-500"
                      htmlFor="vehicleType"
                    ></label>

                    <Select
                      options={vehicleTypeOptions}
                      value={vehicleTypeOptions?.find(
                        (option) => option.value === formData?.vehicleType
                      )}
                      onChange={(option) =>
                        setFormData({
                          ...formData,
                          vehicleType: option.value,
                        })
                      }
                      className="rounded outline-none focus:outline-none w-2/3"
                      placeholder="Select vehicle type"
                      isSearchable
                      isMulti={false}
                      menuPlacement="top"
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          paddingRight: "",
                        }),
                        dropdownIndicator: (provided) => ({
                          ...provided,
                          padding: "10px",
                        }),
                      }}
                    />
                  </div>
                )}

                <div className="flex items-center">
                  <label className="w-1/3 text-gray-500" htmlFor="geofence">
                    Geofence <span className="text-red-500">*</span>
                  </label>

                  <Select
                    options={geofenceOptions}
                    value={geofenceOptions?.find(
                      (option) => option.value === formData.geofenceId
                    )}
                    onChange={(option) =>
                      setFormData({
                        ...formData,
                        geofenceId: option.value,
                      })
                    }
                    className="rounded outline-none focus:outline-none w-2/3"
                    placeholder="Select geofence"
                    isSearchable
                    isMulti={false}
                    menuPlacement="auto"
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        paddingRight: "",
                      }),
                      dropdownIndicator: (provided) => ({
                        ...provided,
                        padding: "10px",
                      }),
                    }}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  className="bg-cyan-50 py-2 px-4 rounded-md"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleAddPricing.mutate(formData)}
                  className="bg-teal-700 text-white py-2 px-4 rounded-md"
                >
                  {handleAddPricing.isPending ? `Saving...` : `Save`}
                </button>
              </div>
            </>
          )}
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};

export default AddCustomerPricing;
