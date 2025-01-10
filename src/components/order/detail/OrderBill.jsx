import { Table } from "@chakra-ui/react";

const OrderBill = ({ data }) => {
  const { _id: orderId, billDetail } = data;

  return (
    <div className={`${orderId.charAt(0) === "O" ? "" : "mb-5"}`}>
      <h1 className="text-[18px] font-semibold m-5">Bill Summary</h1>

      <div className=" max-w-[96%] mx-auto pb-[20px]">
        <Table.Root size="lg">
          <Table.Body>
            <Table.Row className="h-[70px]">
              <Table.Cell textAlign="left">Price</Table.Cell>
              <Table.Cell textAlign="right">
                {billDetail?.itemTotal || 0}
              </Table.Cell>
            </Table.Row>
            <Table.Row className="h-[70px]">
              <Table.Cell textAlign="left">Delivery Charges</Table.Cell>
              <Table.Cell textAlign="right">
                {billDetail?.deliveryCharge || 0}
              </Table.Cell>
            </Table.Row>
            <Table.Row className="h-[70px]">
              <Table.Cell textAlign="left">Added Tip</Table.Cell>
              <Table.Cell textAlign="right">
                {billDetail?.addedTip || 0}
              </Table.Cell>
            </Table.Row>
            <Table.Row className="h-[70px]">
              <Table.Cell textAlign="left">Discount</Table.Cell>
              <Table.Cell textAlign="right">
                {billDetail?.discountedAmount || 0}
              </Table.Cell>
            </Table.Row>
            <Table.Row className="h-[70px]">
              <Table.Cell textAlign="left">Sub Total</Table.Cell>
              <Table.Cell textAlign="right">
                {billDetail?.subTotal || 0}
              </Table.Cell>
            </Table.Row>
            <Table.Row className="h-[70px]">
              <Table.Cell textAlign="left">Taxes & Fees</Table.Cell>
              <Table.Cell textAlign="right">
                {billDetail?.taxAmount || 0}
              </Table.Cell>
            </Table.Row>

            <Table.Row className="h-[70px]" bg="teal.700">
              <Table.Cell textAlign="left" color="white">
                Net Payable Amount
              </Table.Cell>
              <Table.Cell textAlign="right" color="white">
                {billDetail?.grandTotal || 0}
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      </div>
    </div>
  );
};

export default OrderBill;
