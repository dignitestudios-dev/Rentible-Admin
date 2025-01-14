import React, { useState } from "react";
import { BsReplyAll } from "react-icons/bs";
const TicketCard = ({ ticket, number, setUpdate }) => {
  return (
    <div className="w-full relative h-auto flex flex-col gap-2 justify-start items-start bg-white border p-4 rounded-2xl">
      <div className="w-full  border-b pb-4 h-auto flex flex-col gap-[4px] justify-start items-start">
        <div className="w-auto flex mb-3 justify-start items-center gap-3">
          <span className="w-7 h-7 rounded-full bg-orange-500/20"></span>
          <h1 className="text-2xl font-bold text-black">
            Ticket #{number + 1}
          </h1>
        </div>

        <span className="text-[#2E2C34] text-[14px] font-medium">
          {ticket?.title}
        </span>
        <span className="text-[#84818A] text-[12px] font-medium">
          {ticket?.description}
        </span>
      </div>

      <div className="w-full h-10 flex justify-between items-end">
        <div className="w-auto flex justify-start items-center gap-3">
          <span className="w-full  flex items-center gap-2 justify-start h-full ">
            <span className="w-[44px] h-[44px] border border-[#F85E00] rounded-full flex items-center justify-center ">
              <img
                src={
                  ticket?.user?.profilePicture ||
                  `https://craftypixels.com/placeholder-image/50x50/c00000/fff&text=${ticket?.user?.name?.slice(
                    0,
                    1
                  )}`
                }
                alt="store_image"
                className="w-[38px] h-[38px] rounded-full"
              />
            </span>
            <div className="w-auto flex flex-col justify-center items-start">
              <span className="text-sm font-medium text-[#262626]">
                {ticket?.user?.name}
              </span>
              <span className="text-xs font-medium text-[#262626]">
                {ticket?.user?.email}
              </span>
            </div>
          </span>
        </div>

        <div className="flex gap-1 justify-start items-end">
          <a
            href={`mailto:${ticket?.user?.email}`}
            className="w-auto  px-2 h-7 bg-[#F85E00]  text-[#fff] no-underline hover:text-white focus-within:text-white focus:text-white hover:no-underline focus-within:no-underline focus:no-underline rounded-lg font-medium  flex items-center justify-center gap-2"
          >
            <BsReplyAll className="text-lg" />
            <span className="text-sm">Reply</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
