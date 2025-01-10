import { Button } from "@/components/ui/button";
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { toaster } from "@/components/ui/toaster";
import {
  getSingleNotificationSettings,
  updateNotificationSettings,
} from "@/hooks/notification/useNotification";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const EditNotificationSettings = ({
  isOpen,
  onClose,
  selectedId,
}) => {
  const [notificationSettings, setNotificationSettings] = useState({
    event: "",
    title: "",
    description: "",
    admin: false,
    customer: false,
    driver: false,
    merchant: false,
    whatsapp: false,
    email: false,
    sms: false,
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();


  const { data: notificationSettingsData } = useQuery({
    queryKey: ["get-single-notification-settings", selectedId],
    queryFn: () => getSingleNotificationSettings(navigate, selectedId),
    enabled: !!selectedId,
  });

  const handleUpdateNotificationSettings = useMutation({
    mutationKey: [
      "edit-notification-settings",
      selectedId,
      notificationSettings,
    ],
    mutationFn: ({ notificationSettings }) => {
      return updateNotificationSettings({
        notificationSettings,
        navigate,
        notificationId: selectedId,
      });
    },
    onSuccess: (data) => {
      toaster.create({
        title: "Success",
        description:
          data?.message || "Notification settings updated successfully.",
        type: "success",
      });
      queryClient.invalidateQueries(["get-all-notification-settings"]);
      onClose();
    },
    onError: (error) => {
      console.log(error);
      toaster.create({
        title: "Error",
        description: error || "Error in updating notification settings.",
        type: "error",
      });
    },
  });

  const handleInputChange = (e) => {
    setNotificationSettings({
      ...notificationSettings,
      [e.target.name]: e.target.value,
    });
  };

  const handleCancel = () => {
    onClose();
  };

  const onChange = (name, value) => {
    setNotificationSettings({
      ...notificationSettings,
      [name]: value.checked,
    });
  };

  useEffect(() => {
    if (notificationSettingsData) {
      setNotificationSettings(notificationSettingsData);
    }
  }, [notificationSettingsData]);

  return (
    <DialogRoot
      open={isOpen}
      onInteractOutside={onClose}
      placement="center"
      motionPreset="slide-in-bottom"
    >
      <DialogContent>
        <DialogCloseTrigger onClick={onClose} />
        <DialogHeader className="text-[18px] font-[600]">
          Edit Notification
        </DialogHeader>
        <DialogBody>
          <div className="flex flex-col gap-4">
            {/* <div className="flex items-center">
              <label htmlFor="event" className="w-1/3 text-gray-500">
                Event<span className="text-red-500 ms-2">*</span>
              </label>

              <Select
                className="w-2/3 outline-none focus:outline-none"
                value={addNotificationSettingsOption.find(
                  (option) => option?.value === notificationSettings?.event
                )}
                name="event"
                isMulti={false}
                isSearchable={true}
                onChange={handleSelectChange}
                options={addNotificationSettingsOption}
                placeholder="Select event name"
                isClearable={false}
                required
              />
            </div> */}
            <div className="flex items-center">
              <label htmlFor="event" className="w-1/3 text-gray-500">
                Title<span className="text-red-500 ms-2">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={notificationSettings?.title}
                onChange={handleInputChange}
                className="border-2 border-gray-300 rounded p-2 w-2/3 outline-none focus:outline-none"
              />
            </div>
            <div className="flex items-center mt-4">
              <label htmlFor="description" className="text-gray-500 w-1/3">
                Description (This note will be shown in notification)
                <span className="text-red-500 ms-2">*</span>
              </label>
              <input
                type="text"
                id="description"
                name="description"
                value={notificationSettings?.description}
                onChange={handleInputChange}
                className="border-2 border-gray-300 rounded p-6 px-2 w-2/3 outline-none focus:outline-none"
              />
            </div>
          </div>
          <section className="flex gap-16">
            <div>
              <div className="flex items-center mt-9">
                <label className="text-gray-500">Admin</label>
                <Switch
                  className="ml-28"
                  onCheckedChange={(value) => onChange("admin", value)}
                  checked={notificationSettings?.admin}
                  name="admin"
                  colorPalette="teal"
                  variant="solid"
                />
              </div>
              <div className="flex items-center mt-4">
                <label className="text-gray-500">Customer App</label>
                <Switch
                  className="ml-16"
                  onCheckedChange={(value) => onChange("customer", value)}
                  checked={notificationSettings?.customer}
                  name="customer"
                  colorPalette="teal"
                  variant="solid"
                />
              </div>
              <div className="flex items-center mt-4">
                <label className="text-gray-500">Driver App</label>
                <Switch
                  className="ml-[85px]"
                  onCheckedChange={(value) => onChange("driver", value)}
                  checked={notificationSettings?.driver}
                  name="driver"
                  colorPalette="teal"
                  variant="solid"
                />
              </div>
              <div className="flex items-center mt-4">
                <label className="text-gray-500">Merchant App</label>
                <Switch
                  className="ml-16"
                  onCheckedChange={(value) => onChange("merchant", value)}
                  checked={notificationSettings?.merchant}
                  name="merchant"
                  colorPalette="teal"
                  variant="solid"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center mt-9">
                <label className="text-gray-500">Whatsapp</label>
                <Switch
                  className="ml-24"
                  onCheckedChange={(value) => onChange("whatsapp", value)}
                  checked={notificationSettings?.whatsapp}
                  name="whatsapp"
                  colorPalette="teal"
                  variant="solid"
                />
              </div>
              <div className="flex items-center mt-4">
                <label className="text-gray-500">Email</label>
                <Switch
                  className="ml-[125px]"
                  onCheckedChange={(value) => onChange("email", value)}
                  checked={notificationSettings?.email}
                  name="email"
                  colorPalette="teal"
                  variant="solid"
                />
              </div>
              <div className="flex items-center mt-4">
                <label className="text-gray-500">SMS</label>
                <Switch
                  className="ml-[130px]"
                  onCheckedChange={(value) => onChange("sms", value)}
                  checked={notificationSettings?.sms}
                  name="sms"
                  colorPalette="teal"
                  variant="solid"
                />
              </div>
            </div>
          </section>
        </DialogBody>
        <DialogFooter>
          <Button
            className="bg-cyan-50 py-2 px-4 rounded-md"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            className="bg-teal-700 text-white py-2 px-4 rounded-md"
            onClick={() =>
              handleUpdateNotificationSettings.mutate({ notificationSettings })
            }
          >
            {handleUpdateNotificationSettings.isPending ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default EditNotificationSettings;
