import React, { useContext, useState } from "react";
import Modal from "react-modal";
import { IoMdClose } from "react-icons/io";
import { FaExclamation } from "react-icons/fa";
import { formatDateToMMDDYYYY } from "../../../utils/helper";
import { ErrorToast } from "../../global/Toaster";
import axios from "../../../axios";
import { AppContext } from "../../../context/AppContext";
import { useNavigate } from "react-router-dom";
import { FiLoader } from "react-icons/fi";

const ProductRequestModal = ({ isOpen, onRequestClose, request }) => {
  const [active, setActive] = useState(false);
  const { setUid, setSender } = useContext(AppContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const createUserChatRoom = async (userId = null, user) => {
    try {
      setLoading(true);
      const { data } = await axios.post(`/admin/createChat`, {
        userId: userId,
      });
      if (data?.success) {
        setSender(user);
        setUid(data?.data);
        localStorage.setItem("activeLink", "Messages");
        navigate("/messages");
      }
    } catch (error) {
      ErrorToast(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="flex items-center justify-center outline-none z-[1000] "
      overlayClassName="fixed inset-0 bg-[#C6C6C6] outline-none bg-opacity-50 backdrop-blur-sm z-[1000]  flex justify-center items-center"
    >
      <div className="bg-white p-6 rounded-[16px] shadow-lg max-w-lg w-[360px] lg:w-[461px]  items-start flex flex-col gap-2 justify-center ">
        <h2 className=" font-semibold text-black mb-1 leading-[36px] text-[24px]">
          User Report
        </h2>

        <div className="w-full flex  justify-between items-start">
          <div className="w-[45%] h-full flex flex-col gap-1 justify-start items-start">
            <span className="text-[16px] font-normal leading-[20px] text-[#959393]">
              Reported By
            </span>
            <div className="w-full h-full flex justify-between items-center gap-2">
              {request?.reportedByUser ? (
                <>
                  <div className="w-auto flex justify-start items-center gap-2">
                    <span className="w-[35px] h-[35px] border border-[#F85E00] rounded-full flex items-center justify-center ">
                      <img
                        src={
                          request?.reportedByUser?.profilePicture ||
                          "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="
                        }
                        alt="store_image"
                        className="w-[27px] h-[27px] rounded-full"
                      />
                    </span>
                    <div className="w-auto flex flex-col justify-start items-start">
                      <h3 className="text-[16px] font-normal text-black leading-[20.1px]">
                        {request?.reportedByUser?.name || "N/A"}
                      </h3>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      createUserChatRoom(
                        request?.reportedByUser?._id,
                        request?.reportedByUser
                      );
                    }}
                    className="w-[31px] h-[31px] rounded-md  bg-orange-500 flex items-center justify-center"
                  >
                    {loading ? (
                      <FiLoader className="text-lg text-white animate-spin" />
                    ) : (
                      <img
                        src="/chat-icon.png"
                        alt="Chat Icon"
                        className="w-full h-full"
                      />
                    )}
                  </button>
                </>
              ) : (
                <>
                  <div className="w-auto flex justify-start items-center gap-2">
                    <span className="w-[35px] h-[35px] border border-[#F85E00] rounded-full flex items-center justify-center ">
                      <img
                        src={
                          request?.reportedByStore?.profilePicture ||
                          "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="
                        }
                        alt="store_image"
                        className="w-[27px] h-[27px] rounded-full"
                      />
                    </span>
                    <div className="w-auto flex flex-col justify-start items-start">
                      <h3 className="text-[16px] font-normal text-black leading-[20.1px]">
                        {request?.reportedByStore?.name || "N/A"}
                      </h3>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="w-[3%] h-14 flex items-center justify-start">
            <span className="w-[1px] h-10 rounded-full bg-[#d4d4d4]"></span>
          </div>
          <div className="w-[45%] h-full flex flex-col gap-1 justify-start items-start">
            <span className="text-[16px] font-normal leading-[20px] text-[#959393]">
              Reported Date
            </span>
            <span className="text-[16px] font-normal text-[#000] leading-[23px]">
              {formatDateToMMDDYYYY(request?.createdAt)}
            </span>
          </div>
        </div>
        <span className="w-full my-2 h-[0.5px] bg-[#d4d4d4] rounded-full"></span>

        <div className="w-full h-full flex flex-col gap-1 justify-start items-start">
          <span className="text-[16px] font-normal leading-[20px] text-[#959393]">
            Title
          </span>
          <span className="text-[16px] font-normal text-[#000] leading-[23px]">
            {request?.title || "N/A"}
          </span>
        </div>

        <span className="w-full my-2 h-[1px] bg-[#d4d4d4] rounded-full"></span>

        <div className="w-full h-full flex flex-col gap-1 justify-start items-start">
          <span className="text-[16px] font-normal leading-[20px] text-[#959393]">
            Description
          </span>
          <span className="text-[16px] font-normal text-[#000] leading-[23px]">
            {request?.description || "N/A"}
          </span>
        </div>
        <span className="w-full my-2 h-[1px] bg-[#d4d4d4] rounded-full"></span>

        <div className="w-full h-auto flex justify-between items-center">
          <div className="w-[45%] h-full flex flex-col gap-1 justify-start items-start">
            <span className="text-[16px] font-normal leading-[20px] text-[#959393]">
              Reported{" "}
              {request?.user
                ? "User"
                : request?.store
                ? "Store"
                : request?.product
                ? "Product"
                : request?.booking
                ? "Booking"
                : "Review"}
            </span>

            {request?.user ? (
              <div className="w-auto flex justify-start items-center gap-2">
                <span className="w-[35px] h-[35px] border border-[#F85E00] rounded-full flex items-center justify-center ">
                  <img
                    src={
                      request?.user?.profilePicture ||
                      "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="
                    }
                    alt="store_image"
                    className="w-[27px] h-[27px] rounded-full"
                  />
                </span>
                <div className="w-auto flex flex-col justify-start items-start">
                  <h3 className="text-[16px] font-normal text-black leading-[20.1px]">
                    {request?.user?.name || "N/A"}
                  </h3>
                </div>
                <button
                  onClick={() => {
                    createUserChatRoom(request?.user?._id, request?.user);
                  }}
                  className="w-[31px] h-[31px] flex items-center justify-center"
                >
                  {loading ? (
                    <FiLoader className="text-lg text-white animate-spin" />
                  ) : (
                    <img
                      src="/chat-icon.png"
                      alt="Chat Icon"
                      className="w-full h-full"
                    />
                  )}
                </button>
              </div>
            ) : request?.store ? (
              <div className="w-auto flex justify-start items-center gap-2">
                <span className="w-[35px] h-[35px] border border-[#F85E00] rounded-full flex items-center justify-center ">
                  <img
                    src={
                      request?.store?.profilePicture ||
                      "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="
                    }
                    alt="store_image"
                    className="w-[27px] h-[27px] rounded-full"
                  />
                </span>
                <div className="w-auto flex flex-col justify-start items-start">
                  <h3 className="text-[16px] font-normal text-black leading-[20.1px]">
                    {request?.store?.name || "N/A"}
                  </h3>
                </div>
              </div>
            ) : request?.product ? (
              <div className="w-auto flex justify-start items-center gap-2">
                <span className="w-[35px] h-[35px] border border-[#F85E00] rounded-full flex items-center justify-center ">
                  <img
                    src={
                      request?.product?.cover ||
                      "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="
                    }
                    alt="store_image"
                    className="w-[27px] h-[27px] rounded-full"
                  />
                </span>
                <div className="w-auto flex flex-col justify-start items-start">
                  <h3 className="text-[16px] font-normal text-black leading-[20.1px]">
                    {request?.product?.name || "N/A"}
                  </h3>
                </div>
              </div>
            ) : request?.booking ? (
              <div className="w-auto flex justify-start items-center gap-2">
                <span className="w-[35px] h-[35px] border border-[#F85E00] rounded-full flex items-center justify-center ">
                  <img
                    src={
                      request?.booking?.product?.cover ||
                      "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="
                    }
                    alt="store_image"
                    className="w-[27px] h-[27px] rounded-full"
                  />
                </span>
                <div className="w-auto flex flex-col justify-start items-start">
                  <h3 className="text-[16px] font-normal text-black leading-[20.1px]">
                    {request?.booking?.product?.name || "N/A"}
                  </h3>
                </div>
              </div>
            ) : (
              <div className="w-auto flex justify-start items-center gap-2">
                <span className="w-[35px] h-[35px] border border-[#F85E00] rounded-full flex items-center justify-center ">
                  <img
                    src={
                      request?.review?.user?.profilePicture ||
                      "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="
                    }
                    alt="store_image"
                    className="w-[27px] h-[27px] rounded-full"
                  />
                </span>
                <div className="w-auto flex flex-col justify-start items-start">
                  <h3 className="text-[16px] font-normal text-black leading-[20.1px]">
                    {request?.review?.user?.name || "N/A"}
                  </h3>
                </div>
              </div>
            )}
          </div>
          {/* <div className="w-[45%] h-full flex flex-col gap-1 justify-start items-end">
            <span className="text-[12px] font-normal leading-[20px] text-[#000]">
              Disable
            </span>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                setActive((prev) => !prev);
              }}
              className={`w-[34.26px] h-[18px] rounded-full   flex ${
                active
                  ? "bg-[#F85E00] justify-end"
                  : "justify-start bg-[#d9d9d9]"
              }  p-[1.5px]  `}
            >
              <span className="w-[15.7px] h-[15.7px] rounded-full bg-white shadow "></span>
            </button>
          </div> */}
        </div>
      </div>
    </Modal>
  );
};

export default ProductRequestModal;
