import React, { useEffect, useState, useImperativeHandle } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useRazorpay } from "react-razorpay";
import { createAd } from "../../../../services/operations/adApi";

const TotalPrice = React.forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const adData = useSelector((state) => state.ad.adData || {});
  const pageData = useSelector((state) => state.page.pageData || {});
  const token = useSelector((state) => state.auth.token);
  const userData = useSelector((state) => state.profile.user);
  const { Razorpay } = useRazorpay();

  const [communitiesCount, setCommunitiesCount] = useState(0);
  const [numberOfDays, setNumberOfDays] = useState(0);
  const [basePrice, setBasePrice] = useState(0);
  const [loadingCount, setLoadingCount] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  // Helper: Calculate difference in days
  const calculateDays = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffInMs = endDate - startDate;
    return Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
  };

  // Fetch communities count based on selected audience
  const fetchCommunitiesCount = async () => {
    try {
      setLoadingCount(true);
      let count = 0;
      const baseURL = "https://nityambackend.onrender.com/api/v1/advpost";

      if (adData.audianceType === "allUsers") {
        const res = await axios.get(`${baseURL}/getcommunities`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        count = res.data.length;
      } else if (adData.audianceType === "byState") {
        const res = await axios.post(
          `${baseURL}/getcommunitybystate`,
          { states: adData.state || [] },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        count = res.data.communities.length;
      } else if (adData.audianceType === "byCity") {
        const res = await axios.post(
          `${baseURL}/getcommunitybycity`,
          { cities: adData.city || [] },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        count = res.data.communities.length;
      } else if (adData.audianceType === "byCommunity") {
        // When byCommunity is selected, use the communities user-selected
        count = adData.communities ? adData.communities.length : 0;
      }
      setCommunitiesCount(count);
    } catch (error) {
      console.error("Error fetching communities count:", error);
      setCommunitiesCount(0);
    } finally {
      setLoadingCount(false);
    }
  };

  // Calculate number of days when dates change
  useEffect(() => {
    if (adData.startDate && adData.endDate) {
      const days = calculateDays(adData.startDate, adData.endDate);
      setNumberOfDays(days);
    }
  }, [adData.startDate, adData.endDate]);

  // Re-fetch communities whenever audience or selected locations change
  useEffect(() => {
    fetchCommunitiesCount();
  }, [adData.audianceType, adData.state, adData.city, adData.communities, token]);

  // Calculate base price (without premium)
  useEffect(() => {
    if (communitiesCount && numberOfDays) {
      setBasePrice((communitiesCount * numberOfDays) / 4);
    } else {
      setBasePrice(0);
    }
  }, [communitiesCount, numberOfDays]);

  // Calculate total price, adding Rs.50 if premium is selected
  const totalPrice = isPremium ? basePrice + 50 : basePrice;

  // Handle premium toggle change
  const handlePremiumToggle = (e) => {
    setIsPremium(e.target.checked);
  };

  // Submit handler that uses the FormData payload including premium flag
  const handleSubmit = async (e) => {
    if (e && typeof e.preventDefault === "function") {
      e.preventDefault();
    }

    if (totalPrice <= 0) {
      alert("Price is 0. Please ensure that you have selected the proper audience and dates.");
      return;
    }

    if (!pageData._id) {
      alert("Page ID is missing. Please ensure page data is loaded.");
      return;
    }

    const formData = new FormData();

    // Append simple fields
    formData.append("title", adData.title || "");
    formData.append("description", adData.description || "");
    formData.append("pageId", pageData._id);
    formData.append("price", totalPrice);

    // Append nested fields as flat keys
    formData.append("ageGroup[minAge]", adData.minAge || "");
    formData.append("ageGroup[maxAge]", adData.maxAge || "");
    formData.append(
      "dateSlot[startDate]",
      adData.startDate ? new Date(adData.startDate).toISOString() : ""
    );
    formData.append(
      "dateSlot[endDate]",
      adData.endDate ? new Date(adData.endDate).toISOString() : ""
    );

    // Append audience type and location filters
    formData.append("optionType", adData.audianceType || "");
    if (adData.audianceType === "byState" && adData.state) {
      formData.append("states", JSON.stringify(adData.state));
    }
    if (adData.audianceType === "byCity" && adData.city) {
      formData.append("cities", JSON.stringify(adData.city));
    }
    if (adData.audianceType === "byCommunity" && adData.communities) {
      adData.communities.forEach((community) =>
        formData.append("communities", community)
      );
    }

    // Append button label fields
    formData.append("buttonLabel[type]", adData.type || "");
    formData.append("buttonLabel[value]", adData.value || "");

    // Append premium flag
    formData.append("premium", isPremium ? "true" : "false");

    // Append image files, if any
    if (adData.images && Array.isArray(adData.images)) {
      adData.images.forEach((imageObj) => {
        formData.append("imagesArray", imageObj.file);
      });
    }

    try {
      const response = await createAd(formData, dispatch, token);
      if (response && response.data) {
        const options = {
          key: "rzp_test_kCQKUReLyS3Siq", // Replace with your Razorpay key
          amount: totalPrice * 100, // in paise
          currency: "INR",
          name: "Your App Name",
          description: "Payment for Advertised Post",
          order_id: response.data.orderId,
          handler: async (paymentResponse) => {
            alert("Payment Successful! Advertised post created.");
          },
          prefill: {
            name: userData.firstName,
            email: userData.email,
            contact: userData.phoneNumber,
          },
          theme: { color: "#F37254" },
        };
        const razorpayInstance = new Razorpay(options);
        razorpayInstance.open();
      }
    } catch (error) {
      console.error("Error in payment process:", error);
      alert("Payment initiation failed. Please try again.");
    }
  };

  useImperativeHandle(ref, () => ({
    handleSubmit,
  }));

  return (
    <div className="container bg-[#fafafa] border border-gray-300 rounded-md flex flex-col mx-auto p-6 mt-10">
      <p className="text-2xl text-[#000000]">Total Amount</p>
      {loadingCount ? (
        <p>Loading community details...</p>
      ) : (
        <>
          <div className="mt-5 w-full">
            {/* Always show "Total Communities" regardless of audience type */}
            <div className="w-full flex justify-between">
              <p className="text-base text-[#00000080]">Total Communities</p>
              <p className="text-base text-[#000000]">
                {adData.audianceType === "byCommunity"
                  ? adData.communities?.length || 0
                  : communitiesCount}
              </p>
            </div>
            <div className="w-full flex justify-between mt-2 mb-2">
              <p className="text-base text-[#00000080]">No. of Days</p>
              <p className="text-base text-[#000000]">{numberOfDays}</p>
            </div>
            <div className="w-full flex justify-between mt-2 border-t pt-2 border-[#00000020]">
              <p className="text-base text-[#00000080]">Base Price</p>
              <p className="text-lg font-medium text-[#000000]">
                {basePrice.toFixed(2)}
              </p>
            </div>
            <div className="w-full flex justify-between mt-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={isPremium}
                  onChange={handlePremiumToggle}
                />
                <span className="text-base text-[#00000080]">
                  Add Premium (+Rs. 50)
                </span>
              </label>
              <p className="text-lg font-medium text-[#000000]">
                {totalPrice.toFixed(2)}
              </p>
            </div>
          </div>
          <button
            className="px-4 w-full py-2 bg-gradient rounded-full text-white text-lg font-medium mt-4"
            onClick={handleSubmit}
          >
            Proceed to Pay
          </button>
        </>
      )}
    </div>
  );
});

export default TotalPrice;
