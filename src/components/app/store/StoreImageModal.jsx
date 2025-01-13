import React, { useState } from "react";
import Modal from "react-modal";

const StoreImageModal = ({ isOpen, onRequestClose, url, type }) => {
  const [active, setActive] = useState(false);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="flex items-center justify-center z-[1000]"
      overlayClassName="fixed inset-0 bg-[#C6C6C6] bg-opacity-50 backdrop-blur-xs z-[1000] flex justify-center items-center"
    >
      <div className="bg-white border-2 p-6 rounded-[16px] w-[864px] h-[628px] items-start flex flex-col justify-center gap-3 text-center">
        <div className="w-full flex flex-col gap-3 justify-start items-start">
          <h2 className="font-bold text-black mb-1 leading-[48.38px] text-[32px]">
            {type == "front"
              ? "Front ID Card"
              : type == "back"
              ? "Back ID Card"
              : type == "proof"
              ? "Proof of Address"
              : "Ownership Certificate"}
          </h2>

          <img
            src={url}
            alt=""
            className="h-[491px] bg-gray-200 object-contain rounded-xl w-full"
          />
        </div>
      </div>
    </Modal>
  );
};

export default StoreImageModal;
