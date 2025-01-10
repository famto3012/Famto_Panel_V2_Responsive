import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { useQuery } from "@tanstack/react-query";

import AuthContext from "@/context/AuthContext";

import GlobalSearch from "@/components/others/GlobalSearch";

import RenderIcon from "@/icons/RenderIcon";

import "react-datepicker/dist/react-datepicker.css";

import { fetchMerchantsForDropDown } from "@/hooks/merchant/useMerchant";

import MerchantSubLog from "@/components/commAndSubs/MerchantSubLog";
import CustomerSubLog from "@/components/commAndSubs/CustomerSubLog";

const SubscriptionLog = () => {
  const [selected, setSelected] = useState("Merchant");
  const [customerFilter, setCustomerFilter] = useState({
    name: "",
    date: null,
  });
  const [merchantFilter, setMerchantFilter] = useState({
    name: "",
    date: null,
    merchantId: null,
  });
  const [customerDebounce, setCustomerDebounce] = useState("");
  const [merchantDebounce, setMerchantDebounce] = useState("");

  const navigate = useNavigate();
  const { role, userId } = useContext(AuthContext);

  const { data: allMerchants } = useQuery({
    queryKey: ["merchant-dropdown"],
    queryFn: () => fetchMerchantsForDropDown(navigate),
    enabled: selected === "Merchant",
  });

  const merchantOptions = [
    { label: "All", value: "all" },
    ...(Array.isArray(allMerchants)
      ? allMerchants.map((merchant) => ({
          label: merchant.merchantName,
          value: merchant._id,
        }))
      : []),
  ];

  useEffect(() => {
    if (role === "Merchant") {
      setMerchantFilter({ ...merchantFilter, merchantId: userId });
    }
  }, [role]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setCustomerFilter((prevFilter) => ({
        ...prevFilter,
        name: customerDebounce,
      }));
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [customerDebounce]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setMerchantFilter((prevFilter) => ({
        ...prevFilter,
        name: merchantDebounce,
      }));
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [merchantDebounce]);

  return (
    <div className="bg-gray-100 h-full">
      <GlobalSearch />

      <div className="flex justify-between items-center mx-[30px]">
        <div className="flex items-center">
          <span onClick={() => navigate("/comm-and-subs")}>
            <RenderIcon iconName="LeftArrowIcon" size={16} loading={6} />
          </span>

          <span className="text-lg font-semibold ml-3">Subscription log</span>
        </div>
      </div>

      <div className="mx-[30px] my-5">
        <div
          className={`flex items-center bg-white p-4 rounded-md ${
            role === "Admin" ? "justify-between" : "justify-end pe-4"
          }`}
        >
          {role === "Admin" && (
            <label className="flex outline-none cursor-pointer bg-transparent border border-black p-1 rounded-full">
              <span
                onClick={() => setSelected("Merchant")}
                className={`px-4 py-2 transition-colors duration-300 rounded-full ${
                  selected === "Merchant" && "bg-teal-700 text-white"
                }`}
              >
                Merchant
              </span>

              <span
                onClick={() => setSelected("Customer")}
                className={`px-4 py-2 transition-colors duration-300 rounded-full ${
                  selected === "Customer" && "bg-teal-700 text-white"
                }`}
              >
                Customer
              </span>
            </label>
          )}

          {selected === "Customer" ? (
            <div className="flex items-center gap-[30px]">
              <DatePicker
                selected={customerFilter.date}
                onChange={(date) =>
                  setCustomerFilter({ ...customerFilter, date: date })
                }
                dateFormat="yyyy/MM/dd"
                withPortal
                className="cursor-pointer "
                customInput={
                  <span className="text-gray-400">
                    <RenderIcon iconName="CalendarIcon" size={24} loading={2} />
                  </span>
                }
              />

              <div className="flex justify-end">
                <input
                  type="search"
                  placeholder="Search customer name"
                  className="bg-white border p-3 rounded-full w-[200px] text-sm focus:outline-none "
                  value={customerDebounce}
                  onChange={(e) => setCustomerDebounce(e.target.value)}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-[30px]">
              {role === "Admin" && (
                <Select
                  className="w-[200px]"
                  value={merchantOptions?.find(
                    (option) => option.value === merchantFilter
                  )}
                  isSearchable={true}
                  options={merchantOptions}
                  placeholder="Select Merchant"
                  onChange={(option) =>
                    setMerchantFilter({
                      ...merchantFilter,
                      merchantId: option.value,
                    })
                  }
                />
              )}

              <DatePicker
                selected={merchantFilter.date}
                onChange={(date) =>
                  setMerchantFilter({ ...merchantFilter, date: date })
                }
                dateFormat="yyyy/MM/dd"
                withPortal
                className="cursor-pointer "
                customInput={
                  <span className="text-gray-400">
                    <RenderIcon iconName="CalendarIcon" size={24} loading={2} />
                  </span>
                }
              />

              {role === "Admin" && (
                <input
                  type="search"
                  placeholder="Search merchant name"
                  className="bg-white border p-3 rounded-full w-[200px] text-sm focus:outline-none "
                  value={merchantDebounce}
                  onChange={(e) => setMerchantDebounce(e.target.value)}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {selected === "Merchant" ? (
        <MerchantSubLog selected={selected} filter={merchantFilter} />
      ) : (
        <CustomerSubLog selected={selected} filter={customerFilter} />
      )}
    </div>
  );
};

export default SubscriptionLog;
