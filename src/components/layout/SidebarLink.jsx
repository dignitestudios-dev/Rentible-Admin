import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const SidebarLink = ({ title, light_icon, dark_icon, url, sub }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const active = localStorage.getItem("activeLink") === title;

  useEffect(() => {
    // Close submenu when activeLink changes to a different item
    if (!active) {
      setOpen(false);
    }
  }, [active]);

  const handleClick = () => {
    if (sub) {
      setOpen((prev) => !prev); // Toggle submenu
      const newActive =
        localStorage.getItem("activeLink") === title ? "" : title;
      localStorage.setItem("activeLink", newActive);
    } else {
      setOpen(false); // Close submenu
      localStorage.setItem("activeLink", title);
      localStorage.setItem("subLink", title);
      navigate(url);
    }
  };

  return sub ? (
    <div className="w-full bg-white flex flex-col justify-start items-start">
      <div className="w-full h-[50px] flex justify-start items-start">
        <span
          className={`w-[4px] rounded-r-md ${active && "bg-[#F85E00]"} h-full`}
        ></span>
        <button
          onClick={handleClick}
          className="w-[calc(100%-4px)] pr-2 flex items-center justify-end h-full"
        >
          <span
            className={`w-[211px] ${
              active ? "bg-[#F85E00] h-[33px] text-white" : "text-black"
            } flex items-center justify-start gap-3 px-3 h-full ${
              open ? "rounded-t-md" : "rounded-md"
            }`}
          >
            <img
              src={active ? light_icon : dark_icon}
              alt="sidebarlink-icon"
              className="w-[24px] h-[24px] object-center"
            />
            <span className={`text-[14px] font-medium leading-[21px]`}>
              {title}
            </span>
          </span>
        </button>
      </div>
      {open && (
        <div className="w-full h-[99px] flex justify-between pr-2 items-start">
          <span className={`w-[4px] rounded-r-md h-full`}></span>
          <div className="w-[211px] bg-[#F85E00]/[0.10] rounded-b-md p-2 gap-1 h-full flex flex-col justify-start items-start">
            {sub?.map((subLink, key) => {
              const subActive =
                localStorage.getItem("subLink") === subLink?.title;
              return (
                <button
                  key={key}
                  onClick={() => {
                    navigate(subLink?.url);
                    localStorage.setItem("subLink", subLink?.title);
                  }}
                  className="w-full flex items-center justify-end h-full"
                >
                  <span
                    className={`w-[211px] ${
                      subActive
                        ? "bg-[#F85E00] text-white"
                        : "bg-white text-black"
                    } flex items-center justify-start gap-3 px-3 h-full rounded-md`}
                  >
                    <span className={`text-[14px] font-medium leading-[21px]`}>
                      {subLink?.title}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  ) : (
    <div className="w-full bg-white h-[50px] flex justify-start items-start">
      <span
        className={`w-[4px] rounded-r-md ${active && "bg-[#F85E00]"} h-full`}
      ></span>
      <button
        onClick={handleClick}
        className="w-[calc(100%-4px)] pr-2 flex items-center justify-end h-full"
      >
        <span
          className={`w-[211px] ${
            active ? "bg-[#F85E00] text-white" : "text-black"
          } flex items-center justify-start gap-3 px-3 h-full rounded-md`}
        >
          <img
            src={active ? light_icon : dark_icon}
            alt="sidebarlink-icon"
            className="w-[24px] h-[24px] object-center"
          />
          <span className={`text-[14px] font-medium leading-[21px]`}>
            {title}
          </span>
        </span>
      </button>
    </div>
  );
};

export default SidebarLink;
