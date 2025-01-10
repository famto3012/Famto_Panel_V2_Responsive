import GlobalSearch from "@/components/others/GlobalSearch";
import AppAdBanner from "@/components/adBanner/AppAdBanner";
import IndividualBanner from "@/components/adBanner/IndividualBanner";

const AdBanner = () => {
  return (
    <div className="bg-gray-100 h-full">
      <GlobalSearch />

      <div className="flex items-center justify-between mx-10 mt-5">
        <h1 className="text-lg font-bold outline-none focus:outline-none">
          Ad Banner
        </h1>
      </div>
      <p className="mt-5 mx-10 text-[15px] text-gray-500">
        The purpose of a promotional banner is to promote a store. It can be
        used to display offers new
        <span className="flex justify-start">
          available items or discounts etc
        </span>
      </p>

      <AppAdBanner />

      <IndividualBanner />
    </div>
  );
};

export default AdBanner;
