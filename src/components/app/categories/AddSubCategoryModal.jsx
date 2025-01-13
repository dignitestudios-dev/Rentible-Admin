import React, { useState } from "react";
import Modal from "react-modal";
import { IoMdClose } from "react-icons/io";
import { FaExclamation } from "react-icons/fa";
import { formatDateToMMDDYYYY } from "../../../utils/helper";

const AddSubCategoryModal = ({
  isOpen,
  onRequestClose,
  setUpdate,
  categories,
}) => {
  const [active, setActive] = useState(false);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="flex items-center justify-center outline-none z-[1000] "
      overlayClassName="fixed inset-0 bg-[#C6C6C6] outline-none bg-opacity-50 backdrop-blur-sm z-[1000]  flex justify-center items-center"
    >
      <div className="bg-white p-6 rounded-[16px] shadow-lg max-w-lg w-[360px] lg:w-[461px]  items-center flex flex-col gap-2 justify-center ">
        <h2 className=" font-semibold text-black text-center mb-1 leading-[36px] text-[24px]">
          Add Sub Category
        </h2>
        <div className="w-[385px] h-[144px] rounded-[14px] border border-dashed border-gray-300 flex flex-col justify-center items-center gap-2 bg-gray-100">
          <img src="/camera-icon.png" className="w-[38px]" alt="" />
          <span className="text-[13px] font-medium leading-[19.5px]">
            Upload Category Image{" "}
          </span>
        </div>

        <input
          type="text"
          placeholder="Sub Category Name"
          className="w-[385px] h-[49px] rounded-[8px] outline-none px-3 bg-gray-100 my-2"
        />

        <select
          type="text"
          placeholder="Sub Category Name"
          className="w-[385px] h-[49px] rounded-[8px] outline-none px-3 bg-gray-100 my-2"
        >
          <option value={""}>Select Category</option>
          {categories?.map((category) => {
            return <option value={category?._id}>{category?.name}</option>;
          })}
        </select>

        <button
          onClick={() => console.log("hit submit")}
          className="w-[385px] h-[49px] rounded-[10px] bg-[#F85E00] text-white text-sm font-normal flex items-center justify-center"
        >
          Add Sub Category
        </button>
      </div>
    </Modal>
  );
};

export default AddSubCategoryModal;
