import React from "react";
import Modal from "react-modal";
import { IoMdClose } from "react-icons/io";
import { FaExclamation } from "react-icons/fa";

const MarkTicketModal = ({ isOpen, onRequestClose, onConfirm, loading }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="flex items-center justify-center z-[1000] backdrop-blur-sm"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-[1000]  flex justify-center items-center"
    >
      <div className="bg-white p-8 rounded-[20px] shadow-lg max-w-lg w-[552px] min-h-[289px] text-center">
        <div className="flex justify-center mb-4">
          <img src="/info-icon.png" alt="" />
        </div>
        <h2 className=" font-bold mb-1 leading-[32px] text-[24px]">
          Mark Ticket
        </h2>
        <p className="text-[#252525] text-[16px] font-normal leading-[25.34px] mb-6">
          Are you sure you want to mark this ticket as closed.
        </p>

        <div className="flex justify-center space-x-4">
          <button
            onClick={onRequestClose}
            className="px-6 flex items-center justify-center border-2 border-red-500 text-[13px] font-bold  w-[238px] h-[48px] text-red-500  rounded-full hover:bg-red-100 transition"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="px-6 flex items-center justify-center bg-[#C00000] w-[238px] h-[48px] text-white  rounded-full hover:bg-red-600 transition text-[13px] font-bold "
          >
            {loading ? (
              <div
                class="animate-spin inline-block size-3 border-[3px] border-current border-t-transparent text-white rounded-full"
                role="status"
                aria-label="loading"
              >
                <span class="sr-only">Loading...</span>
              </div>
            ) : (
              <span>Yes</span>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default MarkTicketModal;
