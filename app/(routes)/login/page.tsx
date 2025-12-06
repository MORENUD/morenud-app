'use client'
import { useForm } from "react-hook-form";
import Image from 'next/image';
import loginImage from '../../../public/pic/login.webp';
import logoImage from '../../../public/pic/logo.webp';

interface LoginFormValues {
  user: string;
  password: string;
}

export default function Demo() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>();
  const onSubmit = (data: LoginFormValues): void => {
    console.log(data);
  };

  return (
    <div className="container min-h-screen flex flex-col justify-center items-center">
      {/* <Image src={logoImage} alt="Logo" className="w-32 h-auto mb-4" /> */}
      <h1>
        <strong className="text-3xl text-primary">Login</strong>
      </h1>
      {/* <p className="text-md">Your health journey starts here.</p> */}
      <div>
        <Image src={loginImage} alt="Login Illustration" className="w-full h-auto my-4" />
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* user */}
        <label className="input validator w-full">
          <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2.5"
              fill="none"
              stroke="currentColor"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </g>
          </svg>
          <input
            className="w-full"
            required
            placeholder="User"
            {...register("user", {
              required: "User is required"
            })}
          />
        </label>
        {errors.user && (
          <p className="text-red-500 text-sm ">{errors.user.message}</p>
        )}


        {/* password */}
        <label className="input validator w-full">
          <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2.5"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"
              ></path>
              <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
            </g>
          </svg>
          <input
            type="password"
            required
            placeholder="Password"
            {...register("password", {
              required: "Password is required"
            })}
          />
        </label>
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}

        <button className="btn btn-primary w-full">LOGIN</button>

      </form>
    </div>
  );
}
