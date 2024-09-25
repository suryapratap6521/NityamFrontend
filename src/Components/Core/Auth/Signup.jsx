import React, { useState } from 'react';
import { z } from 'zod';
import { useForm ,watch} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import logo from '../../../assests/nityam_mlogo.png'; // Your logo file

// Zod schema for validation
const schema = z.object({
  fullName: z.string().min(1, { message: 'Full name is required' }),
  email: z.string().email({ message: 'Invalid email' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
  confirmPassword: z.string().min(6, { message: 'Confirm your password' }),
  phoneNumber: z.string().regex(/^[0-9]{10}$/, { message: 'Phone number must be 10 digits' }),
  otp: z.string().min(6, { message: 'OTP must be 6 digits' }).optional(),
  gender: z.enum(['male', 'female', 'other']),
  state: z.string().min(1, { message: 'Please select a state' }),
  city: z.string().min(1, { message: 'Please select a city' }),
  pincode: z.string().regex(/^[0-9]{6}$/, { message: 'Pincode must be 6 digits' }),
  verificationMethod: z.enum(['postcard', 'aadhaar']),
  aadhaarFile: z.any().optional(),
  profession: z.string().min(1, { message: 'Profession is required' }).optional(),
  hourlyRate: z.number().min(0, { message: 'Hourly rate must be a positive number' }).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords must match',
  path: ['confirmPassword'],
});

function Signup() {
  const [currentStep, setCurrentStep] = useState(1);
  const { register, handleSubmit,watch, formState: { errors }, setValue } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data) => {
    console.log(data); // Handle form submission
  };

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  // Render the progress bar
  const renderProgressBar = () => (
    <div className="flex justify-between mb-6">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className={`w-1/4 h-2 rounded-full ${currentStep >= step ? 'bg-green-500' : 'bg-gray-300'}`} />
      ))}
    </div>
  );

  // Render button for next/back
  const renderStepNavigation = () => (
    <div className="flex justify-between mt-6">
      {currentStep > 1 && (
        <button
          type="button"
          onClick={prevStep}
          className="bg-gray-500 hover:bg-gray-700 text-white py-2 px-6 rounded-full"
        >
          Back
        </button>
      )}
      {currentStep < 4 && (
        <button
          type="button"
          onClick={nextStep}
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-full ml-auto"
        >
          Next
        </button>
      )}
      {currentStep === 4 && (
        <button
          type="submit"
          className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-6 rounded-full ml-auto"
        >
          Submit
        </button>
      )}
    </div>
  );

  // Steps of the form
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-green-600">Personal Information</h2>
            <p className="mb-6 text-gray-600">Enter your details to get started</p>
            <div className="mb-4">
              <input
                {...register('fullName')}
                type="text"
                placeholder="Full Name"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              />
              {errors.fullName && <p className="text-red-600">{errors.fullName.message}</p>}
            </div>
            <div className="mb-4">
              <input
                {...register('email')}
                type="email"
                placeholder="Email"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              />
              {errors.email && <p className="text-red-600">{errors.email.message}</p>}
            </div>
            <div className="mb-4">
              <input
                {...register('password')}
                type="password"
                placeholder="Password"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              />
              {errors.password && <p className="text-red-600">{errors.password.message}</p>}
            </div>
            <div className="mb-4">
              <input
                {...register('confirmPassword')}
                type="password"
                placeholder="Confirm Password"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              />
              {errors.confirmPassword && <p className="text-red-600">{errors.confirmPassword.message}</p>}
            </div>
            <div className="mb-4">
              <input
                {...register('phoneNumber')}
                type="text"
                placeholder="Phone Number"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              />
              {errors.phoneNumber && <p className="text-red-600">{errors.phoneNumber.message}</p>}
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-green-600">Phone Verification</h2>
            <div className="mb-4">
              <input
                {...register('otp')}
                type="text"
                placeholder="Enter OTP"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              />
              {errors.otp && <p className="text-red-600">{errors.otp.message}</p>}
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-green-600">Address Information</h2>
            <div className="mb-4">
              <input
                {...register('state')}
                type="text"
                placeholder="State"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              />
              {errors.state && <p className="text-red-600">{errors.state.message}</p>}
            </div>
            <div className="mb-4">
              <input
                {...register('city')}
                type="text"
                placeholder="City"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              />
              {errors.city && <p className="text-red-600">{errors.city.message}</p>}
            </div>
            <div className="mb-4">
              <input
                {...register('pincode')}
                type="text"
                placeholder="Pincode"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              />
              {errors.pincode && <p className="text-red-600">{errors.pincode.message}</p>}
            </div>
          </div>
        );
      case 4:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-green-600">Verification</h2>
            <div className="mb-4">
              <label className="block mb-2 text-gray-600">Verification Method</label>
              <div className="flex items-center space-x-4">
                <label>
                  <input
                    {...register('verificationMethod')}
                    type="radio"
                    value="postcard"
                    className="mr-2"
                  />
                  Postcard
                </label>
                <label>
                  <input
                    {...register('verificationMethod')}
                    type="radio"
                    value="aadhaar"
                    className="mr-2"
                  />
                  Aadhaar
                </label>
              </div>
              {errors.verificationMethod && <p className="text-red-600">{errors.verificationMethod.message}</p>}
            </div>
            {watch('verificationMethod') === 'aadhaar' && (
              <div className="mb-4">
                <label className="block mb-2 text-gray-600">Upload Aadhaar</label>
                <input
                  {...register('aadhaarFile')}
                  type="file"
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                />
                {errors.aadhaarFile && <p className="text-red-600">{errors.aadhaarFile.message}</p>}
              </div>
            )}
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
          <img src={logo} alt="Logo" className="mx-auto mb-2" />
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
