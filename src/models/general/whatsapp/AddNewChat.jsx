import ShowSpinner from "@/components/others/ShowSpinner";
import { Button } from "@/components/ui/button";
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "@/components/ui/dialog";
import { sendWhatsappMessage } from "@/hooks/whatsapp/useWhatsapp";
import RenderIcon from "@/icons/RenderIcon";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function AddNewChat({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    to: "",
    content: "",
    messageType: "",
    name: "",
    displayNumber: false,
  });

  const [previewURL, setPreviewURL] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleMessage = useMutation({
    mutationKey: ["send-message"],
    mutationFn: (data) => sendWhatsappMessage(data, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["all-whatsapp-message-by-id"]);
      setFormData({
        to: "",
        messageType: "",
        content: "",
        name: "",
        displayPhoneNumber: "",
      });
      setPreviewURL(null);
      setSelectedFile(null);
      onClose();
    },
    onError: (data) => {
      console.log("Error sending message", data);
    },
  });

  const handleSendMessage = () => {
    const formDataObject = new FormData();

    const formattedTo = formData.to.length === 10 && `91${formData.to}`;
    formDataObject.append("to", formattedTo);

    Object.keys(formData).forEach((key) => {
      if (key !== "to") {
        formDataObject.append(key, formData[key]);
      }
    });

    if (formData?.messageType !== "text") {
      selectedFile &&
        formDataObject.append(formData?.messageType, selectedFile);
    }
    handleMessage.mutate(formDataObject);
    formDataObject.forEach((value, key) => {
      console.log(`${key}:`, value);
    });
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleSelectFile = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewURL(URL.createObjectURL(file));
    }

    if (file.type.startsWith("image/")) {
      setFormData((prev) => ({ ...prev, messageType: "image" }));
    } else {
      setFormData((prev) => ({ ...prev, messageType: "document" }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
            Add new chat
          </DialogTitle>
        </DialogHeader>

        <DialogBody>
          <>
            <div className="flex flex-col gap-4 mb-3">
              <div className="flex flex-col">
                <label htmlFor="to" className="mb-2">
                  Phone number<span className="text-red-600 ml-2">*</span>
                </label>

                <input
                  type="number"
                  placeholder="Phone number"
                  id="to"
                  name="to"
                  value={formData.to}
                  onChange={handleInputChange}
                  maxLength={10}
                  className="border-2 border-gray-300 rounded p-2 w-2/3 outline-none focus:outline-none"
                />
                {formData.to.length > 10 && (
                  <p className="text-red-500">Phone number must be 10 digits</p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-4 mb-[25px]">
              <div className="flex flex-col">
                <label htmlFor="name" className="mb-1">
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
            </div>
            {previewURL &&
              (formData?.messageType === "image" ? (
                <div className="w-[30%] ml-[10%] rounded-md flex items-center justify-end">
                  <img
                    src={previewURL}
                    alt="Sent Image"
                    // className="rounded-lg"
                  />
                  <button
                    className="ml-2 bg-red-500 text-white p-2 rounded-md"
                    onClick={() => {
                      setPreviewURL(null);
                      setSelectedFile(null);
                    }} // Remove audio on close
                  >
                    <RenderIcon
                      iconName={"DeleteIcon"}
                      size={20}
                      loading={20}
                    />
                  </button>
                </div>
              ) : (
                <div className=" w-[30%] ml-[10%] rounded-md flex items-center justify-end">
                  <iframe
                    src={previewURL}
                    className="w-full h-64"
                    title="PDF Document"
                    // key={message._id}
                  />
                  <button
                    className="ml-2 bg-red-500 text-white p-2 rounded-md"
                    onClick={() => {
                      setPreviewURL(null);
                      setSelectedFile(null);
                    }} // Remove audio on close
                  >
                    <RenderIcon
                      iconName={"DeleteIcon"}
                      size={20}
                      loading={20}
                    />
                  </button>
                </div>
              ))}
          </>

          {/* Crop Modal */}
          <div className="w-full rounded-xl rounded-tr-none rounded-tl-none mt-3 mb-5">
            <div className="flex items-center">
              <div className="h-[45px] w-[420px] flex">
                <input
                  className="text-gray-700 text-sm p-2 focus:outline-none w-full flex-grow rounded-l-md border-2 border-gray-300"
                  type="text"
                  placeholder="Type your message ..."
                  value={formData?.content}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      content: e.target.value,
                      messageType: "text",
                    })
                  }
                />
                <div className="bg-gray-100 flex justify-center items-center ml-2 p-2 rounded-r-md">
                  <button
                    className="bg-gray-300 text-white h-[40px] w-[40px] mr-2 rounded-md flex justify-center items-center"
                    onClick={handleClick}
                  >
                    <RenderIcon
                      iconName={"PaperClipIcon"}
                      size={20}
                      loading={20}
                    />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*, application/pdf"
                    style={{ display: "none" }}
                    multiple={false}
                    onChange={handleSelectFile}
                  />
                  <button
                    className="bg-teal-500 text-white h-[40px] w-[40px] rounded-md flex justify-center items-center"
                    onClick={handleSendMessage}
                  >
                    {handleMessage.isPending ? (
                      <ShowSpinner color={true} />
                    ) : (
                      <RenderIcon
                        iconName={"SendIcon"}
                        size={20}
                        loading={20}
                      />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
}

export default AddNewChat;
