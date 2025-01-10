import { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import RenderIcon from "@/icons/RenderIcon";

import AuthContext from "@/context/AuthContext";

const MainSideBar = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedLink, setSelectedLink] = useState("");
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const location = useLocation();
  const { role } = useContext(AuthContext);

  useEffect(() => {
    setSelectedLink(location.pathname);

    const path = location.pathname;

    if (path.includes("marketing")) setOpenDropdown("marketing");
    else if (path.includes("notification")) setOpenDropdown("notification");
    else if (path.includes("configure")) setOpenDropdown("configure");
    else if (path.includes("customize")) setOpenDropdown("customize");
    else if (path.includes("account")) setOpenDropdown("account");
    else setOpenDropdown(null);
  }, [location.pathname]);

  const toggleSidebar = (dropdown) => () => {
    setOpenDropdown((prevDropdown) =>
      prevDropdown === dropdown ? null : dropdown
    );
  };

  return (
    <div className="fixed w-[270px] h-full bg-gradient-to-b from-[#016B6C] to-[#000] bg-[length:100%_150%] bg-top font-poppins overflow-y-auto pb-[50px] z-20 overflow-element">
      <div className="flex gap-3 ml-[10px] mt-[30px]">
        <div
          className="w-[140px] h-[30px] bg-gray-300 animate-pulse"
          style={{ display: isImageLoaded ? "none" : "block" }}
        />
        <img
          src="https://firebasestorage.googleapis.com/v0/b/famtowebsite.appspot.com/o/images%2FWhite.svg?alt=media&token=3d91a036-029f-4d67-816e-19b1f8dd3f6e"
          alt="Logo"
          className="w-[140px] h-[30px]"
          style={{ display: isImageLoaded ? "block" : "none" }}
          onLoad={() => setIsImageLoaded(true)}
        />
      </div>
      <div className="dropside ">General</div>

      <ul className="ul-side">
        <Link
          to="/home"
          className={`ps-4 side ${
            selectedLink === "/home" ? "selected-link" : ""
          }`}
          key="home"
        >
          <span className="m-2">
            <RenderIcon iconName="HomeIcon" size={22} loading={6} />
          </span>
          <span className="font-[poppins]">Home</span>
        </Link>
        <Link
          to="/order"
          className={`ps-4 side ${selectedLink.startsWith("/order") ? "selected-link" : ""}`}
          key="order"
        >
          <span className="m-2">
            <RenderIcon iconName="BookIcon" size={22} loading={6} />
          </span>

          <span className="font-[poppins]">Orders</span>
        </Link>
        {role === "Admin" && (
          <Link
            to={"/merchant"}
            className={`ps-4 side ${selectedLink.startsWith("/merchant") ? "selected-link" : ""}`}
            key="merchant"
          >
            <span className="m-2">
              <RenderIcon iconName="ShopIcon" size={22} loading={6} />
            </span>

            <span className="font-[poppins]">Merchants</span>
          </Link>
        )}
        <Link
          to="/product"
          className={`ps-4 side ${selectedLink.startsWith("/product") ? "selected-link" : ""}`}
          key="product"
        >
          <span className="m-2">
            <RenderIcon iconName="ProductIcon" size={22} loading={6} />
          </span>

          <span className="font-[poppins]">Products</span>
        </Link>
        <Link
          to="/customer"
          className={`ps-4 side ${selectedLink.startsWith("/customer") ? "selected-link" : ""}`}
          key="customer"
        >
          <span className="m-2">
            <RenderIcon iconName="UsersIcon" size={22} loading={6} />
          </span>

          <span className="font-[poppins]">Customers</span>
        </Link>

        {role === "Admin" && (
          <>
            <Link
              to="/agent"
              className={`ps-4 side ${selectedLink.startsWith("/agent") ? "selected-link" : ""}`}
              key="agent"
            >
              <span className="m-2">
                <RenderIcon iconName="AgentIcon" size={22} loading={6} />
              </span>

              <span className="font-[poppins]">Delivery Agents</span>
            </Link>

            <Link
              to="/delivery-management"
              className={`ps-4 side ${selectedLink.startsWith("/delivery-management") ? "selected-link" : ""}`}
              key="delivery-management"
            >
              <span className="m-2">
                <RenderIcon iconName="BikeIcon" size={22} loading={6} />
              </span>

              <span className="font-[poppins]">Delivery Management</span>
            </Link>
          </>
        )}

        <Link
          to="/comm-and-subs"
          className={`ps-4 side ${selectedLink.startsWith("/comm-and-subs") ? "selected-link" : ""}`}
          key="comm"
        >
          <span className="m-2">
            <RenderIcon iconName="PercentageIcon" size={22} loading={6} />
          </span>

          <span className="font-[poppins]">Commission/Subscription</span>
        </Link>
        {role === "Admin" && (
          <Link
            to="/chat"
            className={`ps-4 side ${selectedLink.startsWith("/chat") ? "selected-link" : ""}`}
            key="chat"
          >
            <span className="m-2">
              <RenderIcon iconName="WhatsappIcon" size={22} loading={6} />
            </span>

            <span className="font-[poppins]">Whatsapp</span>
          </Link>
        )}
      </ul>

      {role === "Admin" && (
        <>
          <div className="dropside" onClick={toggleSidebar("marketing")}>
            <span className="font-[poppins]">Marketing</span>
            <button>
              <RenderIcon
                iconName="AngleRightDropDownIcon"
                size={24}
                loading={2}
              />
            </button>
          </div>
          {openDropdown === "marketing" && (
            <ul className="ul-side">
              <Link
                to="/marketing/discount"
                className={`ps-4 side pt-1 pb-1 ${
                  selectedLink === "/marketing/discount" ? "selected-link" : ""
                }`}
              >
                <span className="m-2">
                  <RenderIcon iconName="GiftIcon" size={22} loading={6} />
                </span>
                <span className="font-[poppins]">Discount</span>
              </Link>

              <>
                <Link
                  to="/marketing/ad-banner"
                  className={`ps-4 side ${
                    selectedLink === "/marketing/ad-banner"
                      ? "selected-link"
                      : ""
                  }`}
                >
                  <span className="m-2">
                    <RenderIcon iconName="AdBannerIcon" size={22} loading={6} />
                  </span>
                  <span className="font-[poppins]">Ad banner</span>
                </Link>

                <Link
                  to="/marketing/loyalty-point"
                  className={`ps-4 side ${
                    selectedLink === "/marketing/loyalty-point"
                      ? "selected-link"
                      : ""
                  }`}
                >
                  <span className="m-2">
                    <RenderIcon
                      iconName="LoyaltyPointIcon"
                      size={22}
                      loading={6}
                    />
                  </span>
                  <span className="font-[poppins]">Loyalty Point</span>
                </Link>

                <Link
                  to="/marketing/promo-code"
                  className={`ps-4 side ${
                    selectedLink === "/marketing/promo-code"
                      ? "selected-link"
                      : ""
                  }`}
                >
                  <span className="m-2">
                    <RenderIcon
                      iconName="PromoCodeIcon"
                      size={22}
                      loading={6}
                    />
                  </span>
                  <span className="font-[poppins]">Promo code</span>
                </Link>

                <Link
                  to="/marketing/referral"
                  className={`ps-4 side ${
                    selectedLink === "/marketing/referral"
                      ? "selected-link"
                      : ""
                  }`}
                >
                  <span className="m-2">
                    <RenderIcon iconName="ReferralIcon" size={22} loading={6} />
                  </span>

                  <span className="font-[poppins]">Referral</span>
                </Link>
              </>
            </ul>
          )}
        </>
      )}

      <div className="dropside" onClick={toggleSidebar("notification")}>
        <span className="font-[poppins]">Notification</span>
        <button>
          <RenderIcon iconName="AngleRightDropDownIcon" size={24} loading={2} />
        </button>
      </div>
      {openDropdown === "notification" && (
        <ul className="ul-side">
          <Link
            to="/notification/logs"
            className={`ps-4 side ${
              selectedLink === "/notification/logs" ? "selected-link" : ""
            }`}
          >
            <span className="m-2">
              <RenderIcon iconName="NotificationIcon" size={22} loading={6} />
            </span>
            <span className="font-[poppins]">Notification log</span>
          </Link>

          {role === "Admin" && (
            <>
              <Link
                to="/notification/push-notification"
                className={`ps-4 side ${
                  selectedLink === "/notification/push-notification"
                    ? "selected-link"
                    : ""
                }`}
              >
                <span className="m-2">
                  <RenderIcon
                    iconName="PushNotificationIcon"
                    size={22}
                    loading={6}
                  />
                </span>
                <span className="font-[poppins]">Push Notification</span>
              </Link>

              <Link
                to="/notification/settings"
                className={`ps-4 side ${
                  selectedLink === "/notification/settings"
                    ? "selected-link"
                    : ""
                }`}
              >
                <span className="m-2">
                  <RenderIcon
                    iconName="NotificationSettingsIcon"
                    size={22}
                    loading={6}
                  />
                </span>
                <span className="font-[poppins]">Notification Settings</span>
              </Link>

              <Link
                to="/notification/alert-notification"
                className={`ps-4 side ${
                  selectedLink === "/notification/alert-notification"
                    ? "selected-link"
                    : ""
                }`}
              >
                <span className="m-2">
                  <RenderIcon
                    iconName="AlertNotificationIcon"
                    size={22}
                    loading={6}
                  />
                </span>
                <span className="font-[poppins]">Alert Notification</span>
              </Link>
            </>
          )}
        </ul>
      )}

      {role === "Admin" && (
        <>
          <div className="dropside" onClick={toggleSidebar("configure")}>
            <span className="font-[poppins]">Configure</span>
            <button>
              <RenderIcon
                iconName="AngleRightDropDownIcon"
                size={24}
                loading={2}
              />
            </button>
          </div>
          {openDropdown === "configure" && (
            <ul className="ul-side">
              <Link
                to="/configure/managers"
                className={`ps-4 side flex items-center ${
                  selectedLink === "/configure/managers" ? "selected-link" : ""
                }`}
              >
                <span className="m-2">
                  <RenderIcon iconName="ManagerIcon" size={22} loading={6} />
                </span>
                <span className="font-[poppins]">Managers</span>
              </Link>

              <Link
                to="/configure/pricing"
                className={`ps-4 side flex items-center ${
                  selectedLink === "/pricing" ? "selected-link" : ""
                }`}
              >
                <span className="m-2">
                  <RenderIcon iconName="PricingIcon" size={22} loading={6} />
                </span>
                <span className="font-[poppins]">Pricing</span>
              </Link>

              <Link
                to="/configure/tax"
                className={`ps-4 side ${
                  selectedLink === "/configure/tax" ? "selected-link" : ""
                }`}
              >
                <span className="m-2">
                  <RenderIcon iconName="PercentageIcon" size={22} loading={6} />
                </span>
                <span className="font-[poppins]">Tax</span>
              </Link>

              <Link
                to="/configure/geofence"
                className={`ps-4 side ${
                  selectedLink === "/configure/geofence" ? "selected-link" : ""
                }`}
              >
                <span className="m-2">
                  <RenderIcon iconName="GeofenceIcon" size={22} loading={6} />
                </span>
                <span className="font-[poppins]">Geofence</span>
              </Link>
            </ul>
          )}

          <div className="dropside" onClick={toggleSidebar("customize")}>
            <span className="font-[poppins]">App Customization</span>
            <button>
              <RenderIcon
                iconName="AngleRightDropDownIcon"
                size={24}
                loading={2}
              />
            </button>
          </div>
          {openDropdown === "customize" && (
            <ul className="ul-side">
              <Link
                to="/customize/customer-app"
                className={`ps-4 side flex items-center ${
                  selectedLink === "/customize/customer-app"
                    ? "selected-link"
                    : ""
                }`}
              >
                <span className="m-2">
                  <RenderIcon
                    iconName="CustomizationIcon"
                    size={22}
                    loading={6}
                  />
                </span>
                <span className="font-[poppins]">Customer App</span>
              </Link>

              <Link
                to="/customize/agent-app"
                className={`ps-4 side flex items-center ${
                  selectedLink === "/customize/agent-app" ? "selected-link" : ""
                }`}
              >
                <span className="m-2">
                  <RenderIcon
                    iconName="CustomizationIcon"
                    size={22}
                    loading={6}
                  />
                </span>
                <span className="font-[poppins]">Agent App</span>
              </Link>

              <Link
                to="/customize/merchant-app"
                className={`ps-4 side flex items-center ${
                  selectedLink === "/customize/merchant-app"
                    ? "selected-link"
                    : ""
                }`}
              >
                <span className="m-2">
                  <RenderIcon
                    iconName="CustomizationIcon"
                    size={22}
                    loading={6}
                  />
                </span>
                <span className="font-[poppins]">Merchant App</span>
              </Link>
            </ul>
          )}
        </>
      )}

      <div className="dropside" onClick={toggleSidebar("account")}>
        <span className="font-[poppins]">Account</span>
        <button>
          <RenderIcon iconName="AngleRightDropDownIcon" size={24} loading={2} />
        </button>
      </div>
      {openDropdown === "account" && (
        <ul className="ul-side">
          {role === "Admin" && (
            <>
              <Link
                to="/account/activity-logs"
                className={`ps-4 side ${
                  selectedLink === "/account/activity-logs"
                    ? "selected-link"
                    : ""
                }`}
              >
                <span className="m-2">
                  <RenderIcon iconName="ActivityIcon" size={22} loading={6} />
                </span>
                <span className="font-[poppins]">Activity logs</span>
              </Link>

              <Link
                to="/account/account-logs"
                className={`ps-4 side ${
                  selectedLink === "/account/account-logs"
                    ? "selected-link"
                    : ""
                }`}
              >
                <span className="m-2">
                  <RenderIcon iconName="AccountIcon" size={22} loading={6} />
                </span>
                <span className="font-[poppins]">Account logs</span>
              </Link>
            </>
          )}

          <Link
            to="/account/settings"
            className={`ps-4 side ${
              selectedLink === "/account/settings" ? "selected-link" : ""
            }`}
          >
            <span className="m-2">
              <RenderIcon iconName="SettingsIcon" size={22} loading={6} />
            </span>
            <span className="font-[poppins]">Settings</span>
          </Link>
        </ul>
      )}
    </div>
  );
};

export default MainSideBar;
