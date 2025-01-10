import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
} from "@/components/ui/dialog";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
  MenuItemCommand,
} from "@/components/ui/menu";
import { DataListItem, DataListRoot } from "@/components/ui/data-list";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toaster } from "@/components/ui/toaster";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  assignAgentToTask,
  getAgentsAccordingToGeofence,
} from "@/hooks/deliveryManagement/useDeliveryManagement";

const AssignAgent = ({ isOpen, onClose, taskId }) => {
  const [formData, setFormData] = useState({
    geofenceStatus: false,
  });
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState({
    agentId: "",
    agentName: "",
  });
  const navigate = useNavigate();

  const handleGetAgentsAccordingToGeofence = useMutation({
    mutationKey: ["agents-according-to-geofence"],
    mutationFn: ({ formData, taskId }) => {
      return getAgentsAccordingToGeofence(taskId, formData, navigate);
    },
    onSuccess: (data) => {
      setAgents(data);
    },
    onError: (error) => {
      toaster.create({
        title: "Error",
        description: error || "Error in fetching agents",
        type: "error",
      });
    },
  });

  const handleAssignAgentToTask = useMutation({
    mutationKey: ["assign-agent-to-task"],
    mutationFn: ({ agentId, taskId }) => {
      return assignAgentToTask(agentId, taskId, navigate);
    },
    onSuccess: () => {
      toaster.create({
        title: "Success",
        description: "Agent successfully assigned to the task",
        type: "success",
      });
      setSelectedAgent({
        agentId: "",
        agentName: "",
      });
      onClose();
    },
    onError: (error) => {
      toaster.create({
        title: "Error",
        description: error || "Error in assigning agent",
        type: "error",
      });
    },
  });

  const handleGeofenceSwitch = () => {
    setFormData((prevState) => ({
      geofenceStatus: !prevState.geofenceStatus,
    }));
    handleGetAgentsAccordingToGeofence.mutate({ formData, taskId });
  };

  const handleAgentSelect = (agentId, agentName) => {
    setSelectedAgent({ agentId, agentName });
  };

  const handleAssignAgent = () => {
    if (!selectedAgent.agentId) {
      toaster.create({
        title: "Error",
        description: "Please select an agent before assigning",
        type: "error",
      });
      return;
    }
    handleAssignAgentToTask.mutate({ agentId: selectedAgent.agentId, taskId });
  };

  useEffect(() => {
    if (isOpen) handleGetAgentsAccordingToGeofence.mutate({ formData, taskId });
  }, [isOpen]);

  return (
    <DialogRoot
      open={isOpen}
      onInteractOutside={onClose}
      placement="center"
      motionPreset="slide-in-bottom"
    >
      <DialogContent>
        <DialogCloseTrigger onClick={onClose} />
        <DialogHeader className="text-[18px] font-[600]">
          Assign Agent
        </DialogHeader>
        <DialogBody>
          <DataListRoot orientation="horizontal" size="lg">
            <DataListItem label={"Task ID"} value={taskId} />
            <DataListItem
              label={"Geofence"}
              value={
                <Switch
                  variant="solid"
                  colorPalette="teal"
                  size="lg"
                  value={formData?.geofenceStatus}
                  onChange={() => handleGeofenceSwitch()}
                />
              }
            />
            <DataListItem
              label={"Agent"}
              value={
                <div style={{ position: "relative" }}>
                  <MenuRoot closeOnSelect={false}>
                    <MenuTrigger>
                      <div className="flex justify-center items-center text-[15px] font-semibold text-gray-700 bg-white w-[217px] h-[35px] rounded-lg border-[2px] border-gray-200 cursor-pointer">
                        <p>
                          {selectedAgent?.agentName !== ""
                            ? selectedAgent?.agentName
                            : "Select Agent"}
                        </p>
                      </div>
                    </MenuTrigger>
                    <MenuContent
                      className="bg-white rounded-md border border-gray-200"
                      style={{
                        zIndex: 1500,
                        maxHeight: "200px",
                        overflowY: "auto",
                      }}
                    >
                      {agents.map((agent) => (
                        <MenuItem
                          key={agent._id}
                          onClick={() =>
                            handleAgentSelect(agent._id, agent.name)
                          }
                          className="cursor-pointer hover:bg-gray-100"
                          closeOnSelect={true}
                        >
                          <div className="flex flex-col">
                            <p className="flex text-[15px] font-semibold">
                              {agent._id}{" "}
                              {agent?.workStructure === "Fish & Meat" && (
                                <div className="w-[10px] h-[10px] rounded-full bg-red-600 ml-3 mt-1"></div>
                              )}
                            </p>
                            <p className="text-[15px] font-semibold">
                              {agent.name}
                            </p>
                          </div>
                          <MenuItemCommand>
                            <div className="flex flex-col text-left">
                              <span
                                className={
                                  agent.status === "Free"
                                    ? "text-green-400 font-semibold text-[14px]"
                                    : agent.status === "Inactive"
                                      ? "text-gray-500 font-semibold text-[14px]"
                                      : "text-red-500 font-semibold text-[14px]"
                                }
                              >
                                {agent.status}
                              </span>
                              <span className="text-[14px] font-semibold">
                                {agent.distance} Kms
                              </span>
                            </div>
                          </MenuItemCommand>
                        </MenuItem>
                      ))}
                    </MenuContent>
                  </MenuRoot>
                </div>
              }
            />
          </DataListRoot>
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
            onClick={handleAssignAgent}
          >
            {handleAssignAgentToTask.isPending
              ? `Assigning...`
              : `Assign agent`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default AssignAgent;
