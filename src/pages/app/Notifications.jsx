import React, { useState, useEffect, useContext } from "react";
import { useSwipeable } from "react-swipeable";
import { FaTrash, FaCheck } from "react-icons/fa";
import axios from "../../axios.js";
import Cookies from "js-cookie";
import { AppContext } from "../../context/AppContext.jsx";
import { useNavigate } from "react-router-dom";
import { ErrorToast, SuccessToast } from "../../components/global/Toaster.jsx";
import AddNotificationModal from "../../components/app/notifications/AddNotificationModal.jsx";

// Child Component to Handle Swipe
const SwipeableNotification = ({ notification, getTimeAgo, setUpdate }) => {
  const [deleteOne, setDeleteOne] = useState(false);
  const deleteNotification = async (id) => {
    try {
      setDeleteOne(true);
      const response = await axios.delete(`/notification/${id}`);
      if (response?.data?.success) {
        setUpdate((prev) => !prev);
        SuccessToast("Notification deleted successfully.");
      }
    } catch (error) {
      ErrorToast(error?.response?.data?.message);
    } finally {
      setDeleteOne(false);
    }
  };

  return (
    <div className="w-full h-auto relative -z-10 grid grid-cols-5 justify-start items-start">
      <div
        key={notification?._id}
        className={`w-full col-span-5 select-none px-3 rounded-t-lg cursor-pointer grid grid-cols-1 md:grid-cols-5 notification border-b gap-x-4 bg-white
        `}
      >
        <div className="col-span-3 md:border-b py-4">
          <p className="font-medium select-none text-base text-[#F85E00]">
            {notification?.title}
          </p>
          <p className="font-normal select-none text-base text-[#222222]">
            {notification?.description}
          </p>
        </div>
        <div className="col-span-2 flex flex-col  gap-1 items-end justify-center text-end md:border-b py-4">
          <p className="text-[#5C5C5C] text-sm font-medium pt-1">
            {getTimeAgo(notification?.createdAt)}
          </p>

          <button
            onClick={(e) => {
              deleteNotification(notification?._id);
            }}
            className="w-auto px-3 h-7 flex gap-1 items-center justify-center bg-red-500 text-white rounded-xl"
          >
            Delete
            {deleteOne && (
              <div
                class="animate-spin inline-block size-3 border-[3px]  border-current border-t-transparent text-white rounded-full"
                role="status"
                aria-label="loading"
              >
                <span class="sr-only">Loading...</span>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const Notifications = () => {
  const { notifications, setNotifications } = useContext(AppContext);
  const [data, setData] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    const getNotifications = () => {
      const token = Cookies.get("token");
      if (token) {
        setDataLoading(true);
        axios
          .get(`/admin/notifications`)
          .then((response) => {
            setData(response?.data?.data);
            setNotifications(response?.data?.data);
            setDataLoading(false);
          })
          .catch((error) => {
            ErrorToast(error?.response?.data?.message);
            setDataLoading(false);
          });
      }
    };

    getNotifications();
  }, [update]);

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 },
      { label: "second", seconds: 1 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(diffInSeconds / interval.seconds);
      if (count > 0) {
        return `${count} ${interval.label}${count !== 1 ? "s" : ""} ago`;
      }
    }

    return "just now";
  };

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full h-auto overflow-x-hidden flex justify-center items-center">
      <div className="  w-full  h-full p-6  flex flex-col gap-6">
        <div className="w-full flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">Notifications</h1>
          </div>

          <AddNotificationModal
            isOpen={isOpen}
            setUpdate={setUpdate}
            onRequestClose={() => setIsOpen(false)}
          />

          <button
            onClick={() => setIsOpen(true)}
            className="bg-[#F85E00] rounded-[10px] text-[13px] font-semibold text-white py-2.5 w-[118px]"
          >
            + Send New
          </button>
        </div>

        <div className="w-full flex z-0 flex-col gap-2">
          {dataLoading ? (
            [1, 2, 3, 4, 5]?.map((item) => (
              <div className="w-full h-24 rounded-t-[15px] bg-gray-200 animate-pulse"></div>
            ))
          ) : data?.length < 1 ? (
            <div>No notifications available.</div>
          ) : (
            data.map((notification) => (
              <SwipeableNotification
                key={notification?._id}
                notification={notification}
                getTimeAgo={getTimeAgo}
                setUpdate={setUpdate}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
