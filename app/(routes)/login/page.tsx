'use client'
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { loginTexts } from './texts';
import faceIdImage from '../../../public/pic/face-id.png';

export default function Login() {
  const router = useRouter();

  const handleScanFace = () => {
    // Navigate to face scan page
    router.push('/face-scan');
  };

  return (
    <div className="container min-h-screen flex flex-col justify-center items-center bg-white px-8">
      {/* Header text */}
      <div className="text-center mb-8">
        <p className="text-lg text-gray-700 leading-relaxed">
          {loginTexts.signUpPrompt}
        </p>
      </div>

      {/* Face ID Image */}
      <div className="relative mb-16">
        <div className="w-56 h-56 bg-linear-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center shadow-2xl border-4 border-white relative overflow-hidden">
          {/* Animated ring */}
          <div className="absolute inset-0 rounded-full border-4 border-blue-400 animate-pulse opacity-30"></div>
          <div className="absolute inset-2 rounded-full border-2 border-purple-300 animate-ping opacity-20"></div>

          <div className="w-44 h-44 bg-white rounded-full flex items-center justify-center shadow-inner relative z-10">
            <Image
              src={faceIdImage}
              alt="Face ID"
              width={140}
              height={140}
              className="object-contain filter drop-shadow-md"
            />
          </div>
        </div>

        {/* Glowing effect */}
        <div className="absolute inset-0 w-56 h-56 bg-linear-to-r from-blue-400 to-purple-400 rounded-full opacity-20 blur-xl -z-10"></div>
      </div>

      {/* Welcome section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{loginTexts.welcome}</h1>
        <p className="text-gray-600 text-sm">{loginTexts.journeyStart}</p>
      </div>

      {/* Scan button */}
      <button
        onClick={handleScanFace}
        className="btn btn-primary w-full"
      >
        {loginTexts.scanButton}
      </button>
    </div>
  );
}
