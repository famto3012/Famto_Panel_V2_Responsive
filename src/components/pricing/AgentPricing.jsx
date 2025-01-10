import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HStack, Table } from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Switch } from "@/components/ui/switch";
import { toaster } from "@/components/ui/toaster";

import RenderIcon from "@/icons/RenderIcon";

import {
  fetchAllAgentPricing,
  updateAgentPricingStatus,
} from "@/hooks/pricing/useAgentPricing";

import ShowSpinner from "../others/ShowSpinner";

import AddAgentPricing from "@/models/configure/pricing/AddAgentPricing";
import EditAgentPricing from "@/models/configure/pricing/EditAgentPricing";
import DeleteAgentPricing from "@/models/configure/pricing/DeleteAgentPricing";

const AgentPricing = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [modal, setModal] = useState({
    add: false,
    edit: false,
    delete: false,
  });
  const [selectedId, setSelectedId] = useState(null);

  const {
    data: allPricing,
    isLoading: isTableLoading,
    isError,
  } = useQuery({
    queryKey: ["all-agent-pricing"],
    queryFn: () => fetchAllAgentPricing(navigate),
  });

  const toggleStatus = useMutation({
    mutationKey: ["toggleAgentPricing"],
    mutationFn: (pricingId) => updateAgentPricingStatus(pricingId, navigate),
    onSuccess: () => {
      queryClient.invalidateQueries(["all-agent-pricing"]);
      toaster.create({
        title: "Success",
        description: "Pricing status updated successfully",
        type: "success",
      });
    },
    onError: () => {
      toaster.create({
        title: "Error",
        description: "Error while updating pricing status",
        type: "error",
      });
    },
  });

  const toggleModal = (type, id = null) => {
    setSelectedId(id);
    setModal((prev) => ({
      ...prev,
      [type]: true,
    }));
  };

  const closeModal = () => {
    setSelectedId(null);
    setModal({
      add: false,
      edit: false,
      delete: false,
    });
  };

  return (
    <>
      <h1 className="px-9 mt-5 font-bold p-3 bg-gray-300">Agent</h1>
      <div className="flex items-center justify-between mx-9 mt-5 mb-[20px]">
        <h1 className="text-md">Pricing</h1>
        <div>
          <button
            className="bg-teal-700 text-white rounded-md flex items-center space-x-1 p-2"
            onClick={() => toggleModal("add")}
          >
            <RenderIcon iconName="PlusIcon" size={16} loading={6} />
            <span>Add rule</span>
          </button>
        </div>
      </div>

      <Table.Root className="mt-5 z-10 max-h-[30rem]" striped interactive>
        <Table.Header>
          <Table.Row className="bg-teal-700 h-14">
            {[
              "Rule Name",
              "Base Fare",
              "Base Distance Fare per Km",
              "Waiting Fare",
              "Waiting Time",
              "Purchase Fare per hour",
              "Minimum login Hrs",
              "Minimum order number",
              "Fare after min login Hrs",
              "Fare after min order",
              "Geofence",
              "Status",
            ].map((header, idx) => (
              <Table.ColumnHeader key={idx} color="white" textAlign="center">
                {header}
              </Table.ColumnHeader>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {isTableLoading ? (
            <Table.Row className="h-[70px]">
              <Table.Cell colSpan={10} textAlign="center">
                <ShowSpinner /> Loading...
              </Table.Cell>
            </Table.Row>
          ) : allPricing?.length === 0 ? (
            <Table.Row className="h-[70px]">
              <Table.Cell colSpan={10} textAlign="center">
                No Pricing Available
              </Table.Cell>
            </Table.Row>
          ) : isError ? (
            <Table.Row className="h-[70px]">
              <Table.Cell colSpan={10} textAlign="center">
                Error in fetching agent pricings.
              </Table.Cell>
            </Table.Row>
          ) : (
            allPricing?.map((price) => (
              <Table.Row key={price._id} className={`h-[70px]`}>
                <Table.Cell textAlign="center">{price.ruleName}</Table.Cell>
                <Table.Cell textAlign="center">{price.baseFare}</Table.Cell>
                <Table.Cell textAlign="center">
                  {price.baseDistanceFarePerKM}
                </Table.Cell>
                <Table.Cell textAlign="center">{price.waitingFare}</Table.Cell>
                <Table.Cell textAlign="center">{price.waitingTime}</Table.Cell>
                <Table.Cell textAlign="center">
                  {price.purchaseFarePerHour}
                </Table.Cell>
                <Table.Cell textAlign="center">
                  {price.minLoginHours}
                </Table.Cell>
                <Table.Cell textAlign="center">
                  {price.minOrderNumber}
                </Table.Cell>
                <Table.Cell textAlign="center">
                  {price.fareAfterMinLoginHours}
                </Table.Cell>
                <Table.Cell textAlign="center">
                  {price.fareAfterMinOrderNumber}
                </Table.Cell>
                <Table.Cell textAlign="center">
                  {price?.geofenceId?.name}
                </Table.Cell>
                <Table.Cell textAlign="center">
                  <HStack direction="row" gap="4">
                    {toggleStatus.isPending && selectedId === price._id ? (
                      <ShowSpinner />
                    ) : (
                      <Switch
                        colorPalette="teal"
                        checked={price?.status}
                        onChange={() => toggleStatus.mutate(price._id)}
                      />
                    )}

                    <span
                      onClick={() => toggleModal("edit", price._id)}
                      className="text-gray-600"
                    >
                      <RenderIcon iconName="EditIcon" size={20} loading={6} />
                    </span>

                    <span
                      onClick={() => toggleModal("delete", price._id)}
                      className="text-red-500"
                    >
                      <RenderIcon iconName="DeleteIcon" size={24} loading={6} />
                    </span>
                  </HStack>
                </Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table.Root>

      <AddAgentPricing isOpen={modal.add} onClose={closeModal} />
      <EditAgentPricing
        isOpen={modal.edit}
        onClose={closeModal}
        pricingId={selectedId}
      />
      <DeleteAgentPricing
        isOpen={modal.delete}
        onClose={closeModal}
        pricingId={selectedId}
      />
    </>
  );
};

export default AgentPricing;
