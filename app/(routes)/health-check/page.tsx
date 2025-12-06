'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '../../../components/PageHeader';
import { diabetesQuestions, typhoidQuestions } from './question-set';
import { healthCheckTexts } from './texts';

// Types
interface ScanResult {
  id?: string;
  status?: string;
  message?: string;
  data?: Record<string, unknown>;
  user_name?: string;
  disease?: string;
  appointment_day?: number;
}

interface UserScanData {
  scanResult?: ScanResult;
  capturedImage?: string;
  scanStatus: 'pending' | 'completed' | 'failed';
  uploadTimestamp: string;
  scanTimestamp: string;
  scanDate: string;
  user_name?: string;
}

interface Question {
  feature: string;
  question: string;
  options: {
    label: string;
    value: number;
  }[];
}

interface QuestionAnswer {
  feature: string;
  question: string;
  answer: string;
  value: number;
}

// Helper function to get user data
const getUserScanData = (): UserScanData | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const data = localStorage.getItem('userScanData');
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting user scan data:', error);
    return null;
  }
};

// Disease to questions mapping
const getQuestionsForDisease = (disease: string): Question[] => {
  const normalizedDisease = disease.toLowerCase();
  
  switch (normalizedDisease) {
    case 'diabetes':
      return diabetesQuestions;
    case 'typhoid':
      return typhoidQuestions;
    default:
      // Return diabetes questions as default
      return diabetesQuestions;
  }
};

export default function HealthCheckPage() {
  const router = useRouter();
  const [disease, setDisease] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<QuestionAnswer[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [healthScore, setHealthScore] = useState(0);

  useEffect(() => {
    const loadUserData = () => {
      const data = getUserScanData();
      
      if (!data || !data.scanResult) {
        // If no scan data found, redirect to face scan
        router.push('/face-scan');
        return;
      }

      // Extract disease and user name
      const detectedDisease = data.scanResult.disease || 'diabetes';
      const detectedUserName = data.scanResult.user_name || data.user_name || 'User';
      
      setDisease(detectedDisease);
      setUserName(detectedUserName);
      
      // Get questions for the detected disease
      const questionsForDisease = getQuestionsForDisease(detectedDisease);
      setQuestions(questionsForDisease);
      
      // Initialize answers array
      setAnswers(new Array(questionsForDisease.length).fill(null));
      
      setIsLoading(false);
    };

    loadUserData();
  }, [router]);

  const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
    const currentQuestion = questions[questionIndex];
    const selectedOption = currentQuestion.options[optionIndex];
    
    const newAnswer: QuestionAnswer = {
      feature: currentQuestion.feature,
      question: currentQuestion.question,
      answer: selectedOption.label,
      value: selectedOption.value
    };
    
    const newAnswers = [...answers];
    newAnswers[questionIndex] = newAnswer;
    setAnswers(newAnswers);
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // All questions completed, calculate score and show results
      calculateHealthScore();
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateHealthScore = () => {
    const totalScore = answers.reduce((sum, answer) => {
      return sum + (answer?.value || 0);
    }, 0);
    
    const maxPossibleScore = questions.length; // Each question max value is 1
    const percentage = (totalScore / maxPossibleScore) * 100;
    
    setHealthScore(percentage);
    setIsCompleted(true);
    
    // Save health check results to localStorage
    try {
      const healthCheckResults = {
        disease,
        userName,
        answers,
        healthScore: percentage,
        completedAt: new Date().toISOString(),
        totalQuestions: questions.length,
        positiveSymptoms: totalScore
      };
      
      localStorage.setItem('healthCheckResults', JSON.stringify(healthCheckResults));
    } catch (error) {
      console.error('Error saving health check results:', error);
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 70) return 'text-red-500';
    if (score >= 40) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getHealthScoreMessage = (score: number) => {
    if (score >= 70) return healthCheckTexts.healthMessages.high;
    if (score >= 40) return healthCheckTexts.healthMessages.medium;
    return healthCheckTexts.healthMessages.low;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-purple-500"></div>
          <p className="mt-4 text-gray-600">{healthCheckTexts.loadingMessage}</p>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageHeader 
          title={healthCheckTexts.resultTitle}
          backButtonText={healthCheckTexts.backButton}
        />
        
        <div className="p-6">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                {healthCheckTexts.greeting}{userName}
              </h2>
              <p className="text-gray-600">
                {healthCheckTexts.resultFor} <span className="font-semibold text-purple-600">{disease}</span>
              </p>
            </div>
            
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-100 mb-4">
                <span className={`text-3xl font-bold ${getHealthScoreColor(healthScore)}`}>
                  {Math.round(healthScore)}%
                </span>
              </div>
              <p className={`font-semibold ${getHealthScoreColor(healthScore)} mb-2`}>
                {healthCheckTexts.riskScore} {Math.round(healthScore)}%
              </p>
              <p className="text-gray-700 text-sm">
                {getHealthScoreMessage(healthScore)}
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => router.push('/chatbot')}
              className="btn btn-primary w-full"
            >
              {healthCheckTexts.nextStepButton}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader 
        title={healthCheckTexts.pageTitle}
        backButtonText={healthCheckTexts.backButton}
      />
      
      <div className="p-6">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>{healthCheckTexts.questionCounter} {currentQuestionIndex + 1} {healthCheckTexts.of} {questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* User Info */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-gray-800">{healthCheckTexts.greeting}{userName}</p>
              <p className="text-sm text-gray-600">
                {healthCheckTexts.assessmentFor} <span className="text-purple-600 font-medium">{disease}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">
            {currentQuestion.question}
          </h2>
          
          <div className="space-y-3">
            {currentQuestion.options.map((option, optionIndex) => (
              <button
                key={optionIndex}
                onClick={() => handleAnswerSelect(currentQuestionIndex, optionIndex)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                  currentAnswer?.answer === option.label
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:border-purple-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{option.label}</span>
                  {currentAnswer?.answer === option.label && (
                    <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex space-x-3">
          <button
            onClick={goToPreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="btn btn-outline flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {healthCheckTexts.previousButton}
          </button>
          
          <button
            onClick={goToNextQuestion}
            disabled={!currentAnswer}
            className="btn btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentQuestionIndex === questions.length - 1 ? healthCheckTexts.viewResultButton : healthCheckTexts.nextButton}
          </button>
        </div>
      </div>
    </div>
  );
}
