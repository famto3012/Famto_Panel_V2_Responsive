import { Table } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const Details = ({ data }) => {
  const { customerDetail, merchantDetail, deliveryAgentDetail } = data;

  return (
    <>
      <div className="mt-10">
        <h1 className="text-[18px] font-semibold ml-5 mb-5">
          Customer Details
        </h1>

        <Table.Root size="lg">
          <Table.Header>
            <Table.Row className="bg-teal-700 h-[70px]" textAlign="center">
              {[
                "Customer Id",
                "Name",
                "Email",
                "Phone",
                "Address",
                "Ratings to Delivery Agent",
                "Rating by Delivery Agent",
              ].map((header) => (
                <Table.ColumnHeader color="white" textAlign="center">
                  {header}
                </Table.ColumnHeader>
              ))}
            </Table.Row>
          </Table.Header>

          <Table.Body>
            <Table.Row className="h-[70px]">
              <Table.Cell textAlign="center">
                <Link
                  to={`/customer/${customerDetail._id}`}
                  className="underline underline-offset-2 cursor-pointer"
                >
                  {customerDetail._id}
                </Link>
              </Table.Cell>
              <Table.Cell textAlign="center">{customerDetail.name}</Table.Cell>
              <Table.Cell textAlign="center">{customerDetail.email}</Table.Cell>
              <Table.Cell textAlign="center">{customerDetail.phone}</Table.Cell>
              <Table.Cell textAlign="center">
                <p> {customerDetail?.address?.fullName}</p>
                <p> {customerDetail?.address?.flat}</p>
                <p> {customerDetail?.address?.area}</p>
                <p> {customerDetail?.address?.landmark}</p>
                <p> {customerDetail?.address?.phoneNumber}</p>
              </Table.Cell>
              <Table.Cell textAlign="center">
                <p> {customerDetail.ratingsToDeliveryAgent.rating}</p>
                <p> {customerDetail.ratingsToDeliveryAgent.review}</p>
              </Table.Cell>
              <Table.Cell textAlign="center">
                <p> {customerDetail.ratingsByDeliveryAgent.rating}</p>
                <p> {customerDetail.ratingsByDeliveryAgent.review}</p>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      </div>

      <div className="mt-10">
        <h1 className="text-[18px] font-semibold ml-5 mb-5">
          Merchant Details
        </h1>

        <Table.Root size="lg">
          <Table.Header>
            <Table.Row className="bg-teal-700 h-[70px]" textAlign="center">
              {[
                "Merchant Id",
                "Name",
                "Instructions by Customer",
                "Merchant Earnings",
                "Famto Earnings",
              ].map((header) => (
                <Table.ColumnHeader color="white" textAlign="center">
                  {header}
                </Table.ColumnHeader>
              ))}
            </Table.Row>
          </Table.Header>

          <Table.Body>
            <Table.Row className="h-[70px]">
              <Table.Cell textAlign="center">
                <Link
                  to={`/merchant/${merchantDetail._id}`}
                  className="underline underline-offset-2 cursor-pointer"
                >
                  {merchantDetail._id}
                </Link>
              </Table.Cell>
              <Table.Cell textAlign="center">{merchantDetail.name}</Table.Cell>
              <Table.Cell textAlign="center">
                {merchantDetail.instructionByCustomer || "-"}
              </Table.Cell>
              <Table.Cell textAlign="center">
                {merchantDetail.merchantEarnings}
              </Table.Cell>
              <Table.Cell textAlign="center">
                {merchantDetail.famtoEarnings}
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      </div>

      <div className="mt-10">
        <h1 className="text-[18px] font-semibold ml-5 mb-5">
          Delivery Agent Details
        </h1>

        <Table.Root size="lg">
          <Table.Header>
            <Table.Row className="bg-teal-700 h-[70px]" textAlign="center">
              {[
                "Agent Id",
                "Name",
                "Team Name",
                "Instruction by Customer",
                "Time taken",
                "Distance travelled",
                "Delayed by",
              ].map((header) => (
                <Table.ColumnHeader color="white" textAlign="center">
                  {header}
                </Table.ColumnHeader>
              ))}
            </Table.Row>
          </Table.Header>

          <Table.Body>
            <Table.Row className="h-[70px]">
              <Table.Cell textAlign="center">
                <Link
                  to={`/agent/${deliveryAgentDetail._id}`}
                  className="underline underline-offset-2 cursor-pointer"
                >
                  {deliveryAgentDetail._id}
                </Link>
              </Table.Cell>
              <Table.Cell textAlign="center">
                {deliveryAgentDetail.name}
              </Table.Cell>
              <Table.Cell textAlign="center">
                {deliveryAgentDetail.team}
              </Table.Cell>
              <Table.Cell textAlign="center">
                {deliveryAgentDetail.instructionsByCustomer}
              </Table.Cell>
              <Table.Cell textAlign="center">
                {deliveryAgentDetail.timeTaken}
              </Table.Cell>
              <Table.Cell textAlign="center">
                {deliveryAgentDetail.distanceTravelled}
              </Table.Cell>
              <Table.Cell textAlign="center">
                {deliveryAgentDetail.delayedBy}
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      </div>
    </>
  );
};

export default Details;
