import { useContext, useEffect, useState } from "react";

import { Switch } from "@/components/ui/switch";

import AuthContext from "@/context/AuthContext";

import { HStack } from "@chakra-ui/react";
import { RadioCardItem, RadioCardRoot } from "@/components/ui/radio-card";

import { formatDate } from "@/utils/formatter";

const SponsorshipDetail = ({ detail }) => {
  const [haveSponsorship, setHaveSponsorship] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const { role, userId } = useContext(AuthContext);

  useEffect(() => {
    detail?.sponsorshipStatus && setHaveSponsorship(detail?.sponsorshipStatus);
    detail?.currentPlan && setSelectedPlan(detail?.currentPlan);
  }, [detail]);

  return (
    <>
      <div className="mb-6 flex w-[1200px]">
        <div className="flex justify-between rounded">
          <h3 className="text-gray-700 mb-2 mt-3 w-1/3">Sponsorship Status</h3>

          <div
            className={`${
              detail?.currentPlan ? `visible` : ` invisible`
            } mb-4 w-[30rem] p-5 justify-center text-center mx-[3.5rem] shadow-lg `}
          >
            <label className="block text-teal-700 font-[600] mb-[10px] text-[16px]">
              Current Chosen Plan
            </label>
            <div className="flex items-center gap-3 text-teal-700 text-[16px] font-[600]">
              <p className="">{detail?.currentPlan} plan</p> |
              <p>
                {formatDate(detail?.startDate)} - {formatDate(detail?.endDate)}
              </p>
            </div>
          </div>

          <Switch
            colorPalette="teal"
            checked={haveSponsorship}
            onCheckedChange={() => setHaveSponsorship(!haveSponsorship)}
          />
        </div>
      </div>

      {haveSponsorship && (
        <div className="mb-6 flex w-[800px]">
          <h3 className="text-gray-700 mb-2 w-1/3">Choose or Renew Plan</h3>

          <div className="w-4/5">
            <div className="">
              <RadioCardRoot colorPalette="teal" defaultValue={selectedPlan}>
                <HStack align="stretch">
                  {[
                    { value: "299", label: "Monthly", price: "299" },
                    { value: "799", label: "3 Month", price: "799" },
                    { value: "1399", label: "6 Month", price: "1399" },
                    { value: "2999", label: "1 Year", price: "2999" },
                  ].map((item) => (
                    <RadioCardItem
                      label={item.label}
                      description={item.price}
                      key={item.value}
                      value={item.label || selectedPlan}
                      className="cursor-pointer"
                    />
                  ))}
                </HStack>
              </RadioCardRoot>
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                className="bg-teal-700 text-white p-2 rounded-md w-[20rem] mt-4"
                onClick={() => {}}
              >
                Pay
              </button>

              <p className="w-[25rem] text-[14px] text-gray-700">
                Note: Choose the date range for showing your shop on top of the
                sheet and reach your customers more easily.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SponsorshipDetail;
