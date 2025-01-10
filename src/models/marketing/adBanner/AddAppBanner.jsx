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
  DialogFooter,
} from "@/components/ui/dialog";
import { toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";

import CropImage from "@/components/others/CropImage";
import ModalLoader from "@/components/others/ModalLoader";
import Error from "@/components/others/Error";

import { getAllGeofence } from "@/hooks/geofence/useGeofence";
import { createNewAppBanner } from "@/hooks/adBanner/adBanner";

import RenderIcon from "@/icons/RenderIcon";

const AddAppBanner = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    merchantId: "",
    geofenceId: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [croppedFile, setCroppedFile] = useState(null);
  const [showCrop, setShowCrop] = useState(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: allGeofence,
    isLoading: geofenceLoading,
    isError: geofenceError,
  } = useQuery({
    queryKey: ["all-geofence"],
    queryFn: () => getAllGeofence(navigate),
    enabled: isOpen,
  });

  const handleAddBanner = useMutation({
    mutationKey: ["add-app-banner"],
    mutationFn: (bannerData) => createNewAppBanner(bannerData, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["all-app-banner"]);
      setFormData({
        name: "",
        merchantId: "",
        geofenceId: "",
      });
      setCroppedFile(null);
      onClose();
      toaster.create({
        title: "Success",
        description: "New App Banner added successfully",
        type: "success",
      });
    },
    onError: () => {
      toaster.create({
        title: "Error",
        description: "Error in creating new app banner",
        type: "error",
      });
    },
  });

  const handleSave = () => {
    const formDataObject = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      formDataObject.append(key, value);
    });

    croppedFile && formDataObject.append("bannerImage", croppedFile);

    handleAddBanner.mutate(formDataObject);
  };

  const geofenceOptions = allGeofence?.map((geofence) => ({
    label: geofence.name,
    value: geofence._id,
  }));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setShowCrop(true);
    }
  };

  const handleCropImage = (file) => {
    setCroppedFile(file);
    cancelCrop();
  };

  const cancelCrop = () => {
    setSelectedFile(null);
    setShowCrop(false);
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
          <DialogTitle className="font-[600] text-[18px]">
            Add Banner
          </DialogTitle>
        </DialogHeader>

        <DialogBody>
          {showLoading ? (
            <ModalLoader />
          ) : showError ? (
            <Error />
          ) : (
            <>
              <div className="flex flex-col gap-4">
                <div className="flex items-center">
                  <label htmlFor="name" className="w-1/3">
                    Name<span className="text-red-600 ml-2">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Name"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="border-2 border-gray-300  rounded p-2 w-2/3 outline-none focus:outline-none"
                  />
                </div>

                <div className="flex items-center">
                  <label htmlFor="merchantId" className="w-1/3">
                    Merchant ID<span className="text-red-600 ml-2">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Merchant ID"
                    id="merchantId"
                    name="merchantId"
                    value={formData.merchantId}
                    onChange={handleInputChange}
                    className="border-2 border-gray-300  rounded p-2 w-2/3 outline-none focus:outline-none"
                  />
                </div>

                <div className="flex items-center">
                  <label htmlFor="geofenceId" className="w-1/3">
                    Geofence<span className="text-red-600 ml-2">*</span>
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
                    className="rounded w-2/3 outline-none focus:outline-none"
                    placeholder="Select geofence"
                    isSearchable={true}
                    isMulti={false}
                    menuPlacement="auto"
                  />
                </div>

                <div className="flex items-center mt-5">
                  <label className="w-1/3">
                    Banner Image <span className="text-red-600 ml-2">*</span>{" "}
                    <br /> (342px x 160px)
                  </label>

                  <div className="flex items-center gap-[30px]">
                    {!croppedFile ? (
                      <div className="h-[80px] w-[175px] bg-gray-200 rounded-md"></div>
                    ) : (
                      <figure>
                        <img
                          src={URL.createObjectURL(croppedFile)}
                          alt={formData.name}
                          className="h-[80px] w-[175px] rounded-md object-cover"
                        />
                      </figure>
                    )}

                    <input
                      type="file"
                      name="bannerImage"
                      id="bannerImage"
                      className="hidden"
                      accept="image/*"
                      onChange={handleSelectFile}
                    />
                    <label
                      htmlFor="bannerImage"
                      className="cursor-pointer bg-teal-700 p-5  text-white rounded-md"
                    >
                      <RenderIcon iconName="CameraIcon" size={20} loading={6} />
                    </label>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Crop Modal */}
          <CropImage
            isOpen={showCrop && selectedFile}
            onClose={() => {
              setSelectedFile(null);
              setShowCrop(false);
            }}
            aspectRatio={16 / 9}
            selectedImage={selectedFile}
            onCropComplete={handleCropImage}
          />
        </DialogBody>

        <DialogFooter>
          <Button
            onClick={onClose}
            className="bg-gray-200 p-2 text-black outline-none focus:outline-none"
          >
            Cancel
          </Button>

          <Button className="bg-teal-700 p-2 text-white" onClick={handleSave}>
            {handleAddBanner.isPending ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default AddAppBanner;
