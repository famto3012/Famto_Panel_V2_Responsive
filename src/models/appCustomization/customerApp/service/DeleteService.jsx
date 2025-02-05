import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@chakra-ui/react";

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

import { deleteService } from "@/hooks/customerAppCustomization/useService";

const DeleteService = ({ isOpen, onClose, serviceId }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleDeleteService = useMutation({
    mutationKey: ["delete-service", serviceId],
    mutationFn: () => deleteService(serviceId, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["all-service"]);
      onClose();
      toaster.create({
        title: "Success",
        description: "Service deleted successfully",
        type: "success",
      });
    },
    onError: () => {
      toaster.create({
        title: "Error",
        description: "Error while deleting service",
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
        <DialogHeader>
          <DialogTitle className="font-[600] text-[18px]">
            Delete Service
          </DialogTitle>
        </DialogHeader>

        <DialogBody>Do you want to delete this service?</DialogBody>
        <DialogFooter>
          <Button
            onClick={onClose}
            className="bg-gray-200 p-2 text-black outline-none focus:outline-none"
          >
            Cancel
          </Button>

          <Button
            className="bg-red-500 p-2 text-white"
            onClick={() => handleDeleteService.mutate()}
          >
            {handleDeleteService.isPending ? `Deleting...` : `Delete`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default DeleteService;
