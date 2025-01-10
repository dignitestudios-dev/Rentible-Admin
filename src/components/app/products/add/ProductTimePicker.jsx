import React, { useEffect, useState } from "react";
import { IoMdCheckmark } from "react-icons/io";
import { convertToEpochTime } from "../../../../utils/helper";
const ProductTimePicker = ({
  label,
  selectedTime,
  setSelectedTime,
  values,
  errors,
  touched,
  name,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleTimeChange = (type, value) => {
    setSelectedTime((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const hours = [...Array(12).keys()].map((h) =>
    (h + 1).toString().padStart(2, "0")
  );
  const minutes = [...Array(60).keys()].map((m) =>
    m.toString().padStart(2, "0")
  );

  useEffect(() => {
    if (selectedTime?.hour && selectedTime?.minute && selectedTime?.period) {
      values[name] = convertToEpochTime(
        `${selectedTime.hour}:${selectedTime.minute} ${selectedTime.period}`
      );
    } else {
      values[name] = "";
    }
  }, [selectedTime]);

  return (
    <div className="w-full h-auto flex flex-col justify-start items-start gap-2">
      <label className="text-[14px] font-medium leading-[21px] ">{label}</label>
      <div className="relative w-full">
        {/* Selected Time Display */}
        <button
          type="button"
          onClick={toggleDropdown}
          className={` px-4 py-2 text-left   w-full h-[49px] rounded-[8px] outline-none focus:border bg-[#f8f8f8]/[0.6]  ${
            errors[name] && touched[name] ? "border border-red-500" : ""
          }  focus:outline-none `}
        >
          {selectedTime?.hour && selectedTime?.minute && selectedTime?.period
            ? `${selectedTime.hour}:${selectedTime.minute} ${selectedTime.period}`
            : "Select"}
        </button>

        {errors[name] && touched[name] ? (
          <p className="text-red-700 text-sm font-medium">{errors[name]}</p>
        ) : null}

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute z-10 w-full mt-2 bg-[#f8f8f8] border rounded-md shadow-md">
            <div className="flex gap-3 justify-between p-4">
              {/* Hours */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold">Hours</span>
                <div className="border bg-gray-100 rounded-md p-1">
                  <div className="h-32 overflow-y-auto pr-1  ">
                    {hours.map((hour) => (
                      <button
                        type="button"
                        key={hour}
                        onClick={() => handleTimeChange("hour", hour)}
                        className={`w-full px-4 py-2 text-xs rounded-md text-left hover:bg-orange-200 ${
                          selectedTime.hour === hour
                            ? "bg-orange-200 font-semibold"
                            : ""
                        }`}
                      >
                        {hour}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Minutes */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold">Minutes</span>
                <div className="border bg-gray-100 rounded-md p-1">
                  <div className="h-32 overflow-y-auto pr-1 ">
                    {minutes.map((minute) => (
                      <button
                        type="button"
                        key={minute}
                        onClick={() => handleTimeChange("minute", minute)}
                        className={`w-full px-4 py-2 text-left text-xs rounded-md hover:bg-orange-200 ${
                          selectedTime.minute === minute
                            ? "bg-orange-200 font-semibold"
                            : ""
                        }`}
                      >
                        {minute}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* AM/PM */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold">AM/PM</span>
                <div className="flex flex-col p-1 border bg-gray-100 rounded-md">
                  {["AM", "PM"].map((period) => (
                    <button
                      type="button"
                      key={period}
                      onClick={() => handleTimeChange("period", period)}
                      className={`w-full px-4 py-2 text-xs text-left rounded-md hover:bg-orange-200 ${
                        selectedTime.period === period
                          ? "bg-orange-200 font-semibold"
                          : ""
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-6 h-6 rounded-full flex items-center justify-center text-white text-lg bg-orange-500 absolute bottom-2 right-2"
            >
              <IoMdCheckmark />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTimePicker;
