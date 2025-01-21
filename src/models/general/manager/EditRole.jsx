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

const EditRole = ({ isOpen, onClose, selectedId }) => {
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
            Update Role
          </DialogTitle>
        </DialogHeader>

        <DialogBody>
          <div className="flex flex-col gap-[20px]">
            <div className="flex items-center justify-between">
              <label className="w-1/3 text-[16px]">Name</label>
              <input
                type="text"
                className="border w-2/3 p-2 rounded-md outline-none focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="w-1/3 text-[16px]">Allowed Options</label>
              <Select className="w-2/3" placeholder="Select roles" isMulti />
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

export default EditRole;
