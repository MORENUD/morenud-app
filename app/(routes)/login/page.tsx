'use client'
import { useRouter } from 'next/navigation';
import { loginTexts } from './texts';

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

      {/* Circle placeholder */}
      <div className="w-48 h-48 bg-gray-300 rounded-full mb-12 flex items-center justify-center">
        <div className="w-40 h-40 bg-gray-400 rounded-full opacity-50"></div>
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
