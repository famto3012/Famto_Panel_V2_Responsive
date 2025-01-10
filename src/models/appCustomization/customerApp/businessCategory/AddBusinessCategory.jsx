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

import RenderIcon from "@/icons/RenderIcon";

import ModalLoader from "@/components/others/ModalLoader";
import Error from "@/components/others/Error";
import CropImage from "@/components/others/CropImage";

import { getAllGeofence } from "@/hooks/geofence/useGeofence";
import { createNewBusinessCategory } from "@/hooks/customerAppCustomization/useBusinessCategory";

const AddBusinessCategory = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    geofenceId: [],
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

  const handleAddCategory = useMutation({
    mutationKey: ["add-business-category"],
    mutationFn: (data) => createNewBusinessCategory(data, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["all-businessCategory"]);
      setFormData({
        title: "",
        geofenceId: [],
      });
      setCroppedFile(null);
      onClose();
      toaster.create({
        title: "Success",
        description: "New business category created successfully",
        type: "success",
      });
    },
    onError: (error) => {
      const errorData = error || { message: "An unexpected error occurred" };

      const formattedErrors = Object.entries(errorData)
        .map(([_, msg]) => `• ${msg}`)
        .join("\n");

      toaster.create({
        title: "Error",
        description: formattedErrors,
        type: "error",
      });
    },
  });

  const handleSave = () => {
    const formDataObject = new FormData();

    Object.keys(formData).forEach((key) => {
      if (Array.isArray(formData[key])) {
        formData[key].forEach((item) => {
          formDataObject.append(key, item);
        });
      } else {
        formDataObject.append(key, formData[key]);
      }
    });

    croppedFile && formDataObject.append("bannerImage", croppedFile);

    handleAddCategory.mutate(formDataObject);
  };

  const geofenceOptions = allGeofence?.map((geofence) => ({
    label: geofence.name,
    value: geofence._id,
  }));

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
            Add Business category
          </DialogTitle>
        </DialogHeader>

        <DialogBody>
          {geofenceLoading ? (
            <ModalLoader />
          ) : geofenceError ? (
            <Error />
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <label className="w-1/2 text-gray-500">Service title</label>
                <input
                  type="text"
                  className="border-2 border-gray-300 rounded p-2 focus:outline-none w-2/3"
                  name="title"
                  value={formData?.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="w-1/2 text-gray-500">Geofence</label>

                <Select
                  className="w-2/3 outline-none focus:outline-none"
                  value={geofenceOptions?.filter((option) =>
                    formData?.geofenceId?.includes(option.value)
                  )}
                  isMulti={true}
                  isSearchable={true}
                  onChange={(selectedOptions) =>
                    setFormData((prev) => ({
                      ...prev,
                      geofenceId:
                        selectedOptions?.map((option) => option.value) || [],
                    }))
                  }
                  options={geofenceOptions}
                  placeholder="Select geofence"
                  isClearable={true}
                />
              </div>

              <div className="flex items-start">
                <label className="w-1/2 text-gray-500">
                  Image (342px x 160px)
                </label>

                <div className="flex items-center w-2/3 gap-[30px]">
                  {!croppedFile ? (
                    <div className="bg-gray-400 h-16 w-16 rounded-md" />
                  ) : (
                    <figure className="h-16 w-16 rounded-md">
                      <img
                        src={URL.createObjectURL(croppedFile)}
                        alt={formData?.title}
                        className="h-full w-full object-cover rounded-md"
                      />
                    </figure>
                  )}

                  <input
                    type="file"
                    name="businessImage"
                    id="businessImage"
                    className="hidden"
                    accept="image/*"
                    onChange={handleSelectFile}
                  />
                  <label
                    htmlFor="businessImage"
                    className="cursor-pointer bg-teal-800 text-white flex items-center justify-center h-16 w-16 rounded"
                  >
                    <RenderIcon iconName="CameraIcon" size={24} loading={6} />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Crop Modal */}
          <CropImage
            isOpen={showCrop && selectedFile}
            onClose={() => {
              setSelectedFile(null);
              setShowCrop(false);
            }}
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
            {handleAddCategory.isPending ? `Saving...` : `Save`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
  s;
};

export default AddBusinessCategory;
