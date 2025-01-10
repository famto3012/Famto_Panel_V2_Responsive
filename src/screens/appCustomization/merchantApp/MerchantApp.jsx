import Toggles from "@/components/merchantAppCustomization/Toggles";
import GlobalSearch from "@/components/others/GlobalSearch";

const MerchantApp = () => {
  return (
    <div className="bg-gray-100 min-h-full">
      <GlobalSearch />
      <Toggles />
    </div>
  );
};

export default MerchantApp;
