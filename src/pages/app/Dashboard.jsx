import React from "react";
import Analytics from "../../components/app/dashboard/Analytics";
import RentalsBooking from "../../components/app/dashboard/RentalsBooking";
import RentalTracking from "./RentalTracking";
import DashboardGraph from "../../components/app/dashboard/DashboardGraph";

const Dashboard = () => {
  return (
    <div className="w-full h-full  flex flex-col  py-4  justify-start items-start gap-6">
      <div className="w-full px-2 lg:px-6 h-auto">
        <Analytics />
      </div>
      <div className="w-full px-2 lg:px-6 pb-6 h-auto">
        <DashboardGraph />
      </div>
    </div>
  );
};

export default Dashboard;
