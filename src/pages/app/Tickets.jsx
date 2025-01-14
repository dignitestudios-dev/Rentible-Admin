import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import axios from "../../axios";
import { ErrorToast, SuccessToast } from "../../components/global/Toaster";
import TicketCard from "../../components/app/tickets/TicketCard";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";

const Tickets = () => {
  const [searchQuery, setSearchQuery] = useState(""); // Search query state

  const [search, setSearch] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setSearch(searchQuery);
    }, 400);
  }, [searchQuery]);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);

  const [pagination, setPagination] = useState({
    itemsPerPage: 0,
    currentPage: 0,
    totalItems: 0,
    totalPages: 0,
  }); // Updated variable name to camelCase
  const [currentPage, setCurrentPage] = useState(1);

  const getTickets = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/support");
      console.log(data?.data);
      setData(data?.data || []); // Ensure we set an empty array if no data
      setPagination(data?.pagination);
    } catch (error) {
      ErrorToast(error?.response?.data?.message);

      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTickets();
  }, [update]);

  const filteredData = data?.filter((ticket) => {
    if (!ticket) return false; // Skip null or undefined tickets.

    const lowerCaseSearch = search?.toLowerCase() || "";

    // Debugging: Check tab and ticket.isClosed values

    // Match logic
    const matchesSearch =
      ticket?.user?.name?.toLowerCase()?.includes(lowerCaseSearch) ||
      ticket?.user?.email?.toLowerCase()?.includes(lowerCaseSearch) ||
      ticket?.title?.toLowerCase()?.includes(lowerCaseSearch);

    return matchesSearch;
  });

  return (
    <div className="w-full h-auto  flex flex-col  py-4 px-2 lg:px-6 justify-start items-start gap-6">
      <div className="w-full flex px-1 justify-between items-center ">
        <h3 className="text-[24px] font-bold text-black">
          <span className="text-[26px] md:text-[28px] lg:text-[32px] font-bold leading-[48px] text-[#202224]">
            Tickets
          </span>
          <span className="text-[16px] text-gray-500">
            ({filteredData?.length})
          </span>
        </h3>
        {/* Filters and Search Bar */}
        <div className="flex gap-2">
          {/* Search Input */}
          <div className="relative w-[256px] bg-white h-[49px] flex items-start justify-start rounded-[8px] border border-gray-300">
            <span className="w-[40px] h-full flex items-center justify-center ">
              <FiSearch className="  text-gray-400" />
            </span>
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="    text-sm text-gray-700 bg-white focus:outline-none w-[calc(100%-40px)] h-full rounded-r-[8px]" // Increased size
            />
          </div>
        </div>
      </div>

      <div className="w-full  h-auto relative l     grid grid-cols-2 gap-2">
        {filteredData?.length > 0 ? (
          filteredData?.map((ticket, key) => {
            return (
              <TicketCard
                ticket={ticket}
                key={key}
                number={key}
                setUpdate={setUpdate}
              />
            );
          })
        ) : (
          <div className="w-full min-h-[70vh] bg-white rounded-[14px] flex col-span-2 flex-col items-center justify-center">
            {/* <img src="/no-data.png" alt="" className="w-[230px]" /> */}
            <span className="font-semibold text-center text-[#0e0e10] text-[24px] ">
              You don’t have added any <br /> Listing Here
            </span>
          </div>
        )}
      </div>

      {!loading && data?.length > 0 && (
        <div className="min-w-[960px] w-full  px-2 flex justify-between items-center">
          <span className="text-[16px] font-normal text-black">
            You have {pagination?.currentPage} of {pagination?.totalPages} Pages
          </span>

          <div className="w-auto flex items-center justify-start  px-3 h-[61px] gap-2 rounded-full bg-white">
            <button
              disabled={currentPage == 1}
              onClick={() =>
                setCurrentPage((prev) => (prev !== 1 ? prev - 1 : prev))
              }
              className="w-[43px] h-[43px] rounded-full bg-gray-200 flex items-center justify-center text-3xl text-[#000] disabled:text-[#909090]"
            >
              <RxCaretLeft />
            </button>

            <div className="w-auto flex justify-center items-center h-[43px] rounded-full px-2  bg-gray-200">
              {Array.from({ length: pagination?.totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`w-[33px] h-[33px]  ${
                    currentPage == index + 1
                      ? "bg-[#F85E00] text-white"
                      : "bg-transparent text-[#909090]"
                  } hover:bg-[#F85E00]/[0.4] hover:text-[#000]/[0.8] flex items-center rounded-full justify-center`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <button
              disabled={currentPage == pagination?.totalPages}
              onClick={() =>
                setCurrentPage((prev) =>
                  prev !== pagination?.totalPages ? prev + 1 : prev
                )
              }
              className="w-[43px] h-[43px] rounded-full bg-gray-200 flex items-center justify-center text-3xl text-[#000] disabled:text-[#909090]"
            >
              <RxCaretRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tickets;
