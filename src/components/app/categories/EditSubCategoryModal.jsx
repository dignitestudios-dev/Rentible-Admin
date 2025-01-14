import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { IoMdClose } from "react-icons/io";
import { FaExclamation } from "react-icons/fa";
import { formatDateToMMDDYYYY } from "../../../utils/helper";
import { ErrorToast, SuccessToast } from "../../global/Toaster";
import axios from "../../../axios";
import { FiLoader } from "react-icons/fi";
const EditSubCategoryModal = ({
  isOpen,
  onRequestClose,
  setUpdate,
  categories,
  category,
}) => {
  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
      setImageFile(file);
    }
  };

  const updateCategory = async () => {
    if (name == "") {
      ErrorToast("Name cannot be left empty.");
    } else if (selectedCategory == null) {
      ErrorToast("You must select a category.");
    } else {
      try {
        setLoading(true);
        const formdata = new FormData();
        formdata.append("name", name);
        imageFile && formdata.append("cover", imageFile);
        formdata.append("parentCategory", selectedCategory);
        formdata.append("categoryId", category?._id);

        const { data } = await axios.put("/category", formdata);
        if (data?.success) {
          SuccessToast("Sub Category Created Successfully.");
          setUpdate((prev) => !prev);
          onRequestClose();
        }
      } catch (error) {
        console.log(error);
        ErrorToast(error?.response?.data?.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    setName(category?.name);
    setImageUrl(category?.cover);
    setSelectedCategory(category?.parentCategory?._id);
  }, [category]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="flex items-center justify-center outline-none z-[1000] "
      overlayClassName="fixed inset-0 bg-[#C6C6C6] outline-none bg-opacity-50 backdrop-blur-sm z-[1000]  flex justify-center items-center"
    >
      <div className="bg-white p-6 rounded-[16px] shadow-lg max-w-lg w-[360px] lg:w-[461px]  items-center flex flex-col gap-2 justify-center ">
        <h2 className=" font-semibold text-black text-center mb-1 leading-[36px] text-[24px]">
          Edit Sub Category
        </h2>
        <button
          onClick={() => document.getElementById("image").click()}
          className="w-[385px] h-[144px] rounded-[14px] border border-dashed border-gray-300 flex flex-col justify-center items-center gap-2 bg-gray-100"
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              className="w-full h-full object-contain rounded-[14px] bg-gray-200"
            />
          ) : (
            <>
              <img src="/camera-icon.png" className="w-[38px]" alt="" />
              <span className="text-[13px] font-medium leading-[19.5px]">
                Upload Category Image{" "}
              </span>
            </>
          )}
        </button>

        <input
          type="file"
          onChange={handleFileChange}
          id="image"
          className="hidden"
        />

        <input
          type="text"
          placeholder="Sub Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-[385px] h-[49px] rounded-[8px] outline-none px-3 bg-gray-100 my-2"
        />

        <select
          type="text"
          placeholder="Sub Category Name"
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-[385px] h-[49px] rounded-[8px] outline-none px-3 bg-gray-100 my-2"
        >
          <option value={""}>Select Category</option>
          {categories?.map((category) => {
            return (
              <option
                selected={selectedCategory == category?._id}
                value={category?._id}
              >
                {category?.name}
              </option>
            );
          })}
        </select>

        <button
          onClick={updateCategory}
          className="w-[385px] h-[49px] rounded-[10px] bg-[#F85E00] text-white text-sm font-normal flex items-center justify-center"
        >
          {loading ? (
            <FiLoader className="animate-spin text-lg " />
          ) : (
            "Update Sub Category"
          )}
        </button>
      </div>
    </Modal>
  );
};

export default EditSubCategoryModal;
