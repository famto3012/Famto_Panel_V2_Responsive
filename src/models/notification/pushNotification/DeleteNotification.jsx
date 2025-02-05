import { Button } from "@/components/ui/button";
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
} from "@/components/ui/dialog";
import { toaster } from "@/components/ui/toaster";
import { deletePushNotification } from "@/hooks/notification/useNotification";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const DeleteNotification = ({ isOpen, onClose, selectedId }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleDeletePushNotification = useMutation({
    mutationKey: ["delete-push-notification"],
    mutationFn: ({ selectedId }) =>
      deletePushNotification({ selectedId, navigate }),
    onSuccess: () => {
      queryClient.invalidateQueries(["filter-push-notification"]);
      onClose();
      toaster.create({
        title: "Success",
        description: "Notification settings deleted successfully.",
        type: "success",
      });
    },
    onError: (error) => {
      toaster.create({
        title: "Error",
        description: error || "Failed to delete notification settings.",
        type: "error",
      });
    },
  });

  return (
    <DialogRoot
      open={isOpen}
      onInteractOutside={onClose}
      placement="center"
      motionPreset="slide-in-bottom"
    >
      <DialogContent>
        <DialogCloseTrigger onClick={onClose} />
        <DialogHeader className="text-[16px] font-[600]">
          Delete push notification
        </DialogHeader>
        <DialogBody>
          <p className="font-semibold text-[18px] mb-5">
            Are you sure you want to delete?
          </p>
        </DialogBody>
        <DialogFooter>
          <div className="flex justify-end">
            <form>
              <Button
                type="button"
                className="bg-cyan-100 px-5 py-1 rounded-md font-semibold"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                onClick={() =>
                  handleDeletePushNotification.mutate({ selectedId })
                }
                className="bg-red-700 px-5 py-1 rounded-md ml-3 text-white"
              >
                {handleDeletePushNotification.isPending
                  ? "Deleting..."
                  : "Delete"}
              </Button>
            </form>
          </div>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default DeleteNotification;
