import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";
import { createAd } from "../../../../services/operations/adApi"

const TotalPrice = () => {
    const pageData = useSelector((state) => state.page.pageData || {});
    const dispatch = useDispatch();
    const adData = useSelector((state) => state.ad.adData || {});
    const token = useSelector((state) => state.auth.token);
    const userData = useSelector((state) => state.profile.user);
    const { error, isLoading, Razorpay } = useRazorpay();


    // Helper function to calculate the difference in days
    const calculateDays = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return Math.ceil((end - start) / (1000 * 60 * 60 * 24)); // Difference in milliseconds to days
    };

    // Calculate the number of items (states, cities, communities)
    let numberOfItems = 0;
    if (adData.audianceType === "byState" && adData.state) {
        numberOfItems = adData.state.length; // Assuming `state` is an array
    } else if (adData.audianceType === "byCity" && adData.city) {
        numberOfItems = adData.city.length; // Assuming `city` is an array
    } else if (adData.audianceType === "byCommunity" && adData.communities) {
        numberOfItems = adData.communities.length; // Assuming `communities` is an array
    }

    // Calculate the number of days
    const numberOfDays =
        adData.startDate && adData.endDate
            ? calculateDays(adData.startDate, adData.endDate)
            : 0;

    // Calculate the price
    const price = (numberOfItems * numberOfDays * 50) / 2;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const today = new Date().toISOString().split("T")[0]; // Get today's date (YYYY-MM-DD)
        const startIsoString = new Date(`${today}T${adData.start}:00.000Z`).toISOString();
        const endIsoString = new Date(`${today}T${adData.end}:00.000Z`).toISOString();
        const startDateTime = new Date(adData.startDate);
        const endDateTime = new Date(adData.endDate);

        let state, city, communities;

        // Determine which field to include based on audianceType
        if (adData.audianceType === 'byState') {
            state = adData.state;
        } else if (adData.audianceType === 'byCity') {
            city = adData.city;
        } else if (adData.audianceType === 'byCommunity') {
            communities = adData.communities;
        }

        // Construct the data object
        const data = {
            title: adData.title,
            timeSlot: {
                start: startIsoString,
                end: endIsoString,
            },
            ageGroup: {
                minAge: adData.minAge,
                maxAge: adData.maxAge,
            },
            dateSlot: {
                startDate: startDateTime,
                endDate: endDateTime,
            },
            optionType: adData.audianceType,
            pageId: pageData._id,
            price: price,
            buttonLabel: {
                type: adData.type,
                value: adData.value,
            },
            ...(state && { state }),        // Add state only if defined
            ...(city && { city }),          // Add city only if defined
            ...(communities && { communities }), // Add communities only if defined
        };
        //console.log(data)

        const formData = new FormData();
        formData.append("title", adData.title);
        formData.append("pageId", pageData._id);
        formData.append("price", price);

        // Append time slot
        formData.append("timeSlot[start]", startIsoString);
        formData.append("timeSlot[end]", endIsoString);

        // Append age group
        formData.append("ageGroup[minAge]", adData.minAge);
        formData.append("ageGroup[maxAge]", adData.maxAge);

        // Append date slot
        formData.append("dateSlot[startDate]", startDateTime);
        formData.append("dateSlot[endDate]", endDateTime);

        // Append option type
        formData.append("optionType", adData.optionType);

        // Append locations
        // adData.states.forEach((state) => formData.append("states[]", state));
        // adData.cities.forEach((city) => formData.append("cities[]", city));

        // Append selected communities
        formData.append("communities[]", communities);

        // Append button label
        formData.append("buttonLabel[type]", adData.type);
        formData.append("buttonLabel[value]", adData.value);

        // Append images
        //adData.images.forEach((image) => formData.append("media", image));
        try {
            const response = await createAd(data, dispatch, token);
            // alert("Business page created successfully!");
            //console.log("Response:", response.data);
            if (response) {
                try {
                    // const response = await fetch("/create-order", {
                    //     method: "POST",
                    //     headers: {
                    //         "Content-Type": "application/json",
                    //     },
                    //     body: JSON.stringify({ amount: price }),
                    // });

                    // const order = await response.json();

                    const options = {
                        key: "rzp_test_kCQKUReLyS3Siq",
                        amount: price * 100,
                        currency: "INR",
                        name: "Nityam",
                        description: "Nityam",
                        order_id: response.data.orderId, // Use order_id from backend
                        handler: (response) => {
                            //console.log(response);
                            alert("Payment Successful!");
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
                } catch (error) {
                    console.error("Payment initiation failed:", error);
                    alert("Payment initiation failed. Please try again.");
                }
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to create business page. Please try again.");
        }
    };

    return (
        <div className="container bg-white items-start border-t-0 flex flex-column mx-auto p-6 mt-10">
            <p className={`text-2xl text-[#000000] w-fit`}>Amount</p>
            <div className="mt-5 w-full">
                <div className="w-full flex justify-between">
                    <p className={`text-base text-[#00000080] w-fit`}>
                        {adData.audianceType === "byState"
                            ? "No. of States"
                            : adData.audianceType === "byCity"
                                ? "No. of Cities"
                                : "No. of Communities"}
                    </p>
                    <p className={`text-base text-[#000000] w-fit`}>{numberOfItems}</p>
                </div>

                <div className="w-full flex justify-between mt-2 mb-2">
                    <p className={`text-base text-[#00000080] w-fit`}>No. of Days</p>
                    <p className={`text-base text-[#000000] w-fit`}>{numberOfDays}</p>
                </div>

                <div className="w-full flex justify-between mt-2 border-t pt-2 border-[#00000020]">
                    <p className={`text-base text-[#000000] w-fit`}>Total</p>
                    <p className={`text-base text-[#000000] w-fit`}>{price.toFixed(2)}</p>
                </div>
            </div>
            {isLoading && <p>Loading Razorpay...</p>}
            {error && <p>Error loading Razorpay: {error}</p>}
            <button className="px-4 w-full py-2 bg-[#007AFF] text-white text-base rounded" onClick={handleSubmit} >
                Pay Now
            </button>
        </div>
    );
};

export default TotalPrice;
