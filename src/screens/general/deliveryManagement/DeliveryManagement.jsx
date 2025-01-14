import AutoAllocation from "@/models/general/deliverymanagement/AutoAllocation";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Switch } from "@/components/ui/switch";
import RenderIcon from "@/icons/RenderIcon";
import AllTask from "@/components/deliveryManagement/AllTask";
import AllAgent from "@/components/deliveryManagement/AllAgent";
import { useEffect, useRef, useState } from "react";
import {
  getAgentsForMap,
  getAuthTokenForDeliveryManagementMap,
  getAutoAllocation,
  updateAutoALlocationStatus,
} from "../../../hooks/deliveryManagement/useDeliveryManagement";
import { useMutation, useQuery } from "@tanstack/react-query";
import { mappls } from "mappls-web-maps";
import { toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
const mapplsClassObject = new mappls();

const DeliveryManagement = () => {
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [mapObject, setMapObject] = useState(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [autoAllocationStatus, setAutoAllocationStatus] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const mapContainerRef = useRef(null);
  const navigate = useNavigate();

  const [startDate, endDate] = dateRange;
  const { data: authToken } = useQuery({
    queryKey: ["get-auth-token"],
    queryFn: () => getAuthTokenForDeliveryManagementMap(navigate),
  });

  const { data: autoAllocation } = useQuery({
    queryKey: ["auto-allocation"],
    queryFn: () => getAutoAllocation(navigate),
  });

  const { data: allAgents } = useQuery({
    queryKey: ["all-agents"],
    queryFn: () => getAgentsForMap(navigate),
  });

  const handleAutoAllocationStatusChange = useMutation({
    mutationKey: ["change-auto-allocation-status"],
    mutationFn: () => updateAutoALlocationStatus(navigate),
    onSuccess: (data) => {
      toaster.create({
        title: "Success",
        description:
          data?.message || "Auto allocation status changed successfully",
        type: "success",
      });
      setAutoAllocationStatus(data?.isActive);
    },
    onError: (error) => {
      toaster.create({
        title: "Error",
        description: error || "Error in changing auto allocation status",
        type: "error",
      });
    },
  });

  const initializeMap = () => {
    const mapProps = {
      center: [8.528818999999999, 76.94310683333333],
      traffic: true,
      zoom: 12,
      geolocation: true,
      clickableIcons: true,
    };

    mapplsClassObject.initialize(`${authToken}`, () => {
      if (mapContainerRef.current) {
        const map = mapplsClassObject.Map({
          id: "map",
          properties: mapProps,
        });

        if (map && typeof map.on === "function") {
          map.on("load", () => {
            setMapObject(map); // Save the map object to state
            setIsMapLoaded(true);
          });
        } else {
          console.error(
            "mapObject.on is not a function or mapObject is not defined"
          );
        }
      } else {
        console.error("Map container not found");
      }
    });
  };

  const showShopLocationOnMap = ({ coordinates, fullName, Id }) => {
    const markerProps = {
      fitbounds: true,
      fitboundOptions: { padding: 120, duration: 1000 },
      width: 100,
      height: 100,
      clusters: true,
      clustersOptions: { color: "blue", bgcolor: "red" },
      offset: [0, 10],
      draggable: true,
    };

    const shopGeoData = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {
            htmlPopup: `Id:${Id} \n
               Name: ${fullName} \n `,
          },
          geometry: {
            type: "Point",
            coordinates: coordinates,
          },
        },
      ],
    };

    shopGeoData.features.forEach(async (feature) => {
      const { coordinates } = feature.geometry;
      const { htmlPopup } = feature.properties;

      try {
        const shopMarker = await mapplsClassObject.Marker({
          map: mapObject,
          position: { lat: coordinates[0], lng: coordinates[1] },
          properties: { ...markerProps, popupHtml: htmlPopup },
        });
        await shopMarker.setIcon(
          "https://firebasestorage.googleapis.com/v0/b/famto-aa73e.appspot.com/o/admin_panel_assets%2Fshop-svgrepo-com.svg?alt=media&token=1da55e13-4b6e-477b-98ed-8024cfb89f24"
        );
        await shopMarker.setPopup(htmlPopup);
        mapObject.setView([coordinates[0], coordinates[1]], 17);
      } catch (error) {
        console.error("Error adding marker:", error);
      }
    });
  };

  const showAgentLocationOnMap = ({
    coordinates,
    fullName,
    Id,
    phoneNumber,
  }) => {
    const markerProps = {
      fitbounds: true,
      fitboundOptions: { padding: 120, duration: 1000 },
      width: 100,
      height: 100,
      clusters: true,
      clustersOptions: { color: "blue", bgcolor: "red" },
      offset: [0, 10],
      draggable: true,
    };

    const agentGeoData = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {
            htmlPopup: `Id:${Id} \n
               Name: ${fullName} \n
               Phone Number: ${phoneNumber} `,
          },
          geometry: {
            type: "Point",
            coordinates: coordinates, // Assuming agent.location is [lat, lng]
          },
        },
      ],
    };
    agentGeoData.features.forEach(async (feature) => {
      const { coordinates } = feature.geometry;
      const { htmlPopup } = feature.properties;

      try {
        const agentMarker = await mapplsClassObject.Marker({
          map: mapObject,
          position: { lat: coordinates[0], lng: coordinates[1] },
          properties: { ...markerProps, popupHtml: htmlPopup },
        });
        await agentMarker.setIcon(
          "https://firebasestorage.googleapis.com/v0/b/famto-aa73e.appspot.com/o/admin_panel_assets%2Fgoride%20icon.svg?alt=media&token=71896ad1-d821-4ccd-996c-f3131fd09404"
        );
        await agentMarker.setPopup(htmlPopup);
        mapObject.setView([coordinates[0], coordinates[1]], 17);
      } catch (error) {
        console.error("Error adding marker:", error);
      }
    });
  };

  useEffect(() => {
    if (authToken) {
      initializeMap();
    }

    if (autoAllocation) {
      setAutoAllocationStatus(autoAllocation.isActive);
    }
  }, [authToken, autoAllocation]);

  useEffect(() => {
    if (mapObject && allAgents) {
      const markerProps = {
        fitbounds: true,
        fitboundOptions: { padding: 120, duration: 1000 },
        width: 100,
        height: 100,
        clusters: true,
        clustersOptions: { color: "blue", bgcolor: "red" },
        offset: [0, 10],
        draggable: true,
      };

      const approvedAgents = allAgents.filter(
        (agent) => agent.isApproved === "Approved"
      );

      const agentGeoData = {
        type: "FeatureCollection",
        features: approvedAgents.map((agent) => ({
          type: "Feature",
          properties: {
            htmlPopup: `Id:${agent._id} \n
                 Name: ${agent.fullName} \n
                 Phone: ${agent.phoneNumber} `,
          },
          geometry: {
            type: "Point",
            coordinates: agent.location, // Assuming agent.location is [lat, lng]
          },
        })),
      };

      agentGeoData.features.forEach(async (feature) => {
        const { coordinates } = feature.geometry;
        const { htmlPopup } = feature.properties;

        try {
          const agentMarker = await mapplsClassObject.Marker({
            map: mapObject,
            position: { lat: coordinates[0], lng: coordinates[1] },
            properties: { ...markerProps, popupHtml: htmlPopup },
          });
          await agentMarker.setIcon(
            "https://firebasestorage.googleapis.com/v0/b/famto-aa73e.appspot.com/o/admin_panel_assets%2Fgoride%20icon.svg?alt=media&token=71896ad1-d821-4ccd-996c-f3131fd09404"
          );
          await agentMarker.setPopup(htmlPopup);
        } catch (error) {
          console.error("Error adding marker:", error);
        }
      });
    }
  }, [mapObject, allAgents]);

  return (
    <>
      <div className="bg-gray-100 relative">
        <div className="h-[10%] pt-4">
          <p className="text-[18px] flex font-semibold p-5">
            <span
              onClick={() => navigate("/home")}
              className="cursor-pointer me-4 mt-1"
            >
              <RenderIcon iconName="LeftArrowIcon" size={16} loading={6} />
            </span>
            Delivery Management
          </p>
          <div className="bg-white rounded-lg flex justify-between p-5 mb-1">
            <div>
              <DatePicker
                selectsRange={true}
                startDate={startDate}
                endDate={endDate}
                onChange={(update) => {
                  setDateRange(update);
                }}
                dateFormat="yyyy/MM/dd"
                withPortal
                className="border-2 p-2 rounded-lg cursor-pointer mt-4 outline-none focus:outline-none"
                placeholderText="Select Date range"
                maxDate={new Date()}
              />
            </div>
            <div className="flex gap-8 items-center">
              <span
                className="p-4 bg-gray-200 rounded-2xl"
                onClick={() => setShowModal(true)}
              >
                <RenderIcon iconName="SettingsIcon" size={16} loading={6} />
              </span>
              <AutoAllocation
                isOpen={showModal}
                onClose={() => setShowModal(false)}
              />
              <p className="font-medium">
                Auto Allocation{" "}
                <Switch
                  className="ml-2"
                  variant="solid"
                  colorPalette="teal"
                  value={autoAllocationStatus}
                  onChange={() => handleAutoAllocationStatusChange.mutate()}
                />
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 pl-2 pr-2">
          <AllTask
            onShowShopLocationOnMap={showShopLocationOnMap}
            onDate={dateRange}
          />

          <div className="w-2/4 bg-white h-[33rem]">
            <div
              id="map"
              ref={mapContainerRef}
              style={{
                width: "100%",
                height: "100%",
                display: "inline-block",
              }}
            >
              {!isMapLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button
                    onClick={initializeMap}
                    className="m-2 p-3 bg-teal-600 text-[15px] font-bold text-white"
                  >
                    Initialize Map
                  </Button>
                </div>
              )}
            </div>
          </div>

          <AllAgent showAgentLocationOnMap={showAgentLocationOnMap} />
        </div>
      </div>
    </>
  );
};

export default DeliveryManagement;
