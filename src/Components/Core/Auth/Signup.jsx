import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import logo from '../../../assests/nityam_mlogo.png'; // Import the logo image
import {sendotp,signUp} from "../../../services/operations/authApi";
import { useSelector,useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
// Zod schema for validation
const schema = z.object({
  firstName: z.string().nonempty({ message: 'First Name is required' }),
  lastName: z.string().nonempty({ message: 'Last Name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  confirmPassword: z.string().min(6, 'Password confirmation is required'),
  gender: z.string().nonempty({ message: 'Please select your gender' }),
  state: z.string().nonempty({ message: 'State is required' }),
  city: z.string().nonempty({ message: 'City is required' }),
  pincode: z.string().min(6, 'Pincode must be 6 digits'),
  profession: z.string().optional(),
  hourlyCharge: z.string().optional(),
});

function Signup() {
  const navigate=useNavigate();
  const dispatch=useDispatch();
  const [step, setStep] = useState(1);
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  const firstName = watch("firstName");
  const lastName = watch("lastName");
  const phoneNumber = watch("phone");
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");
  const otp = watch("otp");
  const email = watch("email");
  
  const nextStep = () => {
    setStep(step + 1);
    if (step === 1) {
      dispatch(sendotp(phoneNumber));
    }
    if (step === 2) {
      dispatch(signUp(firstName, lastName, email, password, confirmPassword, phoneNumber, otp, navigate));
    }
  };
  

  const prevStep = () => {
    setStep(step - 1);
  };

  const skipStep = () => {
    setStep(step + 1); // Skips the profession step
  };

  const renderProgressBar = () => (
    <div className="flex justify-between mb-4">
      {[1, 2, 3, 4, 5].map((number) => (
        <div key={number} className={`w-1/5 h-2 rounded-full ${step >= number ? 'bg-green-600' : 'bg-gray-200'}`} />
      ))}
    </div>
  );

  const renderStepNavigation = () => (
    <div className="flex justify-between mt-4">
      {step > 1 && (
        <button
          type="button"
          onClick={prevStep}
          className="px-4 py-2 rounded-full bg-yellow-400 text-white hover:bg-yellow-500"
        >
          Back
        </button>
      )}
      <button
        type="button"
        onClick={nextStep}
        className="px-4 py-2 rounded-full bg-green-600 text-white hover:bg-green-700"
      >
        {step === 5 ? 'Finish' : 'Next'}
      </button>
    </div>
  );

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            <input {...register('firstName')} className="w-full p-2 mb-4 border rounded-lg" placeholder="First Name" />
            {errors.firstName && <p className="text-red-600">{errors.firstName.message}</p>}

            <input {...register('lastName')} className="w-full p-2 mb-4 border rounded-lg" placeholder="Last Name" />
            {errors.lastName && <p className="text-red-600">{errors.lastName.message}</p>}

            <input {...register('email')} className="w-full p-2 mb-4 border rounded-lg" placeholder="Email" />
            {errors.email && <p className="text-red-600">{errors.email.message}</p>}

            <input {...register('phone')} className="w-full p-2 mb-4 border rounded-lg" placeholder="Phone Number" />
            {errors.phone && <p className="text-red-600">{errors.phone.message}</p>}

            <input {...register('password')} className="w-full p-2 mb-4 border rounded-lg" placeholder="Password" type="password" />
            {errors.password && <p className="text-red-600">{errors.password.message}</p>}

            <input {...register('confirmPassword')} className="w-full p-2 mb-4 border rounded-lg" placeholder="Confirm Password" type="password" />
            {errors.confirmPassword && <p className="text-red-600">{errors.confirmPassword.message}</p>}
          </div>
        );
      case 2:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Phone Verification</h2>
            <input {...register('otp')} className="w-full p-2 mb-4 border rounded-lg" placeholder="Enter OTP" />
            {errors.otp && <p className="text-red-600">{errors.otp.message}</p>}
          </div>
        );
      case 3:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Address</h2>
            <input {...register('state')} className="w-full p-2 mb-4 border rounded-lg" placeholder="State" />
            {errors.state && <p className="text-red-600">{errors.state.message}</p>}

            <input {...register('city')} className="w-full p-2 mb-4 border rounded-lg" placeholder="City" />
            {errors.city && <p className="text-red-600">{errors.city.message}</p>}

            <input {...register('pincode')} className="w-full p-2 mb-4 border rounded-lg" placeholder="Pincode" />
            {errors.pincode && <p className="text-red-600">{errors.pincode.message}</p>}
          </div>
        );
      case 4:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Profession & Services</h2>
            <input {...register('profession')} className="w-full p-2 mb-4 border rounded-lg" placeholder="Profession" />
            {errors.profession && <p className="text-red-600">{errors.profession.message}</p>}

            <input {...register('hourlyCharge')} className="w-full p-2 mb-4 border rounded-lg" placeholder="Hourly Charge (in ₹)" />
            {errors.hourlyCharge && <p className="text-red-600">{errors.hourlyCharge.message}</p>}

            <button
              type="button"
              onClick={skipStep}
              className="px-4 py-2 rounded-full bg-gray-500 text-white hover:bg-gray-600"
            >
              Skip
            </button>
          </div>
        );
      case 5:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Verification</h2>
            <label className="block mb-2">
              <input {...register('verificationMethod')} type="radio" value="postcard" className="mr-2" />
              Verify by Postcard
            </label>

            <label className="block mb-2">
              <input {...register('verificationMethod')} type="radio" value="aadhaar" className="mr-2" />
              Upload Aadhaar Card (PDF)
            </label>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        <div className="text-center mb-6">
          <img src={logo} alt="Logo" className="mx-auto mb-4 w-24 h-24 object-contain" />
          <h1 className="text-3xl font-bold text-green-600">Sign Up</h1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          {renderProgressBar()}
          {renderStep()}
          {renderStepNavigation()}
        </form>
      </div>
    </div>
  );
}

export default Signup;
