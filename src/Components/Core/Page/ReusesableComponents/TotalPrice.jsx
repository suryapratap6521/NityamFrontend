import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRazorpay } from "react-razorpay";
import { createAd } from "../../../../services/operations/adApi";
import { toast } from "react-toastify";

const TotalPrice = React.forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const pageData = useSelector((state) => state.page.pageData || {});
  const adData = useSelector((state) => state.ad.adData || {});
  const token = useSelector((state) => state.auth.token);
  const userData = useSelector((state) => state.profile.user || {});
  const { Razorpay } = useRazorpay();

  // Calculate days between two datetime-local values.
  const calculateDays = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  };

  let numberOfItems = 0;
  if (adData.audianceType === "allUsers") {
    numberOfItems = 100; // Adjust as needed
  } else if (adData.audianceType === "byState" && Array.isArray(adData.state)) {
    numberOfItems = adData.state.length;
  } else if (adData.audianceType === "byCity" && Array.isArray(adData.city)) {
    numberOfItems = adData.city.length;
  } else if (adData.audianceType === "byCommunity" && Array.isArray(adData.communities)) {
    numberOfItems = adData.communities.length;
  }

  const startDateTime = adData["dateSlot[startDate]"];
  const endDateTime = adData["dateSlot[endDate]"];
  const numberOfDays =
    startDateTime && endDateTime ? calculateDays(startDateTime, endDateTime) : 0;

  let price = (numberOfItems * numberOfDays * 50) / 2;
  if (adData.premium) {
    price += 50;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("pageId", pageData._id);
      formData.append("price", price);
      const response = await createAd(formData, dispatch, token);
      if (response) {
        const options = {
          key: "rzp_test_kCQKUReLyS3Siq",
          amount: price * 100,
          currency: "INR",
          name: "Nityam",
          description: "Advertised Post Payment",
          order_id: response.data.orderId,
          handler: (paymentResponse) => {
            toast.success("Payment Successful!");
          },
          prefill: {
            name: userData.firstName,
            email: userData.email,
            contact: userData.phoneNumber,
          },
          theme: {
            color: "#F37254",
          },
        };
        const razorpayInstance = new Razorpay(options);
        razorpayInstance.open();
      }
    } catch (error) {
      console.error("Error in payment:", error);
      toast.error("Payment initiation failed. Please try again.");
    }
  };

  React.useImperativeHandle(ref, () => ({
    handleSubmit,
  }));

  return (
    <div className="container bg-[#fafafa] border border-gray-300 rounded-md flex flex-col mx-auto p-6 mt-10">
      <p className="text-2xl text-black">Total Amount</p>
      <div className="mt-5 w-full">
        <div className="flex justify-between">
          <p className="text-base text-black/60">
            {adData.audianceType === "byState"
              ? "No. of States"
              : adData.audianceType === "byCity"
              ? "No. of Cities"
              : adData.audianceType === "byCommunity"
              ? "No. of Communities"
              : "All Users"}
          </p>
          <p className="text-base text-black">{numberOfItems}</p>
        </div>
        <div className="flex justify-between mt-2 mb-2">
          <p className="text-base text-black/60">No. of Days</p>
          <p className="text-base text-black">{numberOfDays}</p>
        </div>
        <div className="flex justify-between mt-2 border-t pt-2 border-black/20">
          <p className="text-base text-black/60">Total</p>
          <p className="text-lg font-medium text-black">{price.toFixed(2)}</p>
        </div>
      </div>
      <button
        className="px-4 w-full py-2 bg-gradient rounded-full text-white text-lg font-medium"
        onClick={handleSubmit}
      >
        Proceed to Pay
      </button>
    </div>
  );
});

export default TotalPrice;
