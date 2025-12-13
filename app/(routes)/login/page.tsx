'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { loginTexts, mockUsers } from './texts';

export default function BookingLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Attempting login with:', { username, password });
    console.log('Available mock users:', mockUsers);

    // Check mock users
    const user = mockUsers.find(
      u => u.username === username && u.password === password
    );

    if (user) {
      // Store user data in localStorage (in a real app, use proper authentication)
      localStorage.setItem('user', JSON.stringify(user));
      
      // Show success message
      setError('');
      
      // Redirect based on user type
      if (user.type === 'caregiver') {
        router.push('/caregiver/home');
      } else {
        router.push('/face-scan'); 
      }
    } else {
      setError(loginTexts.invalidCredentials);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header Image */}
        {/* <div className="relative h-48 bg-linear-to-r from-blue-500 to-indigo-600">
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src={loginImage}
              alt="Login"
              width={120}
              height={120}
              className="rounded-full border-4 border-white shadow-lg"
            />
          </div>
        </div> */}

        {/* Login Form */}
        <div className="p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {loginTexts.title}
            </h1>
            {/* <p className="text-gray-600 text-sm">
              {loginTexts.subtitle}
            </p> */}
          </div>

          {/* Demo Credentials */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6 text-xs">
            <div className="font-semibold text-yellow-800 mb-2">Demo Accounts:</div>
            <div className="space-y-1 text-yellow-700">
              <div><strong>Regular User:</strong> peter123 / password123</div>
              <div><strong>Caregiver:</strong> caregiver1 / care123</div>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                {loginTexts.username}
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={loginTexts.usernamePlaceholder}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                {loginTexts.password}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={loginTexts.passwordPlaceholder}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-linear-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  กำลังเข้าสู่ระบบ...
                </div>
              ) : (
                loginTexts.loginButton
              )}
            </button>
          </form>

          {/* Additional Links */}
          <div className="mt-6 text-center space-y-2">
            <button className="text-blue-600 hover:text-blue-700 text-sm">
              {loginTexts.forgotPassword}
            </button>
            <div className="text-gray-600 text-sm">
              {loginTexts.noAccount}{' '}
              <button className="text-blue-600 hover:text-blue-700 font-medium">
                {loginTexts.signup}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}