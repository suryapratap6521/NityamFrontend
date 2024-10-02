import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { sendotp, signUp } from "../../../services/operations/authApi";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';

// Zod schema for validation
const schema = z.object({
  firstName: z.string().nonempty('First Name is required'),
  lastName: z.string().nonempty('Last Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  confirmPassword: z.string().min(6, 'Password confirmation is required'),
  gender: z.string().nonempty('Please select your gender'),
  state: z.string().nonempty('State is required'),
  city: z.string().nonempty('City is required'),
  pincode: z.string().min(6, 'Pincode must be 6 digits'),
  profession: z.string().optional(),
  hourlyCharge: z.string().optional(),
  verificationMethod: z.string().nonempty('Please select a verification method'),
  aadharFile: z.any().optional(),
  address: z.string().optional(),
});

function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data) => {
    console.log(data);
    // Here you would typically handle the form submission
  };

  const watchVerificationMethod = watch("verificationMethod");

  const nextStep = () => {
    if (step < 5) {
      setStep(step + 1);
      if (step === 1) {
        dispatch(sendotp(watch("phone")));
      }
    } else {
      handleSubmit(onSubmit)();
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const renderProgressBar = () => (
    <div className="flex justify-between mb-8">
      {[1, 2, 3, 4, 5].map((number) => (
        <div key={number} className="flex flex-col items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= number ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'}`}>
            {number}
          </div>
          {/* <div className={`text-xs mt-1 ${step >= number ? 'text-green-500' : 'text-gray-500'}`}>
            {['Personal', 'Phone Verification', 'Address', 'Professional', 'Verification'][number - 1]}
          </div> */}
        </div>
      ))}
    </div>
  );

  const renderInputField = (name, placeholder, type = "text") => (
    <div className="mb-4">
      <input
        {...register(name)}
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        placeholder={placeholder}
        type={type}
      />
      {errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name].message}</p>}
    </div>
  );

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Personal Information</h2>
            {renderInputField('firstName', 'First Name')}
            {renderInputField('lastName', 'Last Name')}
            {renderInputField('email', 'Email')}
            <div className="flex mb-4">
              <select
                className="w-20 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500"
                defaultValue="+91"
              >
                <option value="+91">+91</option>
              </select>
              <input
                {...register('phone')}
                className="flex-grow p-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Phone Number"
              />
            </div>
            {errors.phone && <p className="text-red-500 text-sm mt-1 mb-4">{errors.phone.message}</p>}
            {renderInputField('password', 'Password', 'password')}
            {renderInputField('confirmPassword', 'Confirm Password', 'password')}
          </div>
        );
      case 2:
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Phone Verification</h2>
            {renderInputField('otp', 'Enter OTP')}
          </div>
        );
      case 3:
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Address</h2>
            {renderInputField('state', 'State')}
            {renderInputField('city', 'City')}
            {renderInputField('pincode', 'Pincode')}
          </div>
        );
      case 4:
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Professional Information</h2>
            {renderInputField('profession', 'Profession')}
            {renderInputField('hourlyCharge', 'Hourly Charge (in ₹)')}
          </div>
        );
      case 5:
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Verification</h2>
            <div className="mb-4">
              <label className="block mb-2">
                <input
                  {...register('verificationMethod')}
                  type="radio"
                  value="aadhar"
                  className="mr-2"
                />
                Upload Aadhaar Card
              </label>
              <label className="block mb-2">
                <input
                  {...register('verificationMethod')}
                  type="radio"
                  value="postcard"
                  className="mr-2"
                />
                Verify by Postcard
              </label>
            </div>
            {watchVerificationMethod === 'aadhar' && (
              <div className="mb-4">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setValue('aadharFile', e.target.files[0])}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            )}
            {watchVerificationMethod === 'postcard' && (
              <div className="mb-4">
                <textarea
                  {...register('address')}
                  placeholder="Enter your full address"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows="4"
                ></textarea>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-green-600">Create your Free Account</h1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          {renderProgressBar()}
          {renderStep()}
          <div className="flex justify-between mt-6">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-4 py-2 rounded-full bg-gray-300 text-gray-700 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Back
              </button>
            )}
            <button
              type="button"
              onClick={nextStep}
              className="px-4 py-2 rounded-full bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {step === 5 ? 'Finish' : 'Next'}
            </button>
          </div>
        </form>
        <div className="mt-6">
          <button
            className="w-full p-2 border border-gray-300 rounded-md flex items-center justify-center text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
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
            Sign up with Google
          </button>
        </div>
        <div className="text-center mt-4 text-sm text-gray-600">
          Already have an account? <a href="#" className="text-green-600 hover:underline">Sign in here</a>
        </div>
      </div>
    </div>
  );
}

export default Signup;