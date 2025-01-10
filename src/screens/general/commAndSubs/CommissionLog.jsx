import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import Select from "react-select";
import DatePicker from "react-datepicker";

import { HStack, Table } from "@chakra-ui/react";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@/components/ui/pagination";

import AuthContext from "@/context/AuthContext";

import RenderIcon from "@/icons/RenderIcon";

import GlobalSearch from "@/components/others/GlobalSearch";

import { fetchCommissionLogs } from "@/hooks/commAndSubs/useCommission";
import { fetchMerchantsForDropDown } from "@/hooks/merchant/useMerchant";

import ShowSpinner from "@/components/others/ShowSpinner";
import Error from "@/components/others/Error";

import "react-datepicker/dist/react-datepicker.css";
import ConfirmCommissionPayment from "@/models/general/commAndSubs/ConfirmCommissionPayment";

const CommissionLog = () => {
  const [filter, setFilter] = useState({
    date: null,
    merchantId: null,
    merchantName: "",
  });
  const [debouncedName, setDebouncedName] = useState(filter.merchantName);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [allLogs, setAllLogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const limit = 50;

  const navigate = useNavigate();
  const { role, userId } = useContext(AuthContext);

  const {
    data: logData,
    isLoading: logsLoading,
    isError: logsError,
  } = useQuery({
    queryKey: ["commission-logs", filter, page],
    queryFn: () =>
      fetchCommissionLogs(filter, role, userId, page, limit, navigate),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    logData?.data && setAllLogs(logData.data);
    logData?.pagination && setPagination(logData.pagination);
  }, [logData]);

  const {
    data: allMerchants,
    isLoading: merchantLoading,
    isError: merchantError,
  } = useQuery({
    queryKey: ["merchant-dropdown"],
    queryFn: () => fetchMerchantsForDropDown(navigate),
    enabled: role === "Admin" ? true : false,
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
    const handler = setTimeout(() => {
      setFilter((prevFilter) => ({
        ...prevFilter,
        merchantName: debouncedName,
      }));
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [debouncedName]);

  const toggleModal = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedId(null);
    setShowModal(false);
  };

  const showLoading = logsLoading || merchantLoading;
  const showError = logsError || merchantError;

  return (
    <div className="bg-gray-100 h-full">
      <GlobalSearch />

      <>
        <div className="flex items-center ms-[30px]">
          <span
            onClick={() => navigate("/comm-and-subs")}
            className=" cursor-pointer"
          >
            <RenderIcon iconName="LeftArrowIcon" size={16} loading={6} />
          </span>

          <span className="text-lg font-semibold ml-3">Commission log</span>
        </div>

        <div
          className={`mx-[30px] rounded-lg mt-[30px] flex items-center ${
            role === "Admin" ? "justify-between" : "justify-end"
          } `}
        >
          {role === "Admin" && (
            <Select
              className="w-[200px] px-2 py-2 rounded-lg outline-none focus:outline-none "
              value={merchantOptions?.find(
                (option) => option.value === filter.merchantId
              )}
              isMulti={false}
              isSearchable={true}
              onChange={(option) => setFilter({ merchantId: option.value })}
              options={merchantOptions}
              placeholder="Select Merchant"
            />
          )}

          <div className="flex items-center gap-[30px]">
            <DatePicker
              selected={filter.date}
              onChange={(date) => setFilter({ ...filter, date: date })}
              dateFormat="yyyy/MM/dd"
              withPortal
              className="cursor-pointer "
              maxDate={new Date()}
              customInput={
                <span className="text-gray-400">
                  <RenderIcon iconName="CalendarIcon" size={24} loading={2} />
                </span>
              }
            />

            {role === "Admin" && (
              <input
                type="search"
                name="search"
                placeholder="Search merchant name"
                className="bg-white p-3 rounded-3xl focus:outline-none outline-none text-[14px] ps-[20px]"
                value={debouncedName}
                onChange={(e) => setDebouncedName(e.target.value)}
              />
            )}
          </div>
        </div>

        <div className="mt-[40px]">
          <Table.Root striped interactive>
            <Table.Header>
              <Table.Row className="bg-teal-700 h-14">
                {[
                  "Order ID",
                  "Merchant Name",
                  "Payment Mode",
                  "Total Amount",
                  "Payable Amount to Merchants",
                  "Commission Payable to Famto",
                  "Date",
                  "Status",
                ].map((header, index) => (
                  <Table.ColumnHeader
                    key={index}
                    color="white"
                    textAlign="center"
                  >
                    {header}
                  </Table.ColumnHeader>
                ))}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {showLoading ? (
                <Table.Row className="h-[70px]">
                  <Table.Cell colSpan={8} textAlign="center">
                    <ShowSpinner /> Loading...
                  </Table.Cell>
                </Table.Row>
              ) : showError ? (
                <Table.Row className="h-[70px]">
                  <Table.Cell colSpan={8} textAlign="center">
                    <Error />
                  </Table.Cell>
                </Table.Row>
              ) : allLogs?.length === 0 ? (
                <Table.Row className="h-[70px]">
                  <Table.Cell colSpan={8} textAlign="center">
                    No Commission log found.
                  </Table.Cell>
                </Table.Row>
              ) : (
                allLogs?.map((log) => (
                  <Table.Row key={log.logId} className={`h-[70px]`}>
                    <Table.Cell textAlign="center">{log.orderId}</Table.Cell>
                    <Table.Cell textAlign="center">
                      {log.merchantName}
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      {log.paymentMode}
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      {log.totalAmount}
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      {log.payableAmountToMerchant}
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      {log.payableAmountToFamto}
                    </Table.Cell>
                    <Table.Cell textAlign="center">{log.logDate}</Table.Cell>
                    <Table.Cell textAlign="center">
                      {log.status === "Unpaid" ? (
                        role === "Admin" ? (
                          <button
                            className="bg-teal-700 text-white px-3 py-2 rounded-md text-sm"
                            onClick={() => toggleModal(log?.logId)}
                          >
                            Set as paid
                          </button>
                        ) : (
                          <p className="text-red-500 font-semibold">Unpaid</p>
                        )
                      ) : (
                        <p className="text-green-500 font-semibold">
                          {log.status}
                        </p>
                      )}
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table.Root>

          {pagination?.total && (
            <PaginationRoot
              count={pagination.total}
              page={page}
              pageSize={50}
              defaultPage={1}
              onPageChange={(e) => setPage(e.page)}
              variant="solid"
              className="py-[50px] flex justify-center"
            >
              <HStack>
                <PaginationPrevTrigger />
                <PaginationItems />
                <PaginationNextTrigger />
              </HStack>
            </PaginationRoot>
          )}
        </div>

        <ConfirmCommissionPayment
          isOpen={showModal}
          onClose={closeModal}
          logId={selectedId}
        />
      </>
    </div>
  );
};

export default CommissionLog;
