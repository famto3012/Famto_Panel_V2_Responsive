import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Select from "react-select";

import {
  DialogRoot,
  DialogContent,
  DialogCloseTrigger,
  DialogHeader,
  DialogTitle,
  DialogBody,
} from "@/components/ui/dialog";
import { toaster } from "@/components/ui/toaster";

import ModalLoader from "@/components/others/ModalLoader";

import { getAllGeofence } from "@/hooks/geofence/useGeofence";
import { createNewAgentPricing } from "@/hooks/pricing/useAgentPricing";

const AddAgentPricing = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    ruleName: "",
    baseFare: "",
    baseDistanceFarePerKM: "",
    waitingFare: "",
    waitingTime: "",
    purchaseFarePerHour: "",
    minLoginHours: "",
    minOrderNumber: "",
    fareAfterMinLoginHours: "",
    fareAfterMinOrderNumber: "",
    geofenceId: "",
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

  const handleAddPricing = useMutation({
    mutationKey: ["new-agent-pricing"],
    mutationFn: (formData) => createNewAgentPricing(formData, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["all-agent-pricing"]);
      setFormData({
        ruleName: "",
        baseFare: "",
        baseDistanceFarePerKM: "",
        waitingFare: "",
        waitingTime: "",
        purchaseFarePerHour: "",
        minLoginHours: "",
        minOrderNumber: "",
        fareAfterMinLoginHours: "",
        fareAfterMinOrderNumber: "",
        geofenceId: "",
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
              <div className="flex flex-col max-h-[30rem] overflow-auto gap-4">
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
                  <label
                    className="w-1/3 text-gray-500"
                    htmlFor="baseDistanceFarePerKM"
                  >
                    Base Distance fare per KM{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="border-2 border-gray-300 rounded p-2 w-2/3 outline-none focus:outline-none"
                    type="text"
                    placeholder="Base Distance"
                    value={formData.baseDistanceFarePerKM}
                    id="baseDistanceFarePerKM"
                    name="baseDistanceFarePerKM"
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex items-center">
                  <label className="w-1/3 text-gray-500" htmlFor="waitingTime">
                    Waiting Time (minutes)
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
                  <label
                    className="w-1/3 text-gray-500"
                    htmlFor="purchaseFarePerHour"
                  >
                    Minimum login hours <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="border-2 border-gray-300 rounded p-2 w-2/3 outline-none focus:outline-none"
                    type="text"
                    placeholder="Purchase Fare Hour"
                    value={formData.minLoginHours}
                    name="minLoginHours"
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex items-center">
                  <label
                    className="w-1/3 text-gray-500"
                    htmlFor="purchaseFarePerHour"
                  >
                    Minimum order number <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="border-2 border-gray-300 rounded p-2 w-2/3 outline-none focus:outline-none"
                    type="text"
                    placeholder="Purchase Fare Hour"
                    value={formData.minOrderNumber}
                    name="minOrderNumber"
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex items-center">
                  <label
                    className="w-1/3 text-gray-500"
                    htmlFor="purchaseFarePerHour"
                  >
                    Fare after minimum login hours
                  </label>
                  <input
                    className="border-2 border-gray-300 rounded p-2 w-2/3 outline-none focus:outline-none"
                    type="text"
                    placeholder="Purchase Fare Hour"
                    value={formData.fareAfterMinLoginHours}
                    name="fareAfterMinLoginHours"
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex items-center">
                  <label
                    className="w-1/3 text-gray-500"
                    htmlFor="purchaseFarePerHour"
                  >
                    Fare after minimum order number
                  </label>
                  <input
                    className="border-2 border-gray-300 rounded p-2 w-2/3 outline-none focus:outline-none"
                    type="text"
                    placeholder="Purchase Fare Hour"
                    value={formData.fareAfterMinOrderNumber}
                    name="fareAfterMinOrderNumber"
                    onChange={handleInputChange}
                  />
                </div>

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
                    isSearchable={true}
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
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  className="bg-cyan-50 py-2 px-4 rounded-md"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  className="bg-teal-700 text-white py-2 px-4 rounded-md"
                  onClick={() => handleAddPricing.mutate(formData)}
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

export default AddAgentPricing;
