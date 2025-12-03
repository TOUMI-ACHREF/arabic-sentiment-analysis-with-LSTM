import React, { useState } from 'react';
import { Send, CheckCircle, XCircle, Loader } from 'lucide-react';

export default function ArabicSentimentAnalyzer() {
  const [feedback, setFeedback] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeFeedback = async () => {
    if (!feedback.trim()) return;
    
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: feedback }),
      });

      const data = await res.json();

      setResult({
        sentiment: data.label === 1 ? "positive" : "negative",
        confidence: data.probability
      });
    } catch (error) {
      console.error("Error calling prediction backend:", error);
      alert("حدث خطأ أثناء التحليل. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };


  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      analyzeFeedback();
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block p-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg mb-4">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3" style={{ fontFamily: 'Cairo, Tajawal, sans-serif' }}>
            محلل المشاعر العربي
          </h1>
          <p className="text-lg text-gray-600" style={{ fontFamily: 'Cairo, Tajawal, sans-serif' }}>
            اكتشف إذا كانت التعليقات إيجابية أو سلبية باستخدام الذكاء الاصطناعي
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 mb-8">
          <label className="block text-xl font-semibold text-gray-700 mb-4" style={{ fontFamily: 'Cairo, Tajawal, sans-serif' }}>
            أدخل التعليق للتحليل
          </label>
          
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="مثال: هذا المنتج رائع وأنا سعيد جداً بالشراء..."
            className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none resize-none text-lg"
            style={{ fontFamily: 'Cairo, Tajawal, sans-serif', minHeight: '150px' }}
            disabled={loading}
          />

          <button
            onClick={analyzeFeedback}
            disabled={!feedback.trim() || loading}
            className="w-full mt-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-3 text-lg"
            style={{ fontFamily: 'Cairo, Tajawal, sans-serif' }}
          >
            {loading ? (
              <>
                <Loader className="w-6 h-6 animate-spin" />
                جاري التحليل...
              </>
            ) : (
              <>
                <Send className="w-6 h-6" />
                تحليل التعليق
              </>
            )}
          </button>
        </div>

        {/* Result Card */}
        {result && (
          <div className={`bg-gradient-to-br ${result.sentiment === 'positive' ? 'from-emerald-50 to-green-50' : 'from-rose-50 to-red-50'} rounded-3xl shadow-2xl p-8 md:p-10 animate-fadeIn`}>
            <div className="flex items-center justify-center mb-6">
              {result.sentiment === 'positive' ? (
                <div className="p-4 bg-emerald-500 rounded-full">
                  <CheckCircle className="w-16 h-16 text-white" />
                </div>
              ) : (
                <div className="p-4 bg-rose-500 rounded-full">
                  <XCircle className="w-16 h-16 text-white" />
                </div>
              )}
            </div>

            <h2 className={`text-3xl md:text-4xl font-bold text-center mb-4 ${result.sentiment === 'positive' ? 'text-emerald-700' : 'text-rose-700'}`} style={{ fontFamily: 'Cairo, Tajawal, sans-serif' }}>
              {result.sentiment === 'positive' ? 'تعليق إيجابي 😊' : 'تعليق سلبي 😔'}
            </h2>

            <div className="bg-white rounded-2xl p-6 shadow-inner">
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-semibold text-gray-700" style={{ fontFamily: 'Cairo, Tajawal, sans-serif' }}>
                  إجابية التعليق
                </span>
                <span className={`text-2xl font-bold ${result.sentiment === 'positive' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {(result.confidence * 100).toFixed(0)}%
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${result.sentiment === 'positive' ? 'bg-gradient-to-r from-emerald-400 to-green-500' : 'bg-gradient-to-r from-rose-400 to-red-500'}`}
                  style={{ width: `${result.confidence * 100}%` }}
                />
              </div>
            </div>

            <p className="text-center text-gray-600 mt-6 text-lg" style={{ fontFamily: 'Cairo, Tajawal, sans-serif' }}>
              {result.sentiment === 'positive' 
                ? 'النموذج يشير إلى أن هذا التعليق يحمل مشاعر إيجابية'
                : 'النموذج يشير إلى أن هذا التعليق يحمل مشاعر سلبية'
              }
            </p>
          </div>
        )}

        {/* Info Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm" style={{ fontFamily: 'Cairo, Tajawal, sans-serif' }}>
            مدعوم بنموذج LSTM للتعلم العميق
          </p>
        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Tajawal:wght@400;500;700&display=swap');
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}