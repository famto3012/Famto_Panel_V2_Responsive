import RenderIcon from "@/icons/RenderIcon";
import GlobalSearch from "@/components/others/GlobalSearch";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { toaster } from "@/components/ui/toaster";
import {
  getGeofenceDetail,
  updateGeofence,
} from "@/hooks/geofence/useGeofence";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getAuthTokenForDeliveryManagementMap } from "@/hooks/deliveryManagement/useDeliveryManagement";
import { mappls, mappls_plugin } from "mappls-web-maps";

const mapplsClassObject = new mappls();
const mapplsPluginObject = new mappls_plugin();

const PlaceSearchPlugin = ({ map }) => {
  const placeSearchRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (map && placeSearchRef.current) {
      mapplsClassObject.removeLayer({ map, layer: placeSearchRef.current });
    }

    const optional_config = {
      location: [28.61, 77.23],
      region: "IND",
      height: 300,
    };

    const callback = (data) => {
      if (data) {
        const dt = data[0];
        if (!dt) return false;
        const eloc = dt.eLoc;
        const place = `${dt.placeName}`;
        if (markerRef.current) markerRef.current.remove();
        mapplsPluginObject.pinMarker(
          {
            map: map,
            pin: eloc,
            popupHtml: place,
            popupOptions: {
              openPopup: true,
            },
            zoom: 10,
          },
          (data) => {
            markerRef.current = data;
            markerRef.current.fitbounds();
          }
        );
        markerRef.current.remove();
      }
    };
    placeSearchRef.current = mapplsPluginObject.search(
      document.getElementById("auto"),
      optional_config,
      callback
    );

    return () => {
      if (map && placeSearchRef.current) {
        mapplsClassObject.removeLayer({ map, layer: placeSearchRef.current });
      }
    };
  }, [map]);

  return null;
};

const EditGeofence = () => {
  const [geofence, setGeofence] = useState({
    name: "",
    description: "",
    color: "",
    coordinates: [],
  });
  const mapContainerRef = useRef(null);
  const [mapObject, setMapObject] = useState(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const navigate = useNavigate();

  const { geofenceId } = useParams();

  const { data: authToken } = useQuery({
    queryKey: ["get-auth-token"],
    queryFn: () => getAuthTokenForDeliveryManagementMap(navigate),
  });

  const { data: geofenceData } = useQuery({
    queryKey: ["geofence-detail"],
    queryFn: () => getGeofenceDetail({ geofenceId, navigate }),
  });

  const handleUpdateGeofence = useMutation({
    mutationKey: ["edit-geofence"],
    mutationFn: ({ geofence }) =>
      updateGeofence({ geofenceId, updatedGeofence: geofence, navigate }),
    onSuccess: (data) => {
      navigate("/configure/geofence");
      toaster.create({
        title: "Success",
        description: data.message || "Geofence updated successfully.",
        type: "success",
      });
    },
    onError: (error) => {
      toaster.create({
        title: "Error",
        description: error.message || "Error updating geofence.",
        type: "error",
      });
    },
  });

  const handleColorChange = (e) => {
    setGeofence({ ...geofence, color: e.target.value });
  };

  const handleInputChange = (e) => {
    setGeofence({ ...geofence, [e.target.name]: e.target.value });
  };

  const GeoJsonComponent = ({ map, geofence, color }) => {
    // const geoJsonRef = useRef(null);
    console.log("Here");
    console.log("Geofence", geofence);
    useEffect(() => {
      if (!map || !geofence.coordinates || !Array.isArray(geofence.coordinates))
        return;

      // Convert the coordinates to Mappls format
      const pts = geofence.coordinates
        .map((coord) => {
          if (!Array.isArray(coord) || coord.length !== 2) {
            console.error("Invalid coordinate format:", coord);
            return null;
          }
          const [lat, lng] = coord;
          return { lat, lng };
        })
        .filter((coord) => coord !== null);
      console.log("pts", pts);
      // Create the polygon
      const poly = window.mappls.Polygon({
        map: map,
        paths: pts,
        fillColor: color,
        fillOpacity: 0.3,
        fitbounds: true,
      });

      // Enable editing of the polygon
      poly.setEditable(true);

      // Function to update coordinates
      const updateCoordinates = () => {
        const newCoordinates = poly
          .getPath()[0]
          .map((point) => [point.lat, point.lng]);

        setGeofence((prevState) => ({
          ...prevState,
          coordinates: newCoordinates,
        }));
      };

      // Add event listeners to capture changes
      poly.addListener("dblclick", updateCoordinates);
    }, [map, geofence, color]);

    return null;
  };

  useEffect(() => {
    if (geofenceData) {
      console.log("Fetched geofence data:", geofenceData);

      // Destructure and validate coordinates
      const { name, description, color, coordinates } = geofenceData;

      // Ensure coordinates are valid
      if (Array.isArray(coordinates) && coordinates.length > 0) {
        setGeofence({ name, description, color, coordinates });
      } else {
        console.warn(
          "Invalid or undefined coordinates in geofence data:",
          coordinates
        );
        setGeofence({ name, description, color, coordinates: [] });
      }
    }
  }, [geofenceData]);

  let map, drawData, geoJSON, polyArray;

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://apis.mappls.com/advancedmaps/api/9a632cda78b871b3a6eb69bddc470fef/map_sdk?layer=vector&v=3.0&polydraw&callback=initMap`;
    script.async = true;
    document.body.appendChild(script);

    window.initMap = () => {
      const map = new window.mappls.Map("map", {
        center: [8.528818999999999, 76.94310683333333],
        zoomControl: true,
        geolocation: false,
        fullscreenControl: false,
        zoom: 12,
      });

      if (map && typeof map.on === "function") {
        map.on("load", () => {
          setMapObject(map);
          setIsMapLoaded(true);

          window.mappls.polygonDraw(
            {
              map: map,
              data: geoJSON,
            },
            function (data) {
              drawData = data;

              drawData.control(true);
              polyArray = drawData.data?.geometry.coordinates[0];

              setTimeout(() => {
                const drawPolygonButton = document.querySelector(
                  ".mapbox-gl-draw_ctrl-draw-btn.mapbox-gl-draw_polygon"
                );
                const deleteButton = document.querySelector(
                  ".mapbox-gl-draw_ctrl-draw-btn.mapbox-gl-draw_trash"
                );

                if (drawPolygonButton) {
                  // Adjust size and add icon
                  drawPolygonButton.style.width = "40px";
                  drawPolygonButton.style.height = "40px";
                  drawPolygonButton.style.padding = "0px";
                  drawPolygonButton.innerHTML = `<img src="https://firebasestorage.googleapis.com/v0/b/famto-aa73e.appspot.com/o/admin_panel_assets%2Fmap%20selection.png?alt=media&token=f9084e35-d417-4211-84a3-d11220bae42b" alt="PolyDraw" style="width: 55px; height: 40px;" />`;
                }

                if (deleteButton) {
                  deleteButton.style.width = "40px";
                  deleteButton.style.height = "40px";
                  deleteButton.style.padding = "0px";
                  deleteButton.innerHTML = `<img src="https://firebasestorage.googleapis.com/v0/b/famto-aa73e.appspot.com/o/admin_panel_assets%2Fmap%20deletion.png?alt=media&token=eb4baa67-9ff6-4661-9b4b-326fd0ebeaaf" alt="Delete" style="width: 55px; height: 40px;" />`;
                }
              }, 500);

              const formattedCoordinates =
                drawData?.data?.geometry?.coordinates[0].map(([lng, lat]) => [
                  lat,
                  lng,
                ]);

              setGeofence((prevState) => ({
                ...prevState,
                coordinates: formattedCoordinates,
              }));
            }
          );
        });
      } else {
        console.error("Map container not found");
      }
    };
  }, [authToken]);

  return (
    <>
      <div className="w-full min-h-screen bg-gray-100 flex flex-col">
        <nav className="p-5">
          <GlobalSearch />
        </nav>
        <h1 className="font-bold text-lg mx-10 flex">
          {" "}
          <span
            onClick={() => navigate("/configure/geofence")}
            className="cursor-pointer me-4 mt-1"
          >
            <RenderIcon iconName="LeftArrowIcon" size={16} loading={6} />
          </span>
          Edit Geofence
        </h1>
        <div className="flex justify-between gap-3">
          <div className="mt-8 p-6 bg-white  rounded-lg shadow-sm w-1/3 ms-10">
            <form>
              <div className="flex flex-col gap-3 ">
                <div>
                  <label
                    className="w-1/3 text-md font-medium"
                    htmlFor="regionName"
                  >
                    Colour
                  </label>
                  <div className="relative rounded-full">
                    <input
                      type="color"
                      className="appearance-none w-full h-12 rounded outline-none focus:outline-none mt-2"
                      style={{ WebkitAppearance: "none" }}
                      value={geofence?.color}
                      onChange={handleColorChange}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-white text-[25px]">
                      <RenderIcon
                        iconName="PaintPaletteIcon"
                        size={20}
                        loading={6}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label
                    className="w-1/3 text-md font-medium"
                    htmlFor="regionName"
                  >
                    Name
                  </label>
                  <div className="relative mt-2">
                    <input
                      type="text"
                      name="name"
                      id="regionName"
                      value={geofence?.name || ""}
                      onChange={handleInputChange}
                      className="py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 sm:text-sm w-full"
                    />
                  </div>
                </div>
                <div>
                  <label
                    className="w-1/3 text-md font-medium"
                    htmlFor="regionDescription"
                  >
                    Description
                  </label>
                  <div className="relative mt-2">
                    <textarea
                      name="description"
                      id="regionDescription"
                      value={geofence?.description || ""}
                      onChange={handleInputChange}
                      className="py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 sm:text-sm w-full"
                    />
                  </div>
                </div>
              </div>
            </form>
            <div className="flex flex-row gap-2 mt-6">
              <button
                onClick={() => navigate("/configure/geofence")}
                className="w-1/2 bg-white border border-gray-300 text-gray-700 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={() => handleUpdateGeofence.mutate({ geofence })}
                className="w-1/2 bg-teal-600 text-white px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                Update
              </button>
            </div>
            <p className="text-gray-600 mt-[25px]">
              <span className="font-bold">Note:</span> After changing the
              coordinates of the geofence. Double click on the marked area after
              that click on the update button.
            </p>
          </div>
          <div className="mt-8 p-6 bg-white rounded-lg shadow-sm w-2/3 me-10">
            <div
              ref={mapContainerRef}
              id="map"
              className="map-container w-full h-[600px]"
            >
              <input
                type="text"
                id="auto"
                name="auto"
                className="mt-2 ms-2 w-[300px] absolute top-0 left-0 text-[15px] p-[10px] outline-none focus:outline-none"
                placeholder="Search places"
                spellCheck="false"
              />
              {isMapLoaded && <PlaceSearchPlugin map={mapObject} />}
              {isMapLoaded && (
                <GeoJsonComponent
                  map={mapObject}
                  geofence={geofenceData}
                  color={geofenceData.color}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditGeofence;
