import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
  countryCode: z.string().nonempty({ message: "Please select a country code" }),
  phone: z.string().regex(/^\d{10}$/, { message: "Phone number must be 10 digits" }),
  gender: z.string().nonempty({ message: "Please select a gender" }),
  dateOfBirth: z.string().nonempty({ message: "Please enter your date of birth" }),
  state: z.string().nonempty({ message: "Please select a state" }),
  city: z.string().nonempty({ message: "Please select a city" }),
  pincode: z.string().regex(/^\d{6}$/, { message: "Pincode must be 6 digits" }),
  accountType: z.string().nonempty({ message: "Please select an account type" }),
  verifyYourself: z.boolean(),
  verificationMethod: z.string().optional(),
  terms: z.boolean().refine(val => val === true, { message: "You must agree to the terms" }),
  otp: z.string().regex(/^\d{6}$/, { message: "OTP must be 6 digits" }).optional(),
  governmentId: z.any().optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
  }).optional(),
  community: z.string().optional(),
});

const Signup = () => {
  const [step, setStep] = useState(1);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [pincodes, setPincodes] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [verificationMethod, setVerificationMethod] = useState('');
  const [communities, setCommunities] = useState([]);

  const { control, register, handleSubmit, formState: { errors, isValid }, watch, setValue, trigger } = useForm({
    resolver: zodResolver(formSchema),
    mode: "onChange"
  });

  const verifyYourself = watch("verifyYourself");

  const sendOtp = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/auth/sendotp", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber: watch('phone') }),
      });
      const data = await response.json();
      if (data.success) {
        setIsOtpSent(true);
        setShowOtpModal(true);
        console.log({
          title: "OTP Sent",
          description: "Please check your phone for the OTP",
          status: "success",
        });
      }
    } catch (error) {
      console.log({
        title: "Error",
        description: error.message || "Failed to send OTP",
        status: "error",
        error: error
      });
    }
  };

  const verifyOtp = async () => {
    try {
      const formData = {
        username: watch('name'),
        email: watch('email'),
        password: watch('password'),
        confirmPassword: watch('password'),
        otp: watch('otp'),
        phoneNumber: watch('phone'),
      };
      const response = await fetch("http://localhost:8080/api/v1/auth/signup", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        setIsOtpVerified(true);
        setShowOtpModal(false);
        setStep(2);
        console.log({
          title: "OTP Verified",
          description: "Your OTP has been verified successfully",
          status: "success",
        });
      }
    } catch (error) {
      console.log({
        title: "Error",
        description: error.message || "Failed to verify OTP",
        status: "error",
        error: error
      });
    }
  };

  const nextStep = async () => {
    setStep(step + 1);
    // const isStepValid = await trigger();
    // if (isStepValid) {
    //   if (step === 2) {
    //     try {
    //       const response = await fetch('/api/auth/register-gender-dob', {
    //         method: 'POST',
    //         headers: {
    //           'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({
    //           gender: watch('gender'),
    //           dateOfBirth: watch('dateOfBirth'),
    //         }),
    //       });
    //       const data = await response.json();
    //       if (data.success) {
    //         setStep(3);
    //       }
    //     } catch (error) {
    //       console.log({
    //         title: "Error",
    //         description: error.message || "Failed to save gender and date of birth",
    //         status: "error",
    //       });
    //     }
    //   } else if (step === 3) {
    //     try {
    //       const response = await fetch('/api/auth/register-community-details', {
    //         method: 'POST',
    //         headers: {
    //           'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({
    //           state: watch('state'),
    //           city: watch('city'),
    //           pincode: watch('pincode'),
    //         }),
    //       });
    //       const data = await response.json();
    //       if (data.success) {
    //         const pincodeResponse = await fetch(`https://api.postalpincode.in/pincode/${watch('pincode')}`);
    //         const pincodeData = await pincodeResponse.json();
    //         if (pincodeData[0].Status === "Success") {
    //           setCommunities(pincodeData[0].PostOffice.map(po => po.Name));
    //         }
    //         setStep(4);
    //       }
    //     } catch (error) {
    //       console.log({
    //         title: "Error",
    //         description: error.message || "Failed to save community details",
    //         status: "error",
    //       });
    //     }
    //   } else if (step < 5) {
    //     setStep(step + 1);
    //   }
    // }
  };

  const onSubmit = async (data) => {
    try {
      const response = await fetch('/api/auth/register-community', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          community: data.community,
        }),
      });
      const responseData = await response.json();
      if (responseData.success) {
        console.log({
          title: "Success",
          description: "Registration completed successfully",
          status: "success",
        });
        console.log("Registration Successful - Do Redirection");
      }
    } catch (error) {
      console.log({
        title: "Error",
        description: error.message || "Failed to complete registration",
        status: "error",
      });
    }
  };

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await fetch('/api/community/community');
        const data = await response.json();
        setStates(data.states);
      } catch (error) {
        console.error("No States found");
        setStates([]);
      }
    };

    fetchStates();
  }, []);

  const fetchCities = async (state) => {
    try {
      const response = await fetch(`/api/community/community?state=${state}`);
      const data = await response.json();
      if (data.cities) {
        setCities(data.cities);
      } else {
        setCities([]);
        console.error('No Cities found for the selected State');
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const fetchPincodes = async (state, city) => {
    try {
      const response = await fetch(`/api/community/community?state=${state}&city=${city}`);
      const data = await response.json();
      if (data.pincodes) {
        setPincodes(data.pincodes);
      } else {
        setPincodes([]);
        console.error('No pincodes found for the selected city');
      }
    } catch (error) {
      console.error('Error fetching pincodes:', error);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex justify-center mb-8">
      {[1, 2, 3, 4, ...(verifyYourself ? [5] : [])].map((s) => (
        <div key={s} className="flex items-center">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold transition-colors duration-300 ${s === step
              ? 'bg-[#F9ED25] text-[#C7872A]'
              : s < step
                ? 'bg-[#1E8D44] text-white'
                : 'bg-white text-[#1E8D44] border-2 border-[#1E8D44]'
              }`}
          >
            {s < step ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : s}
          </div>
          {s < (verifyYourself ? 5 : 4) && (
            <div
              className={`w-20 h-1 transition-colors duration-300 ${s < step ? 'bg-[#1E8D44]' : 'bg-gray-300'
                }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className='p-6'>
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Personal Information</h2>
              <p className="text-[#1E8D44]">Enter your details to get started</p>
            </div>
            <div className="space-y-4">
              <input
                {...register("name")}
                placeholder="Full Name"
                className="w-full p-2 border border-[#1E8D44] rounded focus:ring-[#1E8D44] focus:border-[#1E8D44]"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
              <input
                {...register("email")}
                type="email"
                placeholder="Email"
                className="w-full p-2 border border-[#1E8D44] rounded focus:ring-[#1E8D44] focus:border-[#1E8D44]"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full p-2 border border-[#1E8D44] rounded focus:ring-[#1E8D44] focus:border-[#1E8D44] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-end bg-transparent hover:bg-transparent text-sm leading-5"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLin ecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
              <div className="flex space-x-2">
                <Controller
                  name="countryCode"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-[100px] p-2 border border-[#1E8D44] rounded focus:ring-[#1E8D44] focus:border-[#1E8D44]"
                    >
                      <option value="+91">+91</option>
                    </select>
                  )}
                />
                <input
                  {...register("phone")}
                  type="tel"
                  placeholder="Phone Number"
                  className="flex-1 p-2 border border-[#1E8D44] rounded focus:ring-[#1E8D44] focus:border-[#1E8D44]"
                />
              </div>
              {errors.countryCode && <p className="text-red-500 text-sm">{errors.countryCode.message}</p>}
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
              <button
                onClick={sendOtp}
                className="w-full p-2 bg-[#F9ED25] text-black hover:bg-[#F9ED25]/90 rounded transition-colors duration-300"
                disabled={isOtpSent}
              >
                {isOtpSent ? 'OTP Sent' : 'Get OTP'}
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className='p-6'>
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Additional Information</h2>
              <p className="text-[#1E8D44]">Please provide your gender and date of birth</p>
            </div>
            <div className="space-y-4 bg-gradient-to-r from-[#1E8D44]/10 to-[#F9ED25]/10 p-6 rounded-lg">
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <div className="flex justify-around">
                    <button
                      type="button"
                      onClick={() => field.onChange('male')}
                      className={`p-2 rounded-full ${field.value === 'male' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                      👨 Male
                    </button>
                    <button
                      type="button"
                      onClick={() => field.onChange('female')}
                      className={`p-2 rounded-full ${field.value === 'female' ? 'bg-pink-500 text-white' : 'bg-gray-200'}`}
                    >
                      👩 Female
                    </button>
                    <button
                      type="button"
                      onClick={() => field.onChange('other')}
                      className={`p-2 rounded-full ${field.value === 'other' ? 'bg-purple-500 text-white' : 'bg-gray-200'}`}
                    >
                      🧑 Other
                    </button>
                  </div>
                )}
              />
              {errors.gender && <p className="text-red-500 text-sm mt-2">{errors.gender.message}</p>}

              <input
                {...register("dateOfBirth")}
                type="date"
                placeholder="Date of Birth"
                className="w-full p-2 border border-[#1E8D44] rounded focus:ring-[#1E8D44] focus:border-[#1E8D44] bg-white mt-4"
              />
              {errors.dateOfBirth && <p className="text-red-500 text-sm mt-2">{errors.dateOfBirth.message}</p>}
            </div>
          </div>
        );
      case 3:
        return (
          <div className='p-6'>
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Community Details</h2>
              <p className="text-[#1E8D44]">Enter your location information</p>
            </div>
            <div className="space-y-4">
              <Controller
                name="state"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      fetchCities(e.target.value);
                    }}
                    className="w-full p-2 border border-[#1E8D44] rounded focus:ring-[#1E8D44] focus:border-[#1E8D44]"
                  >
                    <option value="">Select State</option>
                    {states.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                )}
              />
              {errors.state && <p className="text-red-500 text-sm">{errors.state.message}</p>}

              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      fetchPincodes(watch("state"), e.target.value);
                    }}
                    className="w-full p-2 border border-[#1E8D44] rounded focus:ring-[#1E8D44] focus:border-[#1E8D44]"
                  >
                    <option value="">Select City</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                )}
              />
              {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}

              <Controller
                name="pincode"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full p-2 border border-[#1E8D44] rounded focus:ring-[#1E8D44] focus:border-[#1E8D44]"
                  >
                    <option value="">Select Pincode</option>
                    {pincodes.map((pincode) => (
                      <option key={pincode} value={pincode}>
                        {pincode}
                      </option>
                    ))}
                  </select>
                )}
              />
              {errors.pincode && <p className="text-red-500 text-sm">{errors.pincode.message}</p>}

              <Controller
                name="community"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full p-2 border border-[#1E8D44] rounded focus:ring-[#1E8D44] focus:border-[#1E8D44]"
                  >
                    <option value="">Select Community</option>
                    {communities.map((community) => (
                      <option key={community} value={community}>
                        {community}
                      </option>
                    ))}
                  </select>
                )}
              />
              {errors.community && <p className="text-red-500 text-sm">{errors.community.message}</p>}
            </div>
          </div>
        );
      case 4:
        return (
          <div className='p-6'>
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Account Type</h2>
              <p className="text-[#1E8D44]">Choose your account type and verification preference</p>
            </div>
            <div className="space-y-4">
              <Controller
                name="accountType"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full p-2 border border-[#1E8D44] rounded focus:ring-[#1E8D44] focus:border-[#1E8D44]"
                  >
                    <option value="">Select Account Type</option>
                    <option value="personal">Personal</option>
                    <option value="business">Business</option>
                  </select>
                )}
              />
              {errors.accountType && <p className="text-red-500 text-sm">{errors.accountType.message}</p>}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="verifyYourself"
                  {...register("verifyYourself")}
                  className="rounded border-[#1E8D44] text-[#1E8D44] focus:ring-[#1E8D44]"
                  onChange={(e) => {
                    setValue("verifyYourself", e.target.checked);
                    if (!e.target.checked) {
                      setValue("verificationMethod", undefined);
                    }
                  }}
                />
                <label htmlFor="verifyYourself" className="text-sm text-[#1E8D44]">
                  Verify Yourself
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="terms"
                  {...register("terms")}
                  className="rounded border-[#1E8D44] text-[#1E8D44] focus:ring-[#1E8D44]"
                />
                <label htmlFor="terms" className="text-sm text-[#1E8D44]">
                  By signing up, you agree to our Terms of Use and Privacy Policy.
                </label>
              </div>
              {errors.terms && <p className="text-red-500 text-sm">{errors.terms.message}</p>}
            </div>
          </div>
        );
      case 5:
        return (
          <div className='p-6'>
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Verification Method</h2>
              <p className="text-[#1E8D44]">Choose your preferred verification method</p>
            </div>
            <div className="space-y-4">
              <Controller
                name="verificationMethod"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setVerificationMethod(e.target.value);
                    }}
                    className="w-full p-2 border border-[#1E8D44] rounded focus:ring-[#1E8D44] focus:border-[#1E8D44]"
                  >
                    <option value="">Select Verification Method</option>
                    <option value="governmentId">Upload Government Address ID</option>
                    <option value="postcard">Send a Postcard</option>
                  </select>
                )}
              />
              {verificationMethod === 'governmentId' && (
                <div className="bg-gradient-to-r from-[#1E8D44]/10 to-[#F9ED25]/10 p-6 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Government ID
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-[#1E8D44] hover:text-[#1E8D44] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#1E8D44]"
                        >
                          <span>Upload a file</span>
                          <input id="file-upload" type="file" className="sr-only" {...register("governmentId")} />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, PDF up to 10MB
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {verificationMethod === 'postcard' && (
                <div className="space-y-4">
                  <input {...register("address.street")}
                    placeholder="Provide your Address here .."
                    className="w-full p-2 border border-[#1E8D44] rounded focus:ring-[#1E8D44] focus:border-[#1E8D44]"
                  />
                </div>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#1E8D44]/10 to-[#F9ED25]/10 p-4">
      <div className="w-full max-w-2xl">
        <div className="w-full max-w-2xl bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="text-center text-black py-6">
            <h2 className="text-3xl font-bold">Create your Free Account</h2>
          </div>
          {renderStepIndicator()}
          <form onSubmit={handleSubmit(onSubmit)}>
            {renderStep()}
            <div className="flex flex-col space-y-4 p-6">
              <div className="flex space-x-4 w-full">
                {(step < 4 || (step === 4 && verifyYourself)) ? (
                  <button
                    onClick={nextStep}
                    className="flex-1 bg-[#1E8D44] ml-5 text-white w-full hover:bg-[#1E8D44]/90 py-2 px-4 rounded"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    className={`flex-1 bg-[#1E8D44] ml-5 text-white hover:bg-[#1E8D44]/90 py-2 px-4 rounded ${!isValid && 'opacity-50 cursor-not-allowed'}`}
                    disabled={!isValid}
                  >
                    Create an account
                  </button>
                )}
              </div>
              <button
                type="button"
                className="w-full flex items-center justify-center space-x-2 border border-[#1E8D44] text-[#1E8D44] hover:bg-[#1E8D44]/10 py-2 px-4 rounded"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                  <path fill="none" d="M1 1h22v22H1z" />
                </svg>
                <span>Sign up with Google</span>
              </button>
              <div className="text-center mt-4">
                <span className="text-sm text-[#1E8D44]">
                  Already have an account? <a href="#" className="text-[#C7872A] hover:underline">Sign in here</a>
                </span>
              </div>
            </div>
          </form>
        </div>
      </div>

      {showOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-[#C7872A] text-xl font-bold">Enter OTP</h3>
            <div className="mt-4">
              <input
                type="text"
                placeholder="Enter OTP"
                className="w-full border border-[#1E8D44] rounded p-2 focus:ring-2 focus:ring-[#1E8D44] focus:border-transparent"
                {...register("otp", {
                  required: "OTP is required",
                  pattern: {
                    value: /^[0-9]{6}$/,
                    message: "OTP must be 6 digits"
                  }
                })}
              />
              {errors.otp && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.otp.message}
                </p>
              )}
            </div>
            <div className="mt-6">
              <button
                onClick={verifyOtp}
                className="w-full bg-[#F9ED25] text-[#C7872A] hover:bg-[#F9ED25]/90 transition-colors duration-300 py-2 px-4 rounded"
              >
                Verify OTP
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Signup;
