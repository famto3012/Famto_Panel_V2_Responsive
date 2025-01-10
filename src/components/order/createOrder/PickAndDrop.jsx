import { useContext, useEffect, useState } from "react";
import Select from "react-select";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import AuthContext from "@/context/AuthContext";
import DataContext from "@/context/DataContext";

import { toaster } from "@/components/ui/toaster";

import { itemTypes } from "@/utils/defaultData";

import RenderIcon from "@/icons/RenderIcon";

import AddressSelection from "@/components/order/createOrder/common/AddressSelection";
import AddAddress from "@/components/order/createOrder/common/AddAddress";
import ShowBill from "@/components/order/createOrder/common/ShowBill";

import { createInvoice } from "@/hooks/order/useOrder";

const PickAndDrop = ({ data, address }) => {
  const [pickAndDropData, setPickAndDropData] = useState({
    items: [],
    pickUpAddressType: null,
    pickUpAddressOtherAddressId: null,
    deliveryAddressType: null,
    deliveryAddressOtherAddressId: null,
    newPickupAddress: null,
    newDeliveryAddress: null,
    instructionInPickup: "",
    instructionInDelivery: "",
    addedTip: "",
    vehicleType: null,
  });
  const [cartData, setCartData] = useState({});
  const [showBill, setShowBill] = useState(false);
  const [clearSignal, setClearSignal] = useState(false);

  const { role } = useContext(AuthContext);
  const {
    setPickAddressType,
    setPickAddressId,
    setDeliveryAddressType,
    setDeliveryAddressId,
  } = useContext(DataContext);
  const navigate = useNavigate();

  useEffect(() => {
    setPickAndDropData({ ...pickAndDropData, ...data });
  }, [data]);

  const handleSelectPickAddress = (data) => {
    setPickAndDropData({
      ...pickAndDropData,
      pickUpAddressType: data.type,
      pickUpAddressOtherAddressId: data.otherAddressId,
    });
  };

  const handleSelectDropAddress = (data) => {
    setPickAndDropData({
      ...pickAndDropData,
      deliveryAddressType: data.type,
      deliveryAddressOtherAddressId: data.otherAddressId,
    });
  };

  const handleNewPickAddress = (data) => {
    setPickAndDropData({
      ...pickAndDropData,
      newPickupAddress: data,
      pickUpAddressType: null,
      pickUpAddressOtherAddressId: null,
    });
  };

  const handleToggleNewPickAddress = () => {
    setPickAndDropData({
      ...pickAndDropData,
      pickUpAddressType: null,
      pickUpAddressOtherAddressId: null,
    });
    setPickAddressType(null);
    setPickAddressId(null);
    setClearSignal(true);
  };

  const handleNewDeliveryAddress = (data) => {
    setPickAndDropData({
      ...pickAndDropData,
      newDeliveryAddress: data,
      deliveryAddressType: null,
      deliveryAddressOtherAddressId: null,
    });
  };

  const handleToggleNewDropAddress = () => {
    setPickAndDropData({
      ...pickAndDropData,
      deliveryAddressType: null,
      deliveryAddressOtherAddressId: null,
    });
    setDeliveryAddressType(null);
    setDeliveryAddressId(null);
    setClearSignal(true);
  };

  const handleAddItem = () => {
    setPickAndDropData((prevData) => ({
      ...prevData,
      items: [
        ...prevData.items,
        { length: "", width: "", height: "", weight: "", unit: "cm" },
      ],
    }));
  };

  const handleItemChange = (index, eventOrOption) => {
    setPickAndDropData((prevData) => {
      const items = [...prevData.items];

      if (eventOrOption.target) {
        const { name, value } = eventOrOption.target;
        items[index] = {
          ...items[index],
          [name]: value,
        };
      } else {
        items[index] = {
          ...items[index],
          itemName: eventOrOption.value,
        };
      }

      return {
        ...prevData,
        items,
      };
    });
  };

  const handleRemoveItem = (index) => {
    setPickAndDropData((prevData) => {
      const items = [...prevData.items];
      items.splice(index, 1);

      return {
        ...prevData,
        items,
      };
    });
  };

  const handleCreateInvoice = useMutation({
    mutationKey: ["pick-and-drop-invoice"],
    mutationFn: () => createInvoice(role, pickAndDropData, navigate),
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
      <h1 className="bg-teal-800 text-white px-6 py-4 text-xl font-semibold">
        Pick Up
      </h1>

      <div>
        <div className="flex flex-col gap-6">
          <div className="mt-5">
            <AddressSelection
              address={address}
              onAddressSelect={handleSelectPickAddress}
              clearSignal={clearSignal}
              setClearSignal={setClearSignal}
              label="Select Pickup Address"
              choose="Pick"
            />
          </div>

          <AddAddress
            onNewAddress={handleNewPickAddress}
            onToggleAddAddress={handleToggleNewPickAddress}
          />

          {data?.ifScheduled?.time && (
            <div className="flex items-center">
              <label className="w-1/3 px-6" htmlFor="orderTime">
                Order Time
              </label>
              <input
                type="text"
                name="orderTime"
                placeholder="In scheduled order, it will be filled automatically as scheduled"
                readOnly
                className="h-10 ps-3 text-sm w-1/2  outline-none focus:outline-none"
                value={data?.ifScheduled?.time}
              />
            </div>
          )}

          <div className="flex items-center">
            <label className="w-1/3 px-6" htmlFor="pickData.instructions">
              Pick Instructions (if any)
            </label>

            <textarea
              rows={3}
              name="instructionInPickup"
              placeholder="Pickup Instructions"
              className="h-10 ps-3 py-3 text-sm border-2 w-1/2 rounded-md outline-none focus:outline-none resize-y overflow-auto"
              value={pickAndDropData.instructionInPickup}
              onChange={(e) =>
                setPickAndDropData({
                  ...pickAndDropData,
                  instructionInPickup: e.target.value,
                })
              }
            />
          </div>

          <div className="flex items-center">
            <label className="w-1/3 px-6">Task Specifications</label>
            <button
              type="button"
              className="bg-zinc-200 w-1/2 rounded-md p-2 flex items-center justify-center gap-3"
              onClick={handleAddItem}
            >
              <RenderIcon iconName="PlusIcon" size={20} loading={6} />
              <span>Add Item</span>
            </button>
          </div>

          <div className="max-h-[1000px] overflow-y-auto">
            {pickAndDropData?.items?.map((item, index) => (
              <div
                key={index}
                className="bg-gray-100 mx-6 p-10 rounded-lg mb-4"
              >
                <div className="flex">
                  <label className="w-1/3">Item type</label>

                  <Select
                    className="w-1/2 outline-none focus:outline-none z-10"
                    value={itemTypes.find(
                      (option) => option.value === item.itemName
                    )}
                    isSearchable={true}
                    onChange={(option) => handleItemChange(index, option)}
                    options={itemTypes}
                    placeholder="Select item"
                    menuPortalTarget={document.body}
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                  />
                </div>
                <div className="flex mt-5">
                  <label className="w-1/3">Dimensions (in cm)</label>
                  <div className="w-1/2 gap-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        name="length"
                        value={item.length}
                        onChange={(e) => handleItemChange(index, e)}
                        className="outline-none focus:outline-none border border-gray-200 p-3 rounded w-1/3"
                        placeholder="Length (in cm)"
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
                      <input
                        type="text"
                        name="width"
                        value={item.width}
                        onChange={(e) => handleItemChange(index, e)}
                        className="outline-none focus:outline-none border border-gray-200 p-3 rounded w-1/3"
                        placeholder="Width (in cm)"
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
                      <input
                        type="text"
                        name="height"
                        value={item.height}
                        onChange={(e) => handleItemChange(index, e)}
                        className="outline-none focus:outline-none border border-gray-200 p-3 rounded w-1/3"
                        placeholder="Height (in cm)"
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
                    <div className="mt-2">
                      <input
                        type="text"
                        name="weight"
                        value={item.weight}
                        onChange={(e) => handleItemChange(index, e)}
                        className="outline-none focus:outline-none border border-gray-200 p-3 rounded w-full"
                        placeholder="Weight (in kg)"
                        onKeyDown={(e) => {
                          if (
                            !/^[0-9]$/.test(e.key) &&
                            e.key !== "Backspace" &&
                            e.key !== "Tab"
                          ) {
                            e.preventDefault();
                          }
                        }}
                        maxLength={2}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center mt-3">
                  <label htmlFor="" className="w-1/3"></label>
                  <button
                    type="button"
                    className="bg-red-200 w-1/2 rounded-md p-2 flex items-center justify-center gap-x-2"
                    onClick={() => handleRemoveItem(index)}
                  >
                    <span className="text-red-500">
                      <RenderIcon iconName="DeleteIcon" size={20} loading={6} />
                    </span>
                    <span>Remove Item</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <h1 className="bg-teal-800 text-white px-6 py-4 text-xl font-semibold mt-[40px]">
          Drop Off
        </h1>

        <div className="flex flex-col gap-6">
          <div className="mt-5">
            <AddressSelection
              address={address}
              onAddressSelect={handleSelectDropAddress}
              clearSignal={clearSignal}
              setClearSignal={setClearSignal}
              label="Select Delivery Address"
              choose="Delivery"
            />
          </div>

          <AddAddress
            onNewAddress={handleNewDeliveryAddress}
            onToggleAddAddress={handleToggleNewDropAddress}
          />

          {data?.deliveryTime && (
            <div className="flex items-center">
              <label className="w-1/3 px-6" htmlFor="deliveryTime">
                Delivery Time
              </label>
              <input
                type="text"
                name="deliveryTime"
                readOnly
                placeholder="In scheduled order, it will be filled automatically as scheduled"
                className="h-10 ps-3 text-sm w-1/2  outline-none focus:outline-none"
                value={data?.deliveryTime}
              />
            </div>
          )}

          <div className="flex items-start">
            <label className="w-1/3 px-6">Drop Instructions (if any)</label>
            <textarea
              rows={3}
              name="instructionInDelivery"
              placeholder="Delivery Instructions"
              className="h-10 ps-3 py-3 text-sm border-2 w-1/2 rounded-md outline-none focus:outline-none resize-y overflow-auto"
              value={pickAndDropData.instructionInDelivery}
              onChange={(e) =>
                setPickAndDropData({
                  ...pickAndDropData,
                  instructionInDelivery: e.target.value,
                })
              }
            />
          </div>

          <div className="flex items-center">
            <label className="w-1/3 px-6" htmlFor="dropData.addedTip">
              Add Tip
            </label>
            <input
              type="text"
              name="addedTip"
              pattern="[0-9]"
              placeholder="Tip for the delivery"
              className="h-10 ps-3 text-sm border-2 w-1/2 rounded-md outline-none focus:outline-none"
              value={pickAndDropData.addedTip}
              onChange={(e) =>
                setPickAndDropData({
                  ...pickAndDropData,
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

          <div className="flex items-center">
            <label className="w-1/3 px-6" htmlFor="dropData.addedTip">
              Vehicle type
            </label>
            {["Bike", "Scooter"].map((vehicle, index) => (
              <button
                key={index}
                type="button"
                className={`py-2 px-4 rounded border me-2 ${
                  pickAndDropData.vehicleType === vehicle
                    ? "bg-gray-300"
                    : "bg-white"
                }`}
                onClick={() =>
                  setPickAndDropData({
                    ...pickAndDropData,
                    vehicleType: vehicle,
                  })
                }
              >
                {vehicle}
              </button>
            ))}
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

export default PickAndDrop;
