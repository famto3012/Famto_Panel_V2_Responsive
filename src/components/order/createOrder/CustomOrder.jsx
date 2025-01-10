import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { useMutation } from "@tanstack/react-query";

import AuthContext from "@/context/AuthContext";

import RenderIcon from "@/icons/RenderIcon";

import { toaster } from "@/components/ui/toaster";

import Map from "@/models/common/Map";

import { unitOptions } from "@/utils/defaultData";
import {
  deleteFileFromFirebase,
  uploadFileToFirebase,
} from "@/utils/imageOperation";

import AddressSelection from "@/components/order/createOrder/common/AddressSelection";
import AddAddress from "@/components/order/createOrder/common/AddAddress";
import ShowBill from "@/components/order/createOrder/common/ShowBill";

import { createInvoice } from "@/hooks/order/useOrder";

const CustomOrder = ({ data, address }) => {
  const [customOrderData, setCustomOrderData] = useState({
    latitude: null,
    longitude: null,
    items: [],
    instructionInDelivery: "",
    deliveryAddressType: null,
    deliveryAddressOtherAddressId: null,
    addedTip: "",
    newDeliveryAddress: null,
  });
  const [showMap, setShowMap] = useState(false);
  const [cartData, setCartData] = useState({});
  const [showBill, setShowBill] = useState(false);
  const [clearSignal, setClearSignal] = useState(false);

  const navigate = useNavigate();
  const { role } = useContext(AuthContext);

  useEffect(() => {
    setCustomOrderData({ ...customOrderData, ...data });
  }, [data]);

  const handlePickupLocation = (data) => {
    setCustomOrderData({
      ...customOrderData,
      latitude: data[0],
      longitude: data[1],
    });
  };

  const handleAddItem = () => {
    const newItem = { itemName: "", quantity: "", numOfUnits: "", unit: "" };
    setCustomOrderData({
      ...customOrderData,
      items: [...customOrderData.items, newItem],
    });
  };

  const handleItemChange = (index, eventOrOption) => {
    const updatedItems = [...customOrderData.items];

    if (eventOrOption.target) {
      const { name, value } = eventOrOption.target;
      updatedItems[index] = { ...updatedItems[index], [name]: value };
    } else {
      updatedItems[index] = {
        ...updatedItems[index],
        unit: eventOrOption.value,
      };
    }

    setCustomOrderData({ ...customOrderData, items: updatedItems });
  };

  const handleRemoveItem = async (index) => {
    const updatedItems = [...customOrderData.items];
    const itemToRemove = updatedItems[index];

    if (itemToRemove && itemToRemove.itemImageURL) {
      try {
        await deleteFileFromFirebase(itemToRemove.itemImageURL);
      } catch (error) {
        toaster.create({
          title: "Error",
          description: "Error while removing item",
          type: "error",
        });
      }
    }

    // Remove the item from the array
    updatedItems.splice(index, 1);

    // Update the state with the new items array
    setCustomOrderData({ ...customOrderData, items: updatedItems });
  };

  const handleImageChange = async (index, e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const itemImageURL = await uploadFileToFirebase(
          file,
          "Custom-order-item-Image"
        );

        const updatedItems = [...customOrderData.items];
        updatedItems[index] = {
          ...updatedItems[index],
          itemImageURL,
        };
        setCustomOrderData({ ...customOrderData, items: updatedItems });
      } catch (error) {
        toaster.create({
          title: "Error",
          description: "Error while uploading item image",
          type: "error",
        });
      }
    }
  };

  const handleSelectAddress = (data) => {
    setCustomOrderData({
      ...customOrderData,
      deliveryAddressType: data.type,
      deliveryAddressOtherAddressId: data.otherAddressId,
    });
  };

  const handleNewDeliveryAddress = (data) => {
    setCustomOrderData({
      ...customOrderData,
      newDeliveryAddress: data,
      deliveryAddressType: null,
      deliveryAddressOtherAddressId: null,
    });
  };

  const handleToggleNewDeliveryAddress = () => {
    setCustomOrderData({
      ...customOrderData,
      deliveryAddressType: null,
      deliveryAddressOtherAddressId: null,
    });
    setClearSignal(true);
  };

  const handleCreateInvoice = useMutation({
    mutationKey: ["custom-order-invoice"],
    mutationFn: () => createInvoice(role, customOrderData, navigate),
    onSuccess: (data) => {
      setCartData(data);
      setShowBill(true);
      toaster.create({
        title: "Success",
        description: "Invoice created successfully",
        type: "success",
      });
    },
    onError: (data) => {
      toaster.create({
        title: "Error",
        description: data?.message || "Error while creating invoice",
        type: "error",
      });
    },
  });

  return (
    <>
      <div className="bg-white mt-5 rounded">
        <div className="flex flex-col gap-6">
          <div className="flex items-start">
            <label className="w-1/3 px-6 text-gray-700" htmlFor="location">
              Search for a location
            </label>

            <div className="w-1/3">
              <div className="flex flex-col gap-y-3">
                <div className="flex gap-3 w-4/5">
                  <input
                    type="text"
                    className="h-10 ps-3 text-sm border-2 outline-none focus:outline-none rounded-md flex-1"
                    placeholder="Latitude"
                    name="latitude"
                    value={customOrderData.latitude || ""}
                    onChange={(e) =>
                      setCustomOrderData({
                        ...customOrderData,
                        latitude: e.target.value,
                      })
                    }
                    onKeyDown={(e) => {
                      const allowedKeys = [
                        "Backspace",
                        "Tab",
                        "ArrowLeft",
                        "ArrowRight",
                      ];
                      const isNumberKey = e.key >= "0" && e.key <= "9";
                      const isDot = e.key === ".";
                      const isPaste =
                        (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "v";

                      if (
                        !isNumberKey &&
                        !allowedKeys.includes(e.key) &&
                        !isDot &&
                        !isPaste
                      ) {
                        e.preventDefault();
                      }
                    }}
                  />
                  <input
                    type="text"
                    className="h-10 ps-3 text-sm border-2 outline-none focus:outline-none rounded-md flex-1"
                    placeholder="Longitude"
                    name="longitude"
                    value={customOrderData.longitude || ""}
                    onChange={(e) =>
                      setCustomOrderData({
                        ...customOrderData,
                        longitude: e.target.value,
                      })
                    }
                    onKeyDown={(e) => {
                      const allowedKeys = [
                        "Backspace",
                        "Tab",
                        "ArrowLeft",
                        "ArrowRight",
                      ];
                      const isNumberKey = e.key >= "0" && e.key <= "9";
                      const isDot = e.key === ".";
                      const isPaste =
                        (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "v";

                      if (
                        !isNumberKey &&
                        !allowedKeys.includes(e.key) &&
                        !isDot &&
                        !isPaste
                      ) {
                        e.preventDefault();
                      }
                    }}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setShowMap(true)}
                  className={`${
                    customOrderData?.latitude && customOrderData?.longitude
                      ? `bg-teal-700 text-white`
                      : `bg-transparent text-teal-700`
                  } flex items-center justify-center font-medium border border-teal-700 w-4/5 rounded-md me-auto py-2 gap-2`}
                >
                  {customOrderData?.latitude && customOrderData?.longitude ? (
                    `Location selected`
                  ) : (
                    <>
                      <span>Mark location</span>
                      <RenderIcon
                        iconName="LocationIcon"
                        size={20}
                        loading={6}
                      />
                    </>
                  )}
                </button>
              </div>

              <Map
                isOpen={showMap}
                onClose={() => setShowMap(false)}
                onLocationSelect={handlePickupLocation}
              />
            </div>
          </div>

          <div className="flex items-start mt-[30px]">
            <h1 className="w-1/3 px-6 invisible">Add Items</h1>
            <div className="w-2/3">
              <button
                className="bg-gray-300 rounded-md flex items-center justify-center font-semibold p-3 w-[40%] gap-x-2"
                onClick={handleAddItem}
              >
                <RenderIcon iconName="PlusIcon" size={20} loading={6} />
                <span>Add Item</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center w-full max-h-[500px] overflow-auto ">
            {customOrderData.items.map((item, index) => (
              <div
                key={index}
                className="w-2/3 ms-auto bg-gray-200 p-5 rounded-lg mb-4 flex flex-col gap-4"
              >
                <div className="flex items-center">
                  <label className="w-1/3">Item Name</label>
                  <input
                    type="text"
                    name="itemName"
                    value={item.itemName}
                    onChange={(e) => handleItemChange(index, e)}
                    className="flex-grow p-3 outline-none rounded-md focus:outline-none border border-gray-300"
                  />
                </div>

                <div className="flex items-center ">
                  <label className="w-1/3">Quantity</label>
                  <input
                    name="quantity"
                    type="text"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, e)}
                    onKeyDown={(e) => {
                      if (
                        !/^[0-9]$/.test(e.key) &&
                        e.key !== "Backspace" &&
                        e.key !== "Tab"
                      ) {
                        e.preventDefault();
                      }
                    }}
                    className="flex-grow p-2.5 me-3 rounded-md outline-none focus:outline-none border border-gray-300"
                  />

                  <Select
                    className="w-[100px] outline-none focus:outline-none z-10"
                    value={unitOptions.find(
                      (option) => option.value === item.unit
                    )}
                    onChange={(option) => handleItemChange(index, option)}
                    options={unitOptions}
                    placeholder="Unit"
                    menuPortalTarget={document.body}
                    styles={{
                      control: (base) => ({
                        ...base,
                        padding: "5px",
                        borderColor: "#d1d5db",
                        borderRadius: "0.375rem",
                        boxShadow: "none",
                        "&:hover": {
                          borderColor: "#a1a1aa",
                        },
                      }),
                      valueContainer: (base) => ({
                        ...base,
                        padding: "0 8px",
                      }),
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                  />
                </div>

                <div className="flex items-center">
                  <label className="w-1/3">Number of units</label>
                  <input
                    name="numOfUnits"
                    type="text"
                    value={item.numOfUnits}
                    onChange={(e) => handleItemChange(index, e)}
                    onKeyDown={(e) => {
                      if (
                        !/^[0-9]$/.test(e.key) &&
                        e.key !== "Backspace" &&
                        e.key !== "Tab"
                      ) {
                        e.preventDefault();
                      }
                    }}
                    className="flex-grow p-2.5 rounded-md outline-none focus:outline-none border border-gray-300"
                  />
                </div>

                {item.itemImageURL && (
                  <div className="flex items-center gap-4">
                    <figure className="h-20 w-20 bg-gray-400 rounded overflow-hidden">
                      <img
                        src={item.itemImageURL}
                        alt="Item image"
                        className="w-full h-full object-cover"
                      />
                    </figure>
                  </div>
                )}

                <div className="flex justify-between mt-3 gap-3">
                  <input
                    type="file"
                    name="itemImage"
                    id={`itemImage-${index}`}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleImageChange(index, e)}
                  />

                  <label
                    htmlFor={`itemImage-${index}`}
                    className="bg-gray-300 w-1/2 rounded-md p-2 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <RenderIcon iconName="PlusIcon" size={20} loading={6} />
                    Upload Photo
                  </label>

                  <button
                    className="bg-red-100 w-1/2 rounded-md p-2 flex items-center justify-center gap-2"
                    onClick={() => handleRemoveItem(index)}
                  >
                    <span className="text-red-500">
                      <RenderIcon iconName="DeleteIcon" size={20} loading={6} />
                    </span>
                    Delete Item
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-start">
            <label className="w-1/3 px-6">Instructions to Delivery Agent</label>
            <textarea
              row={5}
              className="ps-3 pt-3 text-sm border-2 w-1/2 outline-none focus:outline-none resize-y overflow-auto rounded-md"
              type="text"
              placeholder="Instruction to agent"
              id="instructionInDelivery"
              name="instructionInDelivery"
              value={customOrderData.instructionInDelivery}
              onChange={(e) =>
                setCustomOrderData({
                  ...customOrderData,
                  instructionInDelivery: e.target.value,
                })
              }
            />
          </div>

          <AddressSelection
            address={address}
            onAddressSelect={handleSelectAddress}
            clearSignal={clearSignal}
            setClearSignal={setClearSignal}
            label="Select Delivery Address"
          />

          <AddAddress
            onNewAddress={handleNewDeliveryAddress}
            onToggleAddAddress={handleToggleNewDeliveryAddress}
          />

          <div className="flex items-center">
            <label className="w-1/3 px-6 text-gray-700" htmlFor="tips">
              Tips
            </label>
            <input
              className="h-10 ps-3 text-sm border-2 w-1/2 outline-none focus:outline-none"
              type="text"
              placeholder="Add Tip"
              name="addedTip"
              value={customOrderData.addedTip}
              onChange={(e) =>
                setCustomOrderData({
                  ...customOrderData,
                  addedTip: e.target.value,
                })
              }
              onKeyDown={(e) => {
                if (
                  !/^[0-9]$/.test(e.key) &&
                  e.key !== "Backspace" &&
                  e.key !== "Tab"
                ) {
                  e.preventDefault();
                }
              }}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => handleCreateInvoice.mutate()}
            className="ms-auto me-[6rem] xl:me-[12rem] my-[30px] bg-teal-700 text-white py-2 px-4 rounded-md capitalize"
          >
            {handleCreateInvoice.isPending ? `Creating...` : `Create invoice`}
          </button>
        </div>
      </div>

      {showBill && <ShowBill data={cartData} />}
    </>
  );
};

export default CustomOrder;
