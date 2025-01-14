import axios from "../../../axios";
import React, { useState } from "react";
import Modal from "react-modal";
import { ErrorToast, SuccessToast } from "../../global/Toaster";
import { FiLoader } from "react-icons/fi";

const DeleteCategoryConfirm = ({
  isOpen,
  onRequestClose,
  setUpdate,
  category,
}) => {
  const [loading, setLoading] = useState(false);
  const deleteCategory = async () => {
    try {
      setLoading(true);
      const { data } = await axios.delete(`/category/${category?._id}`);
      if (data?.success) {
        SuccessToast("Category Deleted Successfully");
        setUpdate((prev) => !prev);
        onRequestClose();
      }
    } catch (error) {
      console.log(error);
      ErrorToast(error?.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="flex items-center justify-center z-[1000]"
      overlayClassName="fixed inset-0 bg-[#C6C6C6] bg-opacity-50 backdrop-blur-xs z-[1000] flex justify-center items-center"
    >
      <div className="bg-white border-2 p-6 rounded-[12px] w-[367px] items-start flex flex-col justify-center gap-3 text-center">
        <div className="w-auto flex flex-col justify-start items-start">
          <h2 className="font-semibold text-black mb-1 leading-[24.38px] text-[20px]">
            Delete Category
          </h2>

          <span className="text-[16px] font-normal text-left leading-[19.5px] text-[#272522]">
            Are you sure you want to delete this category?
          </span>
        </div>

        <div className="w-full flex items-center mt-2 justify-end gap-4">
          <button
            onClick={onRequestClose}
            className=" flex items-center justify-center  text-[#1c1c1c]  transition text-[16px] font-semibold"
          >
            <span>No</span>
          </button>
          <button
            onClick={() => deleteCategory()}
            className=" flex items-center justify-center  text-red-500  transition text-[16px] font-semibold"
          >
            {loading ? <FiLoader className="animate-spin text-sm " /> : "Yes"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteCategoryConfirm;
