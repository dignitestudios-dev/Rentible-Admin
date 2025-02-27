import React, { useCallback, useEffect, useState } from "react";
import DateFilterModal from "./DateFilterModal";
import { FiSearch } from "react-icons/fi";
import {
  convertToUTCTimestamp,
  formatDateToMMDDYYYY,
} from "../../../utils/helper";
import { IoCalendarOutline } from "react-icons/io5";
import Cookies from "js-cookie";
import axios from "../../../axios";
import { ErrorToast } from "../../global/Toaster";
import _, { slice } from "lodash";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";
import { BsCheckLg } from "react-icons/bs";
import IssueListSkeleton from "../../../skeletons/app/product_issue/IssueListSkeleton";
import ProductIssueModal from "../product_issue/ProductIssueModal";
import { useParams } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import ProductReviewModal from "./ProductReviewModal";

const ProductReviews = () => {
  const { id } = useParams();
  const [openFilterFrom, setOpenFilterFrom] = useState(false);
  const [openFilterTo, setOpenFilterTo] = useState(false);
  const [search, setSearch] = useState("");
  const [initialDate, setInitialDate] = useState(null);
  const [finalDate, setFinalDate] = useState(null);
  const [isApplied, setIsApplied] = useState(false);
  const [openCalendar, setOpenCalendar] = useState(false);

  // Throttled function using lodash.throttle
  const throttledSearch = useCallback(
    _.throttle((query) => {
      getIssues(query);
    }, 1000),
    []
  );

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    throttledSearch(value); // Call the throttled function
  };

  const [issues, setIssues] = useState([]); // Updated variable name to camelCase
  const [pagination, setPagination] = useState({
    itemsPerPage: 0,
    currentPage: 0,
    totalItems: 0,
    totalPages: 0,
  }); // Updated variable name to camelCase

  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);
  //   const store = JSON.parse(Cookies.get("store"));
  const [currentPage, setCurrentPage] = useState(1);

  const getIssues = async (query = "") => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `/review?productId=${id}&search=${query}${
          initialDate
            ? `&startDate=${convertToUTCTimestamp(
                formatDateToMMDDYYYY(initialDate)
              )}`
            : ""
        }${
          finalDate
            ? `&endDate=${convertToUTCTimestamp(
                formatDateToMMDDYYYY(finalDate),
                "end"
              )}`
            : ""
        }&page=${currentPage}&limit=9`
      );
      setIssues(data?.data); // Store the actual data from the response
      setPagination(data?.pagination);
      setIsApplied(false);
    } catch (error) {
      ErrorToast(error?.response?.data?.message || "Something went wrong.");
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  //

  useEffect(() => {
    getIssues();
  }, [update, isApplied, currentPage]);

  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);

  return (
    <div className="w-full h-auto  flex flex-col  py-4 justify-start items-start gap-6">
      <div className="w-full h-auto flex flex-col gap-3 justify-start items-start">
        <div className="w-full relative flex flex-col lg:flex-row justify-between lg:items-center">
          <span className="text-[26px] md:text-[28px] lg:text-[32px] font-bold leading-[48px] text-[#202224]">
            Product Reviews
          </span>
          <div className="w-auto flex justify-start items-center gap-3">
            <div className="relative w-[256px] bg-white h-[49px] flex items-start justify-start rounded-[8px] border border-gray-300">
              <span className="w-[40px] h-full flex items-center justify-center ">
                <FiSearch className="  text-gray-400" />
              </span>
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={handleInputChange}
                className="    text-sm text-gray-700 focus:outline-none w-[calc(100%-40px)] h-full rounded-r-[8px]" // Increased size
              />
            </div>

            <button
              onClick={() => {
                setIsApplied(openCalendar && false);
                setOpenCalendar((prev) => !prev);
              }}
              className="w-[49px] h-[49px] rounded-[8px] bg-[#F85E00] flex items-center justify-center"
            >
              <img
                src="/filter_icon.png"
                alt=""
                className="w-[27px] h-[27px]"
              />
            </button>
          </div>

          <div
            className={`w-[330px] h-[316px] absolute top-28 lg:top-14 right-0 transition-all duration-300 bg-white rounded-[14px] shadow-md py-3 px-6 ${
              openCalendar ? "translate-x-0" : "translate-x-[600px]"
            } flex flex-col justify-start items-start z-50`}
          >
            <span className="w-full h-9 text-[18px] font-semibold text-black flex items-center justify-start  border-b border-gray-300">
              Filter
            </span>
            <div className="w-full mt-4 flex flex-col justify-start items-start gap-3 ">
              <div className="w-full flex flex-col gap-1  justify-start items-start ">
                <label
                  htmlFor=""
                  className="text-[14px] ml-1 font-normal text-black"
                >
                  Start Date
                </label>
                <div className="w-full h-[49px] relative rounded-[14px] bg-gray-50 flex items-center justify-start px-3">
                  <span className="text-md font-normal text-black">
                    {initialDate
                      ? formatDateToMMDDYYYY(initialDate)
                      : "--/--/----"}
                  </span>
                  <buton
                    onClick={() => setOpenFilterFrom(true)}
                    className="absolute cursor-pointer top-1/2 text-xl right-3 transform -translate-y-1/2 text-orange-500"
                  >
                    <IoCalendarOutline />
                  </buton>
                </div>
              </div>
              <div className="w-full flex flex-col gap-1  justify-start items-start ">
                <label
                  htmlFor=""
                  className="text-[14px] ml-1 font-normal text-black"
                >
                  End Date
                </label>
                <div className="w-full h-[49px] relative rounded-[14px] bg-gray-50 flex items-center justify-start px-3">
                  <span className="text-md font-normal text-black">
                    {finalDate ? formatDateToMMDDYYYY(finalDate) : "--/--/----"}
                  </span>
                  <button
                    onClick={() => setOpenFilterTo(true)}
                    className="absolute cursor-pointer top-1/2 text-xl right-3 transform -translate-y-1/2 text-orange-500"
                  >
                    <IoCalendarOutline />
                  </button>
                </div>
              </div>
              <div className="w-full h-auto grid grid-cols-2 mt-2 gap-2 justify-start items-center">
                <button
                  onClick={() => {
                    setOpenCalendar(false);
                    setInitialDate(null);
                    setFinalDate(null);
                    setIsApplied(true);
                  }}
                  className="w-full h-[49px] rounded-[8px] bg-gray-50 text-[#6A6A6A] text-md font-normal flex items-center justify-center"
                >
                  Clear
                </button>
                <button
                  onClick={() => {
                    setIsApplied(true);
                    setOpenCalendar(false);
                  }}
                  className="w-full h-[49px] rounded-[8px] bg-[#F85E00] text-[#fff] text-md font-normal flex items-center justify-center"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
          <DateFilterModal
            isOpen={openFilterFrom}
            setIsOpen={setOpenFilterFrom}
            date={initialDate}
            setDate={setInitialDate}
          />

          <DateFilterModal
            isOpen={openFilterTo}
            setIsOpen={setOpenFilterTo}
            date={finalDate}
            setDate={setFinalDate}
          />
        </div>
      </div>

      <div className="w-full overflow-x-auto lg:overflow-x-hidden flex flex-col justify-start items-start">
        <div className="min-w-[1000px] w-full border-t border-x h-[49px] bg-[#FCFDFD] border-gray-300 rounded-t-[14px] grid grid-cols-12 gap-3 ">
          <span className="w-full col-span-3 px-4 flex items-center justify-start h-full ">
            <span className="text-[13px] font-medium">User Name</span>
          </span>
          <span className="w-full col-span-4 flex items-center justify-start h-full ">
            <span className="text-[13px] font-medium">Review</span>
          </span>
          <span className="w-full col-span-2 flex items-center justify-start h-full ">
            <span className="text-[13px] font-medium">Rating</span>
          </span>

          <span className="w-full col-span-1 flex items-center justify-start h-full ">
            <span className="text-[13px] font-medium">Date</span>
          </span>

          <span className="w-full col-span-1 flex items-center justify-end h-full  px-4">
            <span className="text-[13px] font-medium">Action</span>
          </span>
        </div>
        <div className="min-w-[1000px] w-full h-auto border divide-y divide-gray-300 border-gray-300 bg-white rounded-b-[14px] flex  flex-col justify-start items-start">
          {loading ? (
            [1, 2, 3, 4, 5, 6, 7, 8]?.map((item, key) => {
              return <IssueListSkeleton key={key} />;
            })
          ) : issues?.length > 0 ? (
            issues?.map((issue, key) => {
              return (
                <div
                  onClick={() => {
                    setSelectedIssue(issue);
                    setDetailOpen(true);
                  }}
                  className="w-full cursor-pointer grid grid-cols-12 gap-3 h-[77px] text-[#202224] "
                >
                  <span className="w-full px-4 col-span-3 flex items-center gap-2 justify-start h-full ">
                    <span className="w-[44px] h-[44px] border border-[#F85E00] rounded-full flex items-center justify-center ">
                      <img
                        src={
                          issue?.user?.profilePicture ||
                          "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="
                        }
                        alt="store_image"
                        className="w-[38px] h-[38px] rounded-full"
                      />
                    </span>
                    <span className="text-[13px] font-normal">
                      {issue?.user?.name || "N/A"}
                    </span>
                  </span>
                  <span className="w-full col-span-4 flex flex-col items-start justify-center h-full ">
                    <span className="text-[11px] mr-2 font-normal">
                      {issue?.description?.length > 40
                        ? issue?.description?.slice(0, 40) + "..."
                        : issue?.description}
                    </span>
                  </span>

                  <span className="w-full col-span-2 flex flex-col items-start justify-center h-full ">
                    <div className="w-auto flex  justify-start items-center gap-1">
                      <FaStar className="text-sm text-yellow-500" />
                      <span className="text-[14px] font-semibold text-black leading-[28px]">
                        {issue?.stars?.toFixed(1) || 0.0}
                      </span>
                    </div>
                  </span>

                  <span className="w-full col-span-1 flex items-center justify-start h-full ">
                    <span className="text-[13px] font-normal">
                      {formatDateToMMDDYYYY(issue?.createdAt)}
                    </span>
                  </span>

                  <span className="w-full col-span-1 flex items-center justify-end h-full  px-6">
                    <span className="text-[20px] font-normal">
                      <RxCaretRight />
                    </span>
                  </span>
                </div>
              );
            })
          ) : (
            <div className="col-span-12 w-full flex items-center justify-center h-56 text-xl font-semibold">
              No data available
            </div>
          )}
        </div>

        <ProductReviewModal
          isOpen={detailOpen}
          onRequestClose={() => setDetailOpen(false)}
          issue={selectedIssue}
        />

        {!loading && issues?.length > 0 && (
          <div className="min-w-[1000px] w-full my-6 px-2 flex justify-between items-center">
            <span className="text-[16px] font-normal text-black">
              You have {pagination?.currentPage} of {pagination?.totalPages}{" "}
              Pages
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
    </div>
  );
};

export default ProductReviews;
