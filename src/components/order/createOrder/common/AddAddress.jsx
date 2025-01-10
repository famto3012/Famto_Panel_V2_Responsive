import { useState } from "react";

import RenderIcon from "@/icons/RenderIcon";

import AddAddressForm from "@/components/order/createOrder/common/AddAddressForm";

const AddAddress = ({ onNewAddress, onToggleAddAddress }) => {
  const [showForm, setShowForm] = useState(false);

  const handleToggleAddress = () => {
    onToggleAddAddress();
    setShowForm(!showForm);
  };

  return (
    <div>
      <div className="flex items-start">
        <label className="w-1/3"></label>

        <div className="w-1/2 flex flex-col justify-center">
          <button
            className=" bg-gray-200 font-semibold py-2 rounded flex justify-between items-center px-4 border border-gray-300"
            onClick={handleToggleAddress}
          >
            <span>Add Address</span>
            {!showForm ? (
              <RenderIcon iconName="PlusIcon" size={20} loading={6} />
            ) : (
              <RenderIcon iconName="CancelIcon" size={20} loading={6} />
            )}
          </button>
        </div>
      </div>

      {showForm && <AddAddressForm onAddCustomerAddress={onNewAddress} />}
    </div>
  );
};

export default AddAddress;
