import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ErrorToast, SuccessToast } from "../../components/global/Toaster";
import { MdKeyboardBackspace } from "react-icons/md";

import React, { useCallback, useEffect, useState } from "react";
import DateFilterModal from "../../components/app/products/DateFilterModal";
import { FiSearch } from "react-icons/fi";
import {
  convertToUTCTimestamp,
  formatDateToMMDDYYYY,
  formatPhoneNumberInput,
  getStatusClasses,
} from "../../utils/helper";
import { IoCalendarOutline } from "react-icons/io5";
import Cookies from "js-cookie";
import axios from "../../axios";
import _ from "lodash";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";
import RentalListSkeleton from "../../skeletons/app/rental_tracking/RentalListSkeleton";
import CustomerReportConfirm from "../../components/app/customers/CustomerReportConfirm";
import CustomerReportReasons from "../../components/app/customers/CustomerReportReasons";
import CustomerReported from "../../components/app/customers/CustomerReported";
import CustomerApproveModal from "../../components/app/customers/CustomerApproveModal";
import CustomerApproved from "../../components/app/customers/CustomerApproved";
import StoreProducts from "../../components/app/store/StoreProducts";
import StoreImageModal from "../../components/app/store/StoreImageModal";

const StoreDetails = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const user = location?.state;

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
      getRentals(query);
    }, 1000),
    []
  );

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    throttledSearch(value); // Call the throttled function
  };

  const [rentals, setRentals] = useState([]); // Updated variable name to camelCase
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
  const [activeTab, setActiveTab] = useState("all");

  const [status, setStatus] = useState([]);
  const [statusLoading, setStatusLoading] = useState(false);

  const getStatus = async () => {
    try {
      setStatusLoading(true);
      const { data } = await axios.get(`/booking/status?type=rental`);
      setStatus(data?.data); // Store the actual data from the response
    } catch (error) {
      ErrorToast(error?.response?.data?.message || "Something went wrong.");
      console.log("Error:", error);
    } finally {
      setStatusLoading(false);
    }
  };

  const getRentals = async (query = "") => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `/booking/rentalHistory?id=${id}&type=rental&role=store&search=${query}${
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
        }&page=${currentPage}&limit=9&status=${activeTab}`
      );
      setRentals(data?.data); // Store the actual data from the response
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
    getRentals();
  }, [update, isApplied, currentPage, activeTab]);
  useEffect(() => {
    getStatus();
  }, []);

  const [reporting, setReporting] = useState(false);

  const [openReportConfirm, setOpenReportConfirm] = useState(false);
  const [openReportReason, setOpenReportReason] = useState(false);
  const [openReported, setOpenReported] = useState(false);
  const [selectedReportReason, setSelectedReportReason] = useState({
    title: "",
    description: "",
  });

  const reportUser = async (id) => {
    try {
      setReporting(true);
      const response = await axios.post("/report/", {
        title: selectedReportReason?.title,
        description: selectedReportReason?.description,
        userId: id,
      });
      if (response?.data?.success) {
        setOpenReportReason(false);
        setOpenReported(true);
      }
    } catch (error) {
      ErrorToast(error?.response?.data?.message || "Something went wrong.");
    } finally {
      // test
      setReporting(false);
    }
  };

  const [profile, setProfile] = useState({});
  const [profileLoading, setProfileLoading] = useState(false);

  const getStoreDetail = async () => {
    try {
      setProfileLoading(true);
      const { data } = await axios.get(`/admin/stores/${id}`);
      setProfile(data?.data); // Store the actual data from the response
    } catch (error) {
      ErrorToast(error?.response?.data?.message || "Something went wrong.");
      console.log("Error:", error);
    } finally {
      setProfileLoading(false);
    }
  };
  //

  const [openConfirm, setOpenConfirm] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [openApproved, setOpenApproved] = useState(false);

  const approveUser = async (id, isApproved) => {
    try {
      setReporting(true);
      const response = await axios.post("/admin/verifyStore", {
        storeId: id,
        status: isApproved ? "approved" : "rejected",
      });
      if (response?.data?.success) {
        setOpenApproved(true);
      }
    } catch (error) {
      ErrorToast(error?.response?.data?.message || "Something went wrong.");
    } finally {
      // test
      setReporting(false);
    }
  };

  useEffect(() => {
    getStoreDetail();
  }, []);

  const [imageOpen, setImageOpen] = useState({
    open: false,
    url: null,
    type: "front",
  });

  return profile !== null ? (
    <div className="w-full h-full  flex flex-col gap-6  py-4 px-2 lg:px-6 justify-start items-start ">
      <div className="w-full h-auto flex flex-col gap-3 justify-start items-start">
        <div className="w-full relative flex flex-col lg:flex-row justify-between lg:items-center">
          <div className="w-full h-auto flex flex-col justify-start items-start ">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="text-[14px] flex gap-[0.5px] items-center font-normal leading-[21px] text-[#202224] "
            >
              <MdKeyboardBackspace className="text-lg" />
              <span>Back</span>
            </button>
            <span className="text-[26px] md:text-[28px] lg:text-[32px] font-bold leading-[48px] text-[#202224]">
              Store Details
            </span>
          </div>
          {!(
            profile?.identityStatus == "approved" ||
            profile?.identityStatus == "rejected"
          ) && (
            <div className="w-auto flex justify-start items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setOpenConfirm(true);
                  setIsApproved(false);
                }}
                className="w-[130px] h-[49px] rounded-[8px] bg-[#FF3E46] text-white flex gap-2 items-center justify-center"
              >
                <span className="text-[14px] font-normal leading-[21px] ">
                  Reject
                </span>
                {/* {loading && <FiLoader className="animate-spin text-lg " />} */}
              </button>
              <button
                type="button"
                onClick={() => {
                  setOpenConfirm(true);
                  setIsApproved(true);
                }}
                className="w-[130px] h-[49px] rounded-[8px] bg-[#00DC67] text-white flex gap-2 items-center justify-center"
              >
                <span className="text-[14px] font-normal leading-[21px] ">
                  Approve
                </span>
                {/* {loading && <FiLoader className="animate-spin text-lg " />} */}
              </button>
            </div>
          )}
        </div>
      </div>

      <CustomerApproveModal
        isOpen={openConfirm}
        onRequestClose={() => setOpenConfirm(false)}
        onConfirm={() => {
          approveUser(id, isApproved);
        }}
        isApproved={isApproved}
      />

      <CustomerApproved
        isOpen={openApproved}
        onRequestClose={() => setOpenApproved(false)}
        onConfirm={() => {
          setOpenApproved(false);
        }}
        isApproved={isApproved}
      />

      <div className="w-full h-auto rounded-[18px] border border-gray-300 bg-white flex flex-col justify-start items-start">
        <div className="w-full h-[204px] rounded-t-[18px] relative">
          <img
            src={
              profile?.coverPicture ||
              "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="
            }
            alt=""
            className="w-full h-full rounded-t-[18px] bg-gray-200 object-scale-down"
          />
          <span className="w-[90px] lg:w-[144px] h-[90px] lg:h-[144px] absolute -bottom-11 left-2 lg:left-8 bg-white rounded-full border border-[#F85E00] flex items-center justify-center">
            <img
              src={
                profile?.profilePicture ||
                "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="
              }
              alt=""
              className="w-[80px] lg:w-[132px] h-[80px] lg:h-[132px] rounded-full bg-gray-200 object-contain"
            />
          </span>

          <span className="text-[18px] lg:text-[24px] font-semibold absolute bottom-2 backdrop-blur-md left-28 lg:left-48 lg:leading-[36px] text-white">
            {profile?.name || "N/A"}
          </span>
        </div>

        <div className="w-full h-auto p-6 mt-10 flex flex-col justify-start items-start">
          <div className="w-full flex flex-col items-start justify-start gap-1">
            <h2 className="text-[16px] font-normal leading-[24px]">
              Store Description
            </h2>
            <p className="text-[16px] font-normal leading-[23px] text-[#939393]">
              {profile?.description || "N/A"}
            </p>
          </div>

          <span className="w-full my-4 h-[0.5px] max-h-[1.5px] bg-[#d4d4d4] rounded-full"></span>

          <div className="w-full grid grid-cols-1 lg:grid-cols-6 divide-y-2 lg:divide-y-0 lg:divide-x-2 divide-[#d4d4d4] items-start">
            <div className="w-full h-full flex flex-col gap-1 justify-start items-start">
              <span className="text-[14px] font-normal leading-[24px]">
                Full Name
              </span>
              <span className="text-[14px] font-normal text-[#818181] leading-[23px]">
                {profile?.name || "N/A"}
              </span>
            </div>

            <div className="w-full h-full flex flex-col lg:pl-6 gap-1 justify-start items-start">
              <span className="text-[14px] font-normal leading-[24px]">
                Email Address
              </span>
              <span className="text-[14px] w-40 break-words font-normal text-[#818181] leading-[23px]">
                {profile?.email || "N/A"}
              </span>
            </div>

            <div className="w-full h-full flex flex-col lg:pl-6 gap-1 justify-start items-start">
              <span className="text-[14px] font-normal leading-[24px]">
                Phone Number
              </span>
              <span className="text-[14px] font-normal text-[#818181] leading-[23px]">
                {formatPhoneNumberInput(profile?.phone || "") || "N/A"}
              </span>
            </div>

            <div className="w-full h-full flex flex-col lg:pl-6 gap-1 justify-start items-start">
              <span className="text-[14px] font-normal leading-[24px]">
                State
              </span>
              <span className="text-[14px] font-normal text-[#818181] leading-[23px]">
                {profile?.state || "N/A"}
              </span>
            </div>
            <div className="w-full h-full flex flex-col lg:pl-6 gap-1 justify-start items-start">
              <span className="text-[14px] font-normal leading-[24px]">
                City
              </span>
              <span className="text-[14px] font-normal text-[#818181] leading-[23px]">
                {profile?.city || "N/A"}
              </span>
            </div>

            <div className="w-full h-full flex flex-col lg:pl-6 gap-1 justify-start items-start">
              <span className="text-[14px] font-normal leading-[24px]">
                Address
              </span>
              <span className="text-[14px] font-normal text-[#818181] leading-[23px]">
                {profile?.address || "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full   flex flex-col  py-4  justify-start items-start gap-6">
        <div className="w-full h-auto flex flex-col gap-3 justify-start items-start">
          <div className="w-full relative flex flex-col lg:flex-row justify-between lg:items-center">
            <span className="text-[26px] md:text-[28px] lg:text-[32px] font-bold leading-[48px] text-[#202224]">
              Identity Details
            </span>
          </div>
          <div className="w-full h-[426px] rounded-[14px] bg-white grid grid-cols-2 grid-rows-2  ">
            <div className="w-full flex flex-col  border-r border-gray-300 items-start justify-center gap-2 p-6">
              <span className="text-[20px] font-medium leading-[30px] text-black">
                Front ID Card
              </span>
              <div className="w-full h-[108px] rounded-[12px] border border-dashed border-gray-300 bg-gray-100 flex items-center justify-between px-4">
                <img
                  src={profile?.idFrontImage}
                  alt=""
                  className="w-[80px] h-[80px] rounded-md"
                />

                <div className="w-auto flex items-center justify-start gap-2">
                  <button
                    onClick={() =>
                      setImageOpen({
                        open: true,
                        type: "front",
                        url: profile?.idFrontImage,
                      })
                    }
                    className="h-[47.59px] rounded-lg bg-orange-500 text-white text-md px-3"
                  >
                    View Full Image
                  </button>
                </div>
              </div>
            </div>
            <div className="w-full flex flex-col  border-gray-300 items-start justify-center gap-2 p-6">
              <span className="text-[20px] font-medium leading-[30px] text-black">
                Back ID Card
              </span>
              <div className="w-full h-[108px] rounded-[12px] border border-dashed border-gray-300 bg-gray-100 flex items-center justify-between px-4">
                <img
                  src={profile?.idBackImage}
                  alt=""
                  className="w-[80px] h-[80px] rounded-md"
                />

                <div className="w-auto flex items-center justify-start gap-2">
                  <button
                    onClick={() =>
                      setImageOpen({
                        open: true,
                        type: "back",
                        url: profile?.idBackImage,
                      })
                    }
                    className="h-[47.59px] rounded-lg bg-orange-500 text-white text-md px-3"
                  >
                    View Full Image
                  </button>
                </div>
              </div>
            </div>

            <StoreImageModal
              isOpen={imageOpen?.open}
              onRequestClose={() =>
                setImageOpen({
                  open: false,
                  type: "front",
                  url: null,
                })
              }
              url={imageOpen?.url}
              type={imageOpen?.type}
            />
            <div className="w-full flex flex-col items-start border-t border-r border-gray-300 justify-center gap-2 p-6">
              <span className="text-[20px] font-medium leading-[30px] text-black">
                Front ID Card
              </span>
              <div className="w-full h-[108px] rounded-[12px] border border-dashed border-gray-300 bg-gray-100 flex items-center justify-between px-4">
                <img
                  src={profile?.proofOfAddress}
                  alt=""
                  className="w-[80px] h-[80px] rounded-md"
                />

                <div className="w-auto flex items-center justify-start gap-2">
                  <button
                    onClick={() =>
                      setImageOpen({
                        open: true,
                        type: "proof",
                        url: profile?.proofOfAddress,
                      })
                    }
                    className="h-[47.59px] rounded-lg bg-orange-500 text-white text-md px-3"
                  >
                    View Full Image
                  </button>
                </div>
              </div>
            </div>
            <div className="w-full flex flex-col items-start border-t border-gray-300 justify-center gap-2 p-6">
              <span className="text-[20px] font-medium leading-[30px] text-black">
                Ownership Certificate
              </span>
              <div className="w-full h-[108px] rounded-[12px] border border-dashed border-gray-300 bg-gray-100 flex items-center justify-between px-4">
                <img
                  src={profile?.ownershipCertificate}
                  alt=""
                  className="w-[80px] h-[80px] rounded-md"
                />

                <div className="w-auto flex items-center justify-start gap-2">
                  <button
                    onClick={() =>
                      setImageOpen({
                        open: true,
                        type: "ownership",
                        url: profile?.ownershipCertificate,
                      })
                    }
                    className="h-[47.59px] rounded-lg bg-orange-500 text-white text-md px-3"
                  >
                    View Full Image
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full   flex flex-col  py-4  justify-start items-start gap-6">
        <div className="w-full h-auto flex flex-col gap-3 justify-start items-start">
          <div className="w-full relative flex flex-col lg:flex-row justify-between lg:items-center">
            <span className="text-[26px] md:text-[28px] lg:text-[32px] font-bold leading-[48px] text-[#202224]">
              Rental Order History
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

              {/* {location?.pathname !== "/dashboard" && ( */}
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
              {/* )} */}
            </div>

            <div
              className={`w-[330px] h-[316px] absolute top-14 right-0 transition-all duration-300 bg-white rounded-[14px] shadow-md py-3 px-6 ${
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
                      {finalDate
                        ? formatDateToMMDDYYYY(finalDate)
                        : "--/--/----"}
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
                      setInitialDate(new Date());
                      setFinalDate(new Date());
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
        <div className="w-full overflow-x-auto lg:overflow-x-hidden flex flex-col justify-start items-start gap-6">
          <div className="lg:min-w-[805px] min-w-[875px] flex  px-[2px] py-[2px] border border-gray-300 bg-white h-[49px] rounded-[8px]">
            {statusLoading
              ? [...Array(8)].map((_, index) => (
                  <div
                    key={index}
                    className={`min-w-[90px] h-[45px]  bg-gray-50 rounded-md animate-pulse ${
                      index === 0 ? "rounded-l-[7px]" : ""
                    } ${index === 2 ? "rounded-r-[7px]" : ""}`}
                  ></div>
                ))
              : status?.map((tab, index, array) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`min-w-[90px] px-4 py-2 capitalize text-sm font-normal leading-[17.58px] ${
                      activeTab === tab
                        ? "bg-[#F85E00] text-white"
                        : "bg-white text-black"
                    } ${index === 0 ? "rounded-l-[7px]" : ""} ${
                      index === array.length - 1 ? "rounded-r-[7px]" : ""
                    }`}
                  >
                    {tab}
                  </button>
                ))}
          </div>

          {loading ? (
            [1, 2, 3, 5, 6, 7, 8]?.map((item) => (
              <RentalListSkeleton key={item} />
            ))
          ) : (
            <div className="min-w-[960px] w-full flex flex-col justify-start pb-4 items-start">
              <div className="w-full border-t border-x h-[49px] bg-[#FCFDFD] border-gray-300 rounded-t-[14px] grid grid-cols-12 ">
                <span className="w-full col-span-1 px-4 flex items-center justify-start h-full ">
                  <span className="text-[13px] font-medium">Order ID</span>
                </span>
                <span className="w-full col-span-2 flex items-center justify-start h-full ">
                  <span className="text-[13px] font-medium">Product Name</span>
                </span>
                <span className="w-full col-span-2 flex items-center justify-start h-full ">
                  <span className="text-[13px] font-medium">Description</span>
                </span>
                <span className="w-full col-span-1 flex items-center justify-start h-full ">
                  <span className="text-[13px] font-medium">Qty</span>
                </span>
                <span className="w-full col-span-2 flex items-center justify-start h-full ">
                  <span className="text-[13px] font-medium">Booking Type</span>
                </span>
                <span className="w-full col-span-2 flex items-center justify-start h-full ">
                  <span className="text-[13px] font-medium">Booking Date</span>
                </span>
                <span className="w-full col-span-1 flex items-center justify-start h-full ">
                  <span className="text-[13px] font-medium">Status</span>
                </span>
                <span className="w-full col-span-1 flex items-center justify-end h-full  px-4">
                  <span className="text-[13px] font-medium">Action</span>
                </span>
              </div>
              <div className="w-full h-auto border divide-y divide-gray-300 border-gray-300 bg-white rounded-b-[14px] flex  flex-col justify-start items-start">
                {loading ? (
                  [1, 2, 3, 4]?.map((item, key) => {
                    return <RentalListSkeleton key={key} />;
                  })
                ) : rentals?.length > 0 ? (
                  rentals?.map((rental, key) => {
                    return (
                      <div
                        key={key}
                        onClick={() => {
                          navigate(`/rental-tracking/${rental?._id}`, {
                            state: rental,
                          });
                        }}
                        className="w-full cursor-pointer grid grid-cols-12 h-[77px] text-[#202224] "
                      >
                        <span className="w-full col-span-1 px-4 flex items-center justify-start h-full ">
                          <span className="text-[13px] font-normal">
                            {rental?.shortCode}
                          </span>
                        </span>
                        <span className="w-full col-span-2  flex items-center gap-2 justify-start h-full ">
                          <span className="w-[44px] h-[44px] border border-[#F85E00] rounded-full flex items-center justify-center ">
                            <img
                              src={
                                rental?.product?.cover ||
                                "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="
                              }
                              alt="store_image"
                              className="w-[38px] h-[38px] rounded-full"
                            />
                          </span>
                          <span className="text-[13px] font-normal">
                            {rental?.product?.name?.length > 15
                              ? rental?.product?.name?.slice(0, 15) + "..."
                              : rental?.product?.name}
                          </span>
                        </span>
                        <span className="w-full col-span-2 flex items-center justify-start h-full ">
                          <span className="text-[13px] font-normal">
                            {rental?.product?.description?.length > 20
                              ? rental?.product?.description?.slice(0, 20) +
                                "..."
                              : rental?.product?.description}
                          </span>
                        </span>
                        <span className="w-full col-span-1 flex items-center justify-start h-full ">
                          <span className="text-[13px] font-normal">
                            {rental?.quantity}
                          </span>
                        </span>
                        <span className="w-full col-span-2 flex items-center justify-start h-full ">
                          <span className="text-[13px] font-normal">
                            {rental?.duration}
                          </span>
                        </span>
                        <span className="w-full col-span-2 flex items-center justify-start h-full ">
                          <span className="text-[13px] font-normal">
                            {formatDateToMMDDYYYY(rental?.createdAt)}
                          </span>
                        </span>
                        <span className="w-full col-span-1 flex items-center justify-start h-full ">
                          <span
                            className={`text-[13px] capitalize ${getStatusClasses(
                              rental?.status
                            )} font-normal`}
                          >
                            {rental?.status}
                          </span>
                        </span>
                        <button
                          onClick={() => {
                            navigate(`/rental-tracking/${rental?._id}`, {
                              state: rental,
                            });
                          }}
                          className="w-full col-span-1 flex items-center justify-end h-full  px-6"
                        >
                          <span className="text-[20px] font-normal">
                            <RxCaretRight />
                          </span>
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-12 w-full flex items-center justify-center h-56 text-xl font-semibold">
                    No data available
                  </div>
                )}
              </div>

              {!loading && rentals?.length > 0 && (
                <div className="w-full my-6 px-2 flex justify-between items-center">
                  <span className="text-[16px] font-normal text-black">
                    You have {pagination?.currentPage} of{" "}
                    {pagination?.totalPages} Pages
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
                      {Array.from(
                        { length: pagination?.totalPages },
                        (_, index) => (
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
                        )
                      )}
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
          )}
        </div>
      </div>

      <StoreProducts id={id} />
    </div>
  ) : (
    "Store Not Found"
  );
};

export default StoreDetails;
