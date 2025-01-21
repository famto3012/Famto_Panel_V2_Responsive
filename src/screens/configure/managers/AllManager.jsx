import GlobalSearch from "@/components/others/GlobalSearch";
import RenderIcon from "@/icons/RenderIcon";
import AddManager from "@/models/general/manager/AddManager";
import AddRole from "@/models/general/manager/AddRole";
import DeleteManager from "@/models/general/manager/DeleteManager";
import DeleteRole from "@/models/general/manager/DeleteRole";
import EditManager from "@/models/general/manager/EditManager";
import EditRole from "@/models/general/manager/EditRole";
import { Button, HStack, Table } from "@chakra-ui/react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";

const AllManager = () => {
  const [filter, setFilter] = useState({
    geofence: null,
    name: "",
  });
  const [modal, setModal] = useState({
    addManager: false,
    editManager: false,
    deleteManager: false,
    addRole: false,
    editRole: false,
    deleteRole: false,
  });
  const [selectedId, setSelectedId] = useState(null);

  const toggleModal = (type, id = null) => {
    setSelectedId(id);
    setModal({ ...modal, [type]: true });
  };

  const closeModal = () => {
    setSelectedId(null);
    setModal({
      addManager: false,
      editManager: false,
      deleteManager: false,
      addRole: false,
      editRole: false,
      deleteRole: false,
    });
  };

  const geofenceOptions = [];

  return (
    <>
      <div className="bg-gray-100 min-h-full">
        <GlobalSearch />

        <div className="flex justify-between mt-[30px] px-5">
          <h1 className="font-bold text-[20px]"> Managers</h1>

          <Button
            onClick={() => toggleModal("addManager")}
            className="bg-teal-700 p-2 rounded-md text-white flex items-center gap-2"
          >
            <RenderIcon iconName="PlusIcon" />
            <span>Add Manager</span>
          </Button>
        </div>

        <div className="bg-white p-5 mx-5 mb-5 mt-5 rounded-lg flex justify-between">
          <div className="flex gap-10">
            <Select
              options={geofenceOptions}
              value={geofenceOptions.find(
                (option) => option.value === geofenceFilter
              )}
              onChange={(option) =>
                setFilter({ ...filter, geofence: option.value })
              }
              className=" bg-cyan-50 min-w-[10rem]"
              placeholder="Geofence"
              isSearchable={false}
              isMulti={false}
              styles={{
                control: (provided) => ({
                  ...provided,
                  paddingRight: "",
                }),
                dropdownIndicator: (provided) => ({
                  ...provided,
                  padding: "10px",
                }),
              }}
            />
          </div>

          <div className="flex gap-4">
            <input
              type="search"
              name="search"
              placeholder="Search Manager Name"
              className="bg-gray-100 h-10 px-3 rounded-full text-sm outline-none focus:outline-none"
              value={filter.name}
              onChange={(e) => setFilter({ ...filter, name: e.target.value })}
            />
          </div>
        </div>

        <div className="overflow-auto h-[30rem]">
          <Table.Root className="mt-5 z-10 max-h-[30rem]" striped interactive>
            <Table.Header>
              <Table.Row className="bg-teal-700 h-14">
                {[
                  "Id",
                  "Name",
                  "Email",
                  "Phone",
                  "Role",
                  "Geofence",
                  "Action",
                ].map((header, idx) => (
                  <Table.ColumnHeader
                    key={idx}
                    color="white"
                    textAlign="center"
                  >
                    {header}
                  </Table.ColumnHeader>
                ))}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {/* {isTableLoading ? (
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
              allPricing?.map((price) => ( */}
              <Table.Row className={`h-[70px]`}>
                <Table.Cell textAlign="center">One</Table.Cell>
                <Table.Cell textAlign="center">One</Table.Cell>
                <Table.Cell textAlign="center">One</Table.Cell>
                <Table.Cell textAlign="center">One</Table.Cell>
                <Table.Cell textAlign="center">One</Table.Cell>
                <Table.Cell textAlign="center">One</Table.Cell>
                <Table.Cell textAlign="center">
                  <HStack
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    gap={5}
                  >
                    <Button
                      onClick={() => toggleModal("editManager", 12)}
                      className="text-gray-600 p-2"
                    >
                      <RenderIcon iconName="EditIcon" size={20} loading={6} />
                    </Button>

                    <span
                      onClick={() => toggleModal("deleteManager", 12)}
                      className="text-red-500"
                    >
                      <RenderIcon iconName="DeleteIcon" size={24} loading={6} />
                    </span>
                  </HStack>
                </Table.Cell>
              </Table.Row>
              {/* ))
            )} */}
            </Table.Body>
          </Table.Root>
        </div>

        <div className="flex justify-between mt-[30px] px-5">
          <h1 className="font-bold text-[20px]">Roles</h1>

          <Button
            onClick={() => toggleModal("addRole")}
            className="bg-teal-700 p-2 rounded-md text-white flex items-center gap-2"
          >
            <RenderIcon iconName="PlusIcon" />
            <span>Add Roles</span>
          </Button>
        </div>

        <div className="overflow-auto h-[30rem]">
          <Table.Root className="mt-5 z-10 max-h-[30rem]" striped interactive>
            <Table.Header>
              <Table.Row className="bg-teal-700 h-14">
                {["Domain", "Allowed Options", "Action"].map((header, idx) => (
                  <Table.ColumnHeader
                    key={idx}
                    color="white"
                    textAlign="center"
                  >
                    {header}
                  </Table.ColumnHeader>
                ))}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {/* {isTableLoading ? (
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
              allPricing?.map((price) => ( */}
              <Table.Row className={`h-[70px]`}>
                <Table.Cell textAlign="center">One</Table.Cell>
                <Table.Cell textAlign="center">One</Table.Cell>
                <Table.Cell textAlign="center">
                  <HStack
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    gap={5}
                  >
                    <Button
                      onClick={() => toggleModal("editRole", 23)}
                      className="text-gray-600"
                    >
                      <RenderIcon iconName="EditIcon" size={20} loading={6} />
                    </Button>

                    <span
                      onClick={() => toggleModal("deleteRole", 23)}
                      className="text-red-500"
                    >
                      <RenderIcon iconName="DeleteIcon" size={24} loading={6} />
                    </span>
                  </HStack>
                </Table.Cell>
              </Table.Row>
              {/* ))
            )} */}
            </Table.Body>
          </Table.Root>
        </div>
      </div>

      <AddManager isOpen={modal.addManager} onClose={closeModal} />
      <EditManager
        isOpen={modal.editManager}
        onClose={closeModal}
        selectedId={12}
      />
      <DeleteManager
        isOpen={modal.deleteManager}
        onClose={closeModal}
        selectedId={12}
      />
      <AddRole isOpen={modal.addRole} onClose={closeModal} />
      <EditRole isOpen={modal.editRole} onClose={closeModal} selectedId={12} />
      <DeleteRole
        isOpen={modal.deleteRole}
        onClose={closeModal}
        selectedId={12}
      />
    </>
  );
};

export default AllManager;
