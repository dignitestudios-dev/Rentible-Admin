import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { IoMdClose } from "react-icons/io";
import { FaExclamation } from "react-icons/fa";
import { formatDateToMMDDYYYY } from "../../../utils/helper";
import axios from "../../../axios";
import { ErrorToast, SuccessToast } from "../../global/Toaster";
import { FiLoader } from "react-icons/fi";

const AddNotificationModal = ({ isOpen, onRequestClose, setUpdate }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const addNotification = async () => {
    if (title == "") {
      ErrorToast("Title cannot be left empty.");
    } else if (description == "") {
      ErrorToast("Description cannot be left empty.");
    } else {
      try {
        setLoading(true);
        const { data } = await axios.post("/notification", {
          title: title,
          description: description,
        });
        if (data?.success) {
          SuccessToast("Notification Created Successfully.");
          setTitle("");
          setDescription("");
          setUpdate((prev) => !prev);
          onRequestClose();
        }
      } catch (error) {
        ErrorToast(error?.response?.data?.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="flex items-center justify-center outline-none z-[1000] "
      overlayClassName="fixed inset-0 bg-[#C6C6C6] outline-none bg-opacity-50 backdrop-blur-sm z-[1000]  flex justify-center items-center"
    >
      <div className="bg-white p-6 rounded-[16px] shadow-lg max-w-lg w-[360px] lg:w-[461px]  items-center flex flex-col gap-2 justify-center ">
        <h2 className=" font-semibold text-black text-center mb-1 leading-[36px] text-[24px]">
          Send Notification
        </h2>

        <input
          type="text"
          placeholder="Notification Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-[385px] h-[49px] rounded-[8px] outline-none px-3 bg-gray-100 my-2"
        />

        <textarea
          type="text"
          placeholder="Notification Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-[385px] h-[109px] rounded-[8px] outline-none resize-none p-3 bg-gray-100 my-2"
        ></textarea>

        <button
          onClick={addNotification}
          className="w-[385px] h-[49px] rounded-[10px] bg-[#F85E00] text-white text-sm font-normal flex items-center justify-center"
        >
          {loading ? <FiLoader className="animate-spin text-lg " /> : "Send"}
        </button>
      </div>
    </Modal>
  );
};

export default AddNotificationModal;
