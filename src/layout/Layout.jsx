import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import Routers from "@/routes/Routers";

import SmallSideBar from "@/components/sideBar/SmallSideBar";
import MainSideBar from "@/components/sideBar/MainSideBar";

import AppDownload from "@/screens/other/AppDownload";

const Layout = () => {
  const location = useLocation();
  const path = location.pathname;

  const pathsForNoSideBar = [
    "sign-in",
    "sign-up",
    "verify",
    "success",
    "forgot-password",
    "reset-password",
    "maintenance",
  ];
  const pathsForSmallSidebar = ["delivery-management", "payout"];

  const noSidebar = pathsForNoSideBar.some((p) => path.includes(p));
  const showSmallSidebar = pathsForSmallSidebar.some((p) => path.includes(p));

  const [isWideScreen, setIsWideScreen] = useState(window.innerWidth >= 1080);

  useEffect(() => {
    const handleResize = () => {
      setIsWideScreen(window.innerWidth >= 1080);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (!isWideScreen) {
    return <AppDownload />;
  }

  return (
    <>
      {!noSidebar && (showSmallSidebar ? <SmallSideBar /> : <MainSideBar />)}
      <main
        className={`h-screen w-full ${
          noSidebar ? "" : showSmallSidebar ? "ps-[4rem]" : "ps-[270px]"
        }`}
      >
        <Routers />
      </main>
    </>
  );
};

export default Layout;
