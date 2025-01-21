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
import Select from "react-select";
import { useState } from "react";

const EditManager = ({ isOpen, onClose, selectedId }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    assignRole: "",
    geofence: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelect = (value, type) => {
    setFormData({ ...formData, [type]: value });
  };

  const roleOptions = [];
  const geofenceOptions = [];

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
            Edit Manager
          </DialogTitle>
        </DialogHeader>

        <DialogBody>
          <div className="flex flex-col gap-[20px]">
            <div className="flex items-center">
              <label className="w-1/3 text-gray-500" htmlFor="name">
                Name
              </label>

              <input
                className="border-2 border-gray-300 rounded p-2 w-2/3 outline-none focus:outline-none"
                type="text"
                placeholder="Name"
                value={formData.name}
                name="name"
                onChange={handleInputChange}
              />
            </div>

            <div className="flex items-center">
              <label className="w-1/3 text-gray-500" htmlFor="name">
                Email
              </label>

              <input
                className="border-2 border-gray-300 rounded p-2 w-2/3 outline-none focus:outline-none"
                type="text"
                placeholder="Name"
                value={formData.email}
                name="email"
                onChange={handleInputChange}
              />
            </div>

            <div className="flex items-center">
              <label className="w-1/3 text-gray-500" htmlFor="name">
                Phone
              </label>

              <input
                className="border-2 border-gray-300 rounded p-2 w-2/3 outline-none focus:outline-none"
                type="text"
                placeholder="Name"
                value={formData.phone}
                name="phone"
                onChange={handleInputChange}
              />
            </div>

            <div className="flex items-center">
              <label className="w-1/3 text-gray-500" htmlFor="name">
                Password
              </label>

              <input
                className="border-2 border-gray-300 rounded p-2 w-2/3 outline-none focus:outline-none"
                type="text"
                placeholder="Name"
                value={formData.password}
                name="password"
                onChange={handleInputChange}
              />
            </div>

            <div className="flex items-center">
              <label className="w-1/3 text-gray-500">Assign Role</label>

              <Select
                className="w-2/3 outline-none focus:outline-none"
                value={roleOptions?.find(
                  (option) => option.value === formData.assignRole
                )}
                isClearable
                isSearchable
                onChange={(option) => handleSelect(option.value, "assignRole")}
                options={roleOptions}
                placeholder="Select Role"
              />
            </div>

            <div className="flex items-center">
              <label className="w-1/3 text-gray-500" htmlFor="name">
                Geofence
              </label>

              <Select
                className="w-2/3 outline-none focus:outline-none"
                value={geofenceOptions?.find(
                  (option) => option.value === formData.geofence
                )}
                isClearable
                isSearchable
                onChange={(option) => handleSelect(option.value, "geofence")}
                options={geofenceOptions}
                placeholder="Select Geofence"
              />
            </div>
          </div>
        </DialogBody>

        <DialogFooter>
          <Button
            onClick={onClose}
            className="bg-gray-200 p-2 text-black outline-none focus:outline-none"
          >
            Cancel
          </Button>

          <Button
            className="bg-teal-700 p-2 text-white"
            onClick={() => {}}
            disabled={false}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default EditManager;
