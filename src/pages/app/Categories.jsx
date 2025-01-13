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

const Categories = () => {
  const [categories, setCategories] = useState([]); // Updated variable name to camelCase
  const [subCategories, setSubCategories] = useState([]); // Updated variable name to camelCase

  const [pagination, setPagination] = useState({
    itemsPerPage: 0,
    currentPage: 0,
    totalItems: 0,
    totalPages: 0,
  }); // Updated variable name to camelCase

  const [paginationSub, setPaginationSub] = useState({
    itemsPerPage: 0,
    currentPage: 0,
    totalItems: 0,
    totalPages: 0,
  });

  const [categoryLoading, setCategoryLoading] = useState(false);
  const [subCategoryLoading, setSubCategoryLoading] = useState(false);

  const [update, setUpdate] = useState(false);
  const [updateSub, setUpdateSub] = useState(false);

  //   const store = JSON.parse(Cookies.get("store"));
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSub, setCurrentPageSub] = useState(1);

  const getCategories = async (query = "") => {
    try {
      setCategoryLoading(true);
      const { data } = await axios.get(`/category?page=${currentPage}&limit=5`);
      setCategories(data?.data); // Store the actual data from the response
      setPagination(data?.pagination);
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
      const { data } = await axios.get(
        `/category/sub?page=${currentPageSub}&limit=5`
      );
      setSubCategories(data?.data); // Store the actual data from the response
      setPaginationSub(data?.pagination);
    } catch (error) {
      ErrorToast(error?.response?.data?.message || "Something went wrong.");
      console.log("Error:", error);
    } finally {
      setSubCategoryLoading(false);
    }
  };
  //

  useEffect(() => {
    getCategories();
  }, [update, currentPage]);

  useEffect(() => {
    getSubCategories();
  }, [updateSub, currentPageSub]);

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isSubCategoryOpen, setIsSubCategoryOpen] = useState(false);
  const [isUpdateCategoryOpen, setIsUpdateCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

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
                          setIsUpdateCategoryOpen(true);
                        }}
                      >
                        <img src="/edit_btn.png" alt="" className="w-[25px]" />
                      </button>
                      <button>
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

          {!categoryLoading && categories?.length > 0 && (
            <div className="w-full my-6  px-3 h-[61px] rounded-full bg-white flex justify-between items-center">
              <span className="text-[16px] font-normal text-black">
                You have {pagination?.currentPage} of {pagination?.totalPages}{" "}
                Pages
              </span>

              <div className="w-auto flex items-center  justify-start   gap-2 ">
                <button
                  disabled={currentPage == 1}
                  onClick={() =>
                    setCurrentPage((prev) => (prev !== 1 ? prev - 1 : prev))
                  }
                  className="w-[43px] h-[43px] rounded-full bg-gray-200 flex items-center justify-center text-3xl text-[#000] disabled:text-[#909090]"
                >
                  <RxCaretLeft />
                </button>

                <div className="w-auto flex justify-center items-center h-[43px] rounded-full px-2  bg-gray-200">
                  {Array.from(
                    { length: pagination?.totalPages },
                    (_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`w-[33px] h-[33px]  ${
                          currentPage == index + 1
                            ? "bg-[#F85E00] text-white"
                            : "bg-transparent text-[#909090]"
                        } hover:bg-[#F85E00]/[0.4] hover:text-[#000]/[0.8] flex items-center rounded-full justify-center`}
                      >
                        {index + 1}
                      </button>
                    )
                  )}
                </div>
                <button
                  disabled={currentPage == pagination?.totalPages}
                  onClick={() =>
                    setCurrentPage((prev) =>
                      prev !== pagination?.totalPages ? prev + 1 : prev
                    )
                  }
                  className="w-[43px] h-[43px] rounded-full bg-gray-200 flex items-center justify-center text-3xl text-[#000] disabled:text-[#909090]"
                >
                  <RxCaretRight />
                </button>
              </div>
            </div>
          )}
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
                      <button>
                        <img src="/edit_btn.png" alt="" className="w-[25px]" />
                      </button>
                      <button>
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

          {!subCategoryLoading && subCategories?.length > 0 && (
            <div className="w-full my-6  px-3 h-[61px] rounded-full bg-white flex justify-between items-center">
              <span className="text-[16px] font-normal text-black">
                You have {paginationSub?.currentPage} of{" "}
                {paginationSub?.totalPages} Pages
              </span>

              <div className="w-auto flex items-center  justify-start   gap-2 ">
                <button
                  disabled={currentPageSub == 1}
                  onClick={() =>
                    setCurrentPageSub((prev) => (prev !== 1 ? prev - 1 : prev))
                  }
                  className="w-[43px] h-[43px] rounded-full bg-gray-200 flex items-center justify-center text-3xl text-[#000] disabled:text-[#909090]"
                >
                  <RxCaretLeft />
                </button>

                <div className="w-auto flex justify-center items-center h-[43px] rounded-full px-2  bg-gray-200">
                  {Array.from(
                    { length: paginationSub?.totalPages },
                    (_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPageSub(index + 1)}
                        className={`w-[33px] h-[33px]  ${
                          currentPageSub == index + 1
                            ? "bg-[#F85E00] text-white"
                            : "bg-transparent text-[#909090]"
                        } hover:bg-[#F85E00]/[0.4] hover:text-[#000]/[0.8] flex items-center rounded-full justify-center`}
                      >
                        {index + 1}
                      </button>
                    )
                  )}
                </div>
                <button
                  disabled={currentPageSub == paginationSub?.totalPages}
                  onClick={() =>
                    setCurrentPageSub((prev) =>
                      prev !== paginationSub?.totalPages ? prev + 1 : prev
                    )
                  }
                  className="w-[43px] h-[43px] rounded-full bg-gray-200 flex items-center justify-center text-3xl text-[#000] disabled:text-[#909090]"
                >
                  <RxCaretRight />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Categories;
