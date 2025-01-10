import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { useContext, useEffect } from "react";
import { GoDotFill } from "react-icons/go";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import Cookies from "js-cookie";
import axios from "../../../axios";
import { IoMdArrowDropup, IoMdArrowDropdown } from "react-icons/io";

// Register necessary components
Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// Chart options
const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
      display: false,
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          return context.dataset.label + ": " + context.raw;
        },
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      grid: {
        display: true,
      },
      ticks: {
        display: true,
      },
      border: {
        display: false,
      },
    },
  },
};

const monthsArray = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DashboardGraph = () => {
  const [showOpt3, setShowOpt3] = useState(false);
  const [showOpt4, setShowOpt4] = useState(false);

  const [openDropdown2, setOpenDropdown2] = useState(false);
  const [openDropdown3, setOpenDropdown3] = useState(false);
  const toggleDropdown2 = () => {
    setOpenDropdown2(!openDropdown2);
  };

  const toggleDropdown3 = () => {
    setOpenDropdown3(!openDropdown3);
  };

  const [filter2, setFilter2] = useState("yearly");

  const currentYear = new Date().getFullYear();
  const [selectedMonth, setSelectedMonth] = useState("Select Month");
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const getYearsArray = () => {
    const startYear = 2025;
    const years = [];
    for (let year = startYear; year <= currentYear; year++) {
      years.push(year);
    }
    return years;
  };

  const [personData, setPersonData] = useState([]);
  const [personDataLoading, setPersonDataLoading] = useState(false);

  useEffect(() => {
    setPersonData({
      counts: [
        0, 3, 0, 3, 0, 3, 4, 1, 0, 0, 0, 2, 3, 1, 4, 5, 0, 5, 1, 2, 0, 5, 2, 1,
        3, 3, 1, 2, 6, 5,
      ],
      result: [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
      ],
    });
  }, [selectedYear, selectedMonth]);

  // Sample data
  const data = {
    labels: personData?.result, // This will be your months
    datasets: [
      {
        label: "Total Revenue", // Dataset label
        data: personData?.counts, // Subscription counts
        backgroundColor: "#F85E00", // Bar color
        borderColor: "#ffffff", // Border color
        borderWidth: 1,
        borderRadius: { topLeft: 5, topRight: 5 },
        // borderSkipped: "bottom",
      },
    ],
  };
  return (
    <div className="bg-white p-6 shadow-lg rounded-[20px] flex flex-col gap-y-6">
      <div className="w-full flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <h1 className="text-[16px] leading-[24px] text-[#121516] font-semibold">
          Sales Overview
        </h1>
        <div className="relative flex gap-2">
          <div className="relative z-[1000]">
            <button
              className="w-[124px]  py-2 flex items-center justify-center gap-[2px] bg-gray-100 rounded-md text-[11px] font-medium"
              onClick={toggleDropdown3}
            >
              {selectedMonth == "Select Month"
                ? selectedMonth
                : selectedMonth?.name}{" "}
              {openDropdown3 ? (
                <IoMdArrowDropdown className="text-base" />
              ) : (
                <IoMdArrowDropup className="text-base" />
              )}
            </button>
            {openDropdown3 && (
              <div className="bg-gray-100 w-[124px] max-h-[200px] overflow-y-scroll rounded-md mt-1 modal-scroll custom-shadow absolute flex flex-col items-start gap-3 px-3 py-2">
                <button
                  onClick={() => {
                    setSelectedMonth("Select Month");
                    toggleDropdown3();
                  }}
                  className={`font-medium text-[11px] w-full px-3 py-1 text-start hover:bg-gray-100 `}
                >
                  Select Month
                </button>
                {monthsArray?.map((month, key) => {
                  return (
                    <div
                      key={key}
                      className="w-full flex flex-col items-start gap-3 justify-start"
                    >
                      <button
                        key={key}
                        onClick={() => {
                          setSelectedMonth({ name: month, number: key + 1 });
                          toggleDropdown3();
                        }}
                        className={`font-medium text-[11px] w-full px-3 py-1 text-start hover:bg-gray-100 ${
                          selectedMonth?.name == month
                            ? "bg-gray-100"
                            : "bg-transparent"
                        }`}
                      >
                        {month}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div>
            <button
              className="w-[86px] z-[1000] py-2 flex items-center capitalize justify-center gap-[2px] bg-gray-100 rounded-md text-[11px] font-medium"
              onClick={toggleDropdown2}
            >
              {selectedYear}
              {openDropdown2 ? (
                <IoMdArrowDropdown className="text-base" />
              ) : (
                <IoMdArrowDropup className="text-base" />
              )}
            </button>
            {openDropdown2 && (
              <div className="bg-gray-100 rounded-md mt-1 w-[92px] h-auto py-1 custom-shadow absolute flex flex-col items-start">
                {getYearsArray()?.map((year, key) => {
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        setSelectedYear(year);
                        toggleDropdown2();
                      }}
                      className={`font-medium text-[11px] w-full px-3 py-1 text-start hover:bg-gray-100   ${
                        selectedYear == year ? "bg-gray-100" : "bg-transparent"
                      }`}
                    >
                      {year}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col justify-start items-start gap-2 col-span-3 h-full p-4">
        <div className="h-full w-full flex justify-center items-center">
          {personDataLoading ? (
            <div className="w-full h-[400px] bg-gray-100 rounded-lg animate-pulse"></div>
          ) : (
            <Bar data={data} options={options} />
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardGraph;
