import React, { useCallback, useEffect, useState } from "react";

import Cookies from "js-cookie";
import axios from "../../axios";
import { ErrorToast } from "../../components/global/Toaster";
import _ from "lodash";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";
import { BsCheckLg } from "react-icons/bs";
import CustomerTableSkeleton from "../../skeletons/app/customers/CustomerTableSkeleton";
import { formatDateToMMDDYYYY } from "../../utils/helper";
import AddCategoryModal from "../../components/app/categories/AddCategoryModal";
import AddSubCategoryModal from "../../components/app/categories/AddSubCategoryModal";
import EditCategoryModal from "../../components/app/categories/EditCategoryModal";
import DeleteCategoryConfirm from "../../components/app/categories/DeleteCategoryConfirm";
import DeleteSubCategoryConfirm from "../../components/app/categories/DeleteSubCategoryConfirm";
import EditSubCategoryModal from "../../components/app/categories/EditSubCategoryModal";

const Categories = () => {
  const [categories, setCategories] = useState([]); // Updated variable name to camelCase
  const [subCategories, setSubCategories] = useState([]); // Updated variable name to camelCase

  const [categoryLoading, setCategoryLoading] = useState(false);
  const [subCategoryLoading, setSubCategoryLoading] = useState(false);

  const [update, setUpdate] = useState(false);
  const [updateSub, setUpdateSub] = useState(false);

  const getCategories = async (query = "") => {
    try {
      setCategoryLoading(true);
      const { data } = await axios.get(`/category`);
      setCategories(data?.data); // Store the actual data from the response
    } catch (error) {
      ErrorToast(error?.response?.data?.message || "Something went wrong.");
      console.log("Error:", error);
    } finally {
      setCategoryLoading(false);
    }
  };

  const getSubCategories = async (query = "") => {
    try {
      setSubCategoryLoading(true);
      const { data } = await axios.get(`/category/sub`);
      setSubCategories(data?.data); // Store the actual data from the response
    } catch (error) {
      ErrorToast(error?.response?.data?.message || "Something went wrong.");
      console.log("Error:", error);
    } finally {
      setSubCategoryLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, [update]);

  useEffect(() => {
    getSubCategories();
  }, [updateSub]);

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [deleteCategoryOpen, setDeleteCategoryOpen] = useState(false);
  const [isSubCategoryOpen, setIsSubCategoryOpen] = useState(false);
  const [deleteSubCategoryOpen, setDeleteSubCategoryOpen] = useState(false);
  const [isUpdateCategoryOpen, setIsUpdateCategoryOpen] = useState(false);
  const [isUpdateSubCategoryOpen, setIsUpdateSubCategoryOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);

  const [deleteCategory, setDeleteCategory] = useState(null);

  useEffect(() => {
    selectedCategory && setIsUpdateCategoryOpen(true);
  }, [selectedCategory]);

  useEffect(() => {
    selectedSubCategory && setIsUpdateSubCategoryOpen(true);
  }, [selectedSubCategory]);

  return (
    <div className="w-full grid grid-cols-2 gap-4  py-4 px-6 justify-start items-start">
      <div className="w-full h-full  flex flex-col  justify-start items-start gap-4">
        <div className="w-full h-auto flex flex-col gap-3 justify-start items-start">
          <div className="w-full relative flex justify-between items-center">
            <span className="text-[32px] font-bold leading-[48px] text-[#202224]">
              Categories
            </span>

            <button
              onClick={() => setIsCategoryOpen(true)}
              className="w-[116px] h-[49px] rounded-[10px] bg-[#F85E00] text-white text-sm font-normal flex items-center justify-center"
            >
              Add New
            </button>
          </div>
        </div>

        <AddCategoryModal
          isOpen={isCategoryOpen}
          onRequestClose={() => setIsCategoryOpen(false)}
          setUpdate={setUpdate}
        />

        <DeleteCategoryConfirm
          isOpen={deleteCategoryOpen}
          onRequestClose={() => setDeleteCategoryOpen(false)}
          setUpdate={setUpdate}
          category={deleteCategory}
        />

        <DeleteSubCategoryConfirm
          isOpen={deleteSubCategoryOpen}
          onRequestClose={() => setDeleteSubCategoryOpen(false)}
          setUpdate={setUpdate}
          category={deleteCategory}
        />

        <div className="w-full flex flex-col justify-start items-start">
          <div className="w-full border-t border-x h-[49px] bg-[#FCFDFD] border-gray-300 rounded-t-[14px] grid grid-cols-4 gap-2 ">
            <span className="w-full col-span-2 pl-4 flex items-center justify-start h-full ">
              <span className="text-[13px] font-medium">Category</span>
            </span>

            <span className="w-full col-span-1 flex items-center justify-start h-full ">
              <span className="text-[13px] font-medium">Date</span>
            </span>

            <span className="w-full col-span-1 flex items-center justify-end h-full  px-4">
              <span className="text-[13px] font-medium">Action</span>
            </span>
          </div>
          <div className="w-full h-auto border divide-y divide-gray-300 border-gray-300 bg-white rounded-b-[14px] flex  flex-col justify-start items-start">
            {categoryLoading ? (
              [1, 2, 3, 4, 5, 6, 7, 8]?.map((item, key) => {
                return <CustomerTableSkeleton key={key} />;
              })
            ) : categories?.length > 0 ? (
              categories?.map((category, key) => {
                return (
                  <div className="w-full grid grid-cols-4 gap-2 h-[77px] text-[#202224] ">
                    <span className="w-full col-span-2 pl-4 flex items-center gap-2 justify-start h-full ">
                      <span className="w-[44px] h-[44px] border border-[#F85E00] rounded-full flex items-center justify-center ">
                        <img
                          src={category?.cover}
                          alt="store_image"
                          className="w-[38px] h-[38px] rounded-full"
                        />
                      </span>
                      <span className="text-[13px] font-normal">
                        {category?.name}
                      </span>
                    </span>

                    <span className="w-full col-span-1 flex items-center justify-start h-full ">
                      <span className="text-[13px] font-normal">
                        {formatDateToMMDDYYYY(category?.createdAt)}
                      </span>
                    </span>

                    <span className="w-full col-span-1 flex items-center justify-end gap-2 h-full  px-6">
                      <button
                        onClick={() => {
                          setSelectedCategory(category);
                        }}
                      >
                        <img src="/edit_btn.png" alt="" className="w-[25px]" />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteCategory(category);
                          setDeleteCategoryOpen(true);
                        }}
                      >
                        <img
                          src="/delete_btn.png"
                          alt=""
                          className="w-[25px]"
                        />
                      </button>
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="col-span-12 w-full flex items-center justify-center h-56 text-xl font-semibold">
                No data available
              </div>
            )}
          </div>
        </div>

        <EditCategoryModal
          isOpen={isUpdateCategoryOpen}
          setUpdate={setUpdate}
          onRequestClose={() => setIsUpdateCategoryOpen(false)}
          category={selectedCategory}
        />
      </div>

      <div className="w-full h-full  flex flex-col  justify-start items-start gap-4">
        <div className="w-full h-auto flex flex-col gap-3 justify-start items-start">
          <div className="w-full relative flex justify-between items-center">
            <span className="text-[32px] font-bold leading-[48px] text-[#202224]">
              Sub Categories
            </span>
            <button
              onClick={() => setIsSubCategoryOpen(true)}
              className="w-[116px] h-[49px] rounded-[10px] bg-[#F85E00] text-white text-sm font-normal flex items-center justify-center"
            >
              Add New
            </button>
          </div>
        </div>

        <AddSubCategoryModal
          isOpen={isSubCategoryOpen}
          onRequestClose={() => setIsSubCategoryOpen(false)}
          setUpdate={setUpdate}
          categories={categories || []}
        />

        <EditSubCategoryModal
          isOpen={isUpdateSubCategoryOpen}
          onRequestClose={() => setIsUpdateSubCategoryOpen(false)}
          setUpdate={setUpdate}
          categories={categories || []}
          category={selectedSubCategory}
        />

        <div className="w-full flex flex-col justify-start items-start">
          <div className="w-full border-t border-x h-[49px] bg-[#FCFDFD] border-gray-300 rounded-t-[14px] grid grid-cols-4 gap-2 ">
            <span className="w-full col-span-2  pl-4 flex items-center justify-start h-full ">
              <span className="text-[13px] font-medium">Sub Category</span>
            </span>

            <span className="w-full col-span-1 flex items-center justify-start h-full ">
              <span className="text-[13px] font-medium">Category</span>
            </span>

            <span className="w-full col-span-1 flex items-center justify-end h-full  px-4">
              <span className="text-[13px] font-medium">Action</span>
            </span>
          </div>
          <div className="w-full h-auto border divide-y divide-gray-300 border-gray-300 bg-white rounded-b-[14px] flex  flex-col justify-start items-start">
            {subCategoryLoading ? (
              [1, 2, 3, 4, 5, 6, 7, 8]?.map((item, key) => {
                return <CustomerTableSkeleton key={key} />;
              })
            ) : subCategories?.length > 0 ? (
              subCategories?.map((sub, key) => {
                return (
                  <div className="w-full grid grid-cols-4 gap-2 h-[77px] text-[#202224] ">
                    <span className="w-full col-span-2 pl-4 flex items-center gap-2 justify-start h-full ">
                      <span className="w-[44px] h-[44px] border border-[#F85E00] rounded-full flex items-center justify-center ">
                        <img
                          src={sub?.cover}
                          alt="store_image"
                          className="w-[38px] h-[38px] rounded-full"
                        />
                      </span>
                      <span className="text-[13px] font-normal">
                        {sub?.name || "N/A"}
                      </span>
                    </span>

                    <span className="w-full col-span-1 flex items-center justify-start h-full ">
                      <span className="text-[13px] font-normal">
                        {sub?.parentCategory?.name}
                      </span>
                    </span>

                    <span className="w-full col-span-1 flex items-center justify-end gap-2 h-full  px-6">
                      <button
                        onClick={() => {
                          setSelectedSubCategory(sub);
                        }}
                      >
                        <img src="/edit_btn.png" alt="" className="w-[25px]" />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteCategory(sub);
                          setDeleteSubCategoryOpen(true);
                        }}
                      >
                        <img
                          src="/delete_btn.png"
                          alt=""
                          className="w-[25px]"
                        />
                      </button>
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="col-span-12 w-full flex items-center justify-center h-56 text-xl font-semibold">
                No data available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
