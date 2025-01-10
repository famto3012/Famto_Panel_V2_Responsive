import Toggles from "@/components/agentAppCustomization/Toggles";
import GlobalSearch from "@/components/others/GlobalSearch";

const AgentApp = () => {
  return (
    <div className="bg-gray-100 min-h-full">
      <GlobalSearch />
      <Toggles />
    </div>
  );
};

export default AgentApp;
