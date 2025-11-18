import React, { useState } from "react";
import Modal from "react-modal";
import { IoMdClose } from "react-icons/io";
import { FaExclamation } from "react-icons/fa";
import { ErrorToast } from "../../global/Toaster";

const CustomerApproveModal = ({
  isOpen,
  onRequestClose,
  onConfirm,
  loading,
  isApproved,
}) => {
  const [reason, setReason] = useState("");
  const handleConfirm = () => {
    if (!isApproved && !reason.trim()) {
      ErrorToast("Please provide a reason for rejection."); // simple validation
      return;
    }
    onConfirm(reason);
    setReason("");
  };
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="flex items-center justify-center z-[1000] "
      overlayClassName="fixed inset-0 bg-[#C6C6C6] bg-opacity-50 backdrop-blur-sm z-[1000]  flex justify-center items-center"
    >
      <div
        className={`bg-white p-6 rounded-[16px] shadow-lg max-w-lg w-[417px]  ${
          !isApproved ? "" : "text-center"
        }`}
      >
        <div className="flex justify-center mb-4">
          <img src="/info-icon.png" alt="" />
        </div>
        <h2 className=" font-semibold text-black mb-1 leading-[36px] text-[24px]">
          {isApproved ? "Approve" : "Reject"} Store
        </h2>
        {!isApproved ? (
          ""
        ) : (
          <p className="text-[#3C3C43D9] text-[18px] font-normal leading-[27px] mb-6">
            Are you sure you want to <br /> {isApproved ? "approve" : "reject"}{" "}
            this store?
          </p>
        )}
        {!isApproved && (
          <div className="mb-4 mt-3 flex flex-col items-start">
            <label
              htmlFor="reason"
              className="text-left text-black mb-1 font-medium"
            >
              Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for rejection"
              className="w-full h-[100px] p-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:border-orange-500"
              required
            />
          </div>
        )}
        <div className="flex justify-center space-x-10">
          <button
            onClick={() => {
              setReason(""); // reset reason if modal closes
              onRequestClose();
            }}
            className="w-[165px] h-[49px] flex items-center justify-center text-[13px] font-medium text-[#59595F] rounded-[8px] bg-[#d9d9d9] transition"
          >
            No
          </button>
          <button
            onClick={handleConfirm}
            className="px-6 flex items-center justify-center bg-[#F85E00] w-[165px] h-[49px] text-white rounded-[8px] hover:bg-orange-600 transition text-[13px] font-medium"
          >
            {loading ? (
              <div
                className="animate-spin inline-block w-5 h-5 border-[3px] border-current border-t-transparent text-white rounded-full"
                role="status"
                aria-label="loading"
              ></div>
            ) : (
              <span>Yes</span>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CustomerApproveModal;
