import React from "react";
import Modal from "react-modal";
import { IoMdClose } from "react-icons/io";
import { FaExclamation } from "react-icons/fa";

const ProductDeliveredModal = ({ isOpen, onRequestClose, onConfirm }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="flex items-center justify-center z-[1000] "
      overlayClassName="fixed inset-0 bg-[#C6C6C6] bg-opacity-50 backdrop-blur-sm z-[1000]  flex justify-center items-center"
    >
      <div className="bg-white p-6 rounded-[16px] shadow-lg max-w-lg w-[461px]  items-center flex flex-col justify-center text-center">
        <div className="flex justify-center mb-4">
          <img src="/cancel-modal-icon.png" alt="" className="h-[129px]" />
        </div>
        <h2 className=" font-semibold text-black mb-1 leading-[36px] text-[24px]">
          Product Delivered Successfully
        </h2>
        <p className="text-[#3C3C43D9] text-[18px] font-normal leading-[27px] mb-6">
          Your product has been successfully delivered, and the rental booking
          time has started. Please track the booking from your dashboard. If you
          need any assistance, feel free to reach out to our support team.
        </p>

        <div className="flex justify-center space-x-2">
          <button
            onClick={onConfirm}
            className="px-6 flex items-center justify-center bg-[#F85E00] w-[385px] h-[49px] text-white  rounded-[8px] hover:bg-orange-600 transition text-[13px] font-medium "
          >
            <span>Yes</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ProductDeliveredModal;
