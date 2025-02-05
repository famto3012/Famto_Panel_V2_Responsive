import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@chakra-ui/react";

import AuthContext from "@/context/AuthContext";

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

import { deleteProductDiscount } from "@/hooks/discount/useDiscount";

const DeleteProductDiscount = ({ isOpen, onClose, discountId }) => {
  const { role } = useContext(AuthContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleDeleteDiscount = useMutation({
    mutationKey: ["delete-merchant-discount", discountId],
    mutationFn: ({ role, discountId }) =>
      deleteProductDiscount(role, discountId, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["all-product-discount"]);
      onClose();
      toaster.create({
        title: "Success",
        description: "Deleted product discount successfully",
        type: "success",
      });
    },
    onError: (data) => {
      console.log(data);
      toaster.create({
        title: "Error",
        description: "Error while deleting product discount",
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
            Delete Discount
          </DialogTitle>
        </DialogHeader>

        <DialogBody>Do you want to delete this discount?</DialogBody>
        <DialogFooter>
          <Button
            onClick={onClose}
            className="bg-gray-200 p-2 text-black outline-none focus:outline-none"
          >
            Cancel
          </Button>

          <Button
            className="bg-red-500 p-2 text-white"
            onClick={() => handleDeleteDiscount.mutate({ role, discountId })}
          >
            {handleDeleteDiscount.isPending ? `Deleting...` : `Delete`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default DeleteProductDiscount;
