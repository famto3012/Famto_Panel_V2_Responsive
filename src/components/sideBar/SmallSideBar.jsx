import { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import RenderIcon from "@/icons/RenderIcon";

import AuthContext from "@/context/AuthContext";

const SmallSideBar = () => {
  const [selectedLink, setSelectedLink] = useState("");
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const { role } = useContext(AuthContext);
  const location = useLocation();

  useEffect(() => {
    setSelectedLink(location.pathname);
  }, [location.pathname]);

  return (
    <div className="fixed w-[4rem] h-full bg-gradient-to-b from-[#016B6C] to-[#000] bg-[length:100%_150%] bg-top font-poppins overflow-y-auto">
      <div className="flex gap-3 ml-[18px] mt-[30px] w-[30px]">
        <div
          className="w-[140px] h-[30px] bg-gray-300 animate-pulse"
          style={{ display: isImageLoaded ? "none" : "block" }}
        />
        <img
          src="https://firebasestorage.googleapis.com/v0/b/famto-aa73e.appspot.com/o/admin_panel_assets%2Fwhitelogo.svg?alt=media&token=a7436647-2de7-4fee-8e3a-5c637bd0bc61"
          alt="Logo"
          className="w-[140px]"
          style={{ display: isImageLoaded ? "block" : "none" }}
          onLoad={() => setIsImageLoaded(true)}
        />
      </div>
      <div className="dropside"></div>

      <ul className="ul-side">
        <Link to="/home" className="side">
          <span className="m-2">
            <RenderIcon iconName="HomeIcon" size={22} loading={6} />
          </span>
        </Link>
        <Link
          to="/order"
          className={`side ${selectedLink === "/order" || /^\/order\/[A-Za-z0-9]+$/.test(selectedLink) ? "selected-link" : ""}`}
        >
          <span className="m-2">
            <RenderIcon iconName="BookIcon" size={22} loading={6} />
          </span>
        </Link>
        <Link
          to="/merchant"
          className={`side ${
            selectedLink === "/merchant/payout" ? "selected-link" : ""
          }`}
        >
          <span className="m-2">
            <RenderIcon iconName="ShopIcon" size={22} loading={6} />
          </span>
        </Link>
        <Link to="/product" className="side">
          <span className="m-2">
            <RenderIcon iconName="ProductIcon" size={22} loading={6} />
          </span>
        </Link>
        <Link to="/customer" className="side">
          <span className="m-2">
            <RenderIcon iconName="UsersIcon" size={22} loading={6} />
          </span>
        </Link>
        <Link
          to="/agent"
          className={`side ${
            selectedLink === "/agent/payout" ? "selected-link" : ""
          }`}
        >
          <span className="m-2">
            <RenderIcon iconName="AgentIcon" size={22} loading={6} />
          </span>
        </Link>
        <Link
          to="/delivery-management"
          className={` side ${
            selectedLink === "/delivery-management" ? "selected-link" : ""
          }`}
        >
          <span className="m-2">
            <RenderIcon iconName="BikeIcon" size={22} loading={6} />
          </span>
        </Link>
        <Link to="/comm-and-subs" className="side">
          <span className="m-2">
            <RenderIcon iconName="PercentageIcon" size={22} loading={6} />
          </span>
        </Link>
        {role === "Admin" && (
          <Link
            to="/chat"
            className={` side ${
              selectedLink === "/chat" ? "selected-link" : ""
            }`}
          >
            <span className="m-2">
              <RenderIcon iconName="WhatsappIcon" size={22} loading={6} />
            </span>
          </Link>
        )}
      </ul>
    </div>
  );
};

export default SmallSideBar;
