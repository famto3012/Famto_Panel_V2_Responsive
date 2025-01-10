import { useContext, useEffect, useState } from "react";
import AuthContext from "@/context/AuthContext";
import { SocketContext } from "@/context/SocketContext";

const RealTimeDataCount = () => {
  const [realTimeDataCount, setRealTimeDataCount] = useState({});
  const { token, role, userId } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    socket?.on("realTimeDataCount", (dataCount) => {
      setTimeout(() => {
        setRealTimeDataCount(dataCount);
      }, 1000);
    });

    if (role === "Admin") {
      socket?.emit("getRealTimeDataOnRefresh", "");
    } else if (role === "Merchant") {
      const data = {
        id: userId,
        role: role,
      };
      socket?.emit("getRealTimeDataOnRefreshMerchant", data);
    }

    return () => {
      socket?.off("realTimeDataCount");
    };
  }, [token, socket, userId, role]);
  
  return (
    <>
      <div className="w-full">
        <div className="flex mx-5 py-5  justify-between items-center bg-white mt-5 rounded-lg">
          <div className="font-bold mx-10 text-[32px] w-[30%]">Orders</div>

          <div className="flex-grow flex gap-[10px] font-normal">
            <div className="border-l-4 px-5 border-teal-700 w-[22%]">
              <p className="text-[14px]">Pending</p>
              <p className="text-[24px] font-bold text-teal-600">
                {realTimeDataCount?.orderCount?.pending}
              </p>
            </div>

            <div className="border-l-4  px-5 border-teal-700 w-[22%]">
              <p className="text-[14px]">Ongoing</p>
              <p className="text-[24px] font-bold text-teal-600">
                {realTimeDataCount?.orderCount?.ongoing}
              </p>
            </div>

            <div className="border-l-4  px-5 border-teal-700 w-[22%]">
              <p className="text-[14px]">Completed</p>
              <p className="text-[24px] font-bold text-teal-600">
                {realTimeDataCount?.orderCount?.completed}
              </p>
            </div>

            <div className="border-l-4  px-5 border-teal-700 w-[22%]">
              <p className="text-[14px]">Cancelled</p>
              <p className="text-[24px] font-bold text-teal-600">
                {realTimeDataCount?.orderCount?.cancelled}
              </p>
            </div>
          </div>
        </div>
        {role === "Admin" && (
          <>
            <div className="flex mx-5 py-5  justify-between items-center bg-white mt-5 rounded-lg">
              <div className="font-bold mx-10 text-[32px] w-[30%]">
                Merchants
              </div>

              <div className="flex-grow flex gap-[10px] font-normal">
                <div className="border-l-4  px-5 border-teal-700 w-[22%]">
                  <p className="text-[14px]">Open</p>
                  <p className="text-[24px] font-bold text-teal-600">
                    {realTimeDataCount?.merchantCount?.open}
                  </p>
                </div>
                <div className="border-l-4  px-5 border-teal-700 w-[22%]">
                  <p className="text-[14px]">Closed</p>
                  <p className="text-[24px] font-bold text-teal-600">
                    {realTimeDataCount?.merchantCount?.closed}
                  </p>
                </div>
                <div className="border-l-4  px-5 border-teal-700 w-[22%]">
                  <p className="text-[14px]">Active</p>
                  <p className="text-[24px] font-bold text-teal-600">
                    {realTimeDataCount?.merchantCount?.active}
                  </p>
                </div>
                <div className="border-l-4  px-5 border-teal-700 w-[22%]">
                  <p className="text-[14px]">Inactive</p>
                  <p className="text-[24px] font-bold text-teal-600">
                    {realTimeDataCount?.merchantCount?.notActive}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex mx-5 py-5  justify-between items-center bg-white mt-5 rounded-lg">
              <div className="font-bold mx-10 text-[32px] w-[30%]">
                Delivery Agents
              </div>

              <div className=" flex-grow flex gap-[10px] font-normal">
                <div className="border-l-4  px-5 border-teal-700 w-[22%]">
                  <p className="text-[14px]">Free</p>
                  <p className="text-[24px] font-bold text-teal-600">
                    {realTimeDataCount?.agentCount?.free}
                  </p>
                </div>
                <div className="border-l-4  px-5 border-teal-700 w-[22%]">
                  <p className="text-[14px]">Inactive</p>
                  <p className="text-[24px] font-bold text-teal-600">
                    {realTimeDataCount?.agentCount?.inActive}
                  </p>
                </div>
                <div className="border-l-4  px-5 border-teal-700 w-[22%]">
                  <p className="text-[14px]">Busy</p>
                  <p className="text-[24px] font-bold text-teal-600">
                    {realTimeDataCount?.agentCount?.busy}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default RealTimeDataCount;
