import React, { useEffect } from 'react';
import { useAIChat } from './AIChatViewModel.js';
import { 
  FiMic, 
  FiExternalLink, 
  FiArrowRight,
  FiRefreshCw,
  FiAlertCircle,
  FiZap,
  FiHelpCircle,
  FiStar,
  FiVolume2,
  FiHeadphones
} from 'react-icons/fi';

const AIChatView = () => {
  const {
    isLoading,
    isAvailable,
    error,
    checkAvailability,
    openChatInNewTab,
    redirectToChat,
    clearError,
    getChatUrl
  } = useAIChat();

  // Check availability when component mounts
  useEffect(() => {
    checkAvailability();
  }, [checkAvailability]);

  const handleRedirectToChat = () => {
    clearError();
    redirectToChat();
  };

  const handleOpenInNewTab = () => {
    clearError();
    openChatInNewTab();
  };

  const handleRefresh = () => {
    clearError();
    checkAvailability();
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#5A340D' }}>
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="rounded-2xl shadow-lg p-6 mb-6" style={{ backgroundColor: '#F8F1DE' }}>
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full" style={{ backgroundColor: '#CD945F' }}>
                <FiMic className="text-white text-4xl" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#000000' }}>
              التسميع الصوتي الذكي
            </h1>
            <p className="text-lg mb-4" style={{ color: '#333333' }}>
              تسميع صوتي تفاعلي مع الذكاء الاصطناعي لمساعدتك في حفظ ومراجعة القرآن الكريم
            </p>
            <div className="flex items-center justify-center gap-4 text-sm" style={{ color: '#666666' }}>
              <div className="flex items-center gap-2">
                <FiMic style={{ color: '#CD945F' }} />
                <span>تفاعل صوتي فقط</span>
              </div>
              <div className="flex items-center gap-2">
                <FiZap style={{ color: '#CD945F' }} />
                <span>ذكاء اصطناعي متقدم</span>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="rounded-lg p-4 mb-6" style={{ backgroundColor: '#ffebee', border: '1px solid #f44336' }}>
            <div className="flex items-center gap-3">
              <FiAlertCircle style={{ color: '#f44336' }} />
              <p style={{ color: '#d32f2f' }}>{error}</p>
              <button
                onClick={clearError}
                className="mr-auto text-sm underline"
                style={{ color: '#d32f2f' }}
              >
                إخفاء
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          
          {/* Features Section */}
          <div className="rounded-2xl shadow-lg p-6" style={{ backgroundColor: '#F8F1DE' }}>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3" style={{ color: '#000000' }}>
              <FiStar style={{ color: '#CD945F' }} />
              مميزات التسميع الصوتي
            </h2>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" 
                     style={{ backgroundColor: 'rgba(205, 148, 95, 0.2)' }}>
                  <FiMic style={{ color: '#CD945F' }} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1" style={{ color: '#000000' }}>تفاعل صوتي فقط</h3>
                  <p className="text-sm" style={{ color: '#333333' }}>
                    استخدم صوتك للتفاعل مع الذكاء الاصطناعي - لا حاجة للكتابة
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" 
                     style={{ backgroundColor: 'rgba(76, 175, 80, 0.2)' }}>
                  <FiVolume2 style={{ color: '#4CAF50' }} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1" style={{ color: '#000000' }}>تسميع صوتي ذكي</h3>
                  <p className="text-sm" style={{ color: '#333333' }}>
                    اقرأ الآيات بصوتك واحصل على تقييم وتصحيح فوري
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" 
                     style={{ backgroundColor: 'rgba(33, 150, 243, 0.2)' }}>
                  <FiHeadphones style={{ color: '#2196F3' }} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1" style={{ color: '#000000' }}>تجربة سمعية متكاملة</h3>
                  <p className="text-sm" style={{ color: '#333333' }}>
                    استمع للتلاوة الصحيحة وقارن مع قراءتك
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" 
                     style={{ backgroundColor: 'rgba(255, 152, 0, 0.2)' }}>
                  <FiStar style={{ color: '#FF9800' }} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1" style={{ color: '#000000' }}>تحليل صوتي متقدم</h3>
                  <p className="text-sm" style={{ color: '#333333' }}>
                    تقنية متقدمة لتحليل التلاوة وتقديم التوجيهات
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className="rounded-2xl shadow-lg p-6" style={{ backgroundColor: '#F8F1DE' }}>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3" style={{ color: '#000000' }}>
              <FiMic style={{ color: '#CD945F' }} />
              بدء التسميع الصوتي
            </h2>

            <div className="space-y-4">
              {/* Service Status */}
              <div className="p-4 rounded-lg" 
                   style={{ backgroundColor: isAvailable ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-3 h-3 rounded-full ${isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="font-medium" style={{ color: '#000000' }}>
                    حالة الخدمة: {isAvailable ? 'متاحة' : 'غير متاحة'}
                  </span>
                </div>
                <p className="text-sm" style={{ color: '#666666' }}>
                  {isAvailable 
                    ? 'خدمة التسميع الصوتي متاحة - تأكد من وجود ميكروفون'
                    : 'الخدمة غير متاحة حالياً، يرجى المحاولة لاحقاً'
                  }
                </p>
              </div>

              {/* Chat URL Display */}
              {/* Microphone Requirements Notice */}
              <div className="p-4 rounded-lg border-2" style={{ borderColor: '#CD945F', backgroundColor: 'rgba(205, 148, 95, 0.05)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <FiMic style={{ color: '#CD945F' }} />
                  <span className="font-semibold text-sm" style={{ color: '#000000' }}>متطلبات مهمة:</span>
                </div>
                <ul className="text-sm space-y-1" style={{ color: '#333333' }}>
                  <li>• تأكد من وجود ميكروفون يعمل</li>
                  <li>• اسمح للمتصفح بالوصول للميكروفون</li>
                  <li>• التطبيق يتفاعل بالصوت فقط (لا نص)</li>
                  <li>• استخدم مكان هادئ للحصول على أفضل النتائج</li>
                </ul>
              </div>

              <div className="p-3 rounded-lg border" style={{ borderColor: '#CD945F', backgroundColor: 'rgba(205, 148, 95, 0.05)' }}>
                <p className="text-xs mb-1" style={{ color: '#666666' }}>رابط التسميع الصوتي:</p>
                <p className="text-sm font-mono break-all" style={{ color: '#333333' }}>
                  {getChatUrl()}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleRedirectToChat}
                  disabled={isLoading || !isAvailable}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 text-white rounded-lg font-semibold text-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#CD945F' }}
                  onMouseEnter={(e) => !isLoading && isAvailable && (e.target.style.backgroundColor = '#b3784d')}
                  onMouseLeave={(e) => !isLoading && isAvailable && (e.target.style.backgroundColor = '#CD945F')}
                >
                  {isLoading ? (
                    <>
                      <FiRefreshCw className="animate-spin text-xl" />
                      <span>جاري التوجيه...</span>
                    </>
                  ) : (
                    <>
                      <FiMic className="text-xl" />
                      <span>بدء التسميع الصوتي</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleOpenInNewTab}
                  disabled={!isAvailable}
                  className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ 
                    backgroundColor: 'transparent', 
                    color: '#CD945F',
                    border: '2px solid #CD945F'
                  }}
                  onMouseEnter={(e) => isAvailable && (e.target.style.backgroundColor = 'rgba(205, 148, 95, 0.1)')}
                  onMouseLeave={(e) => isAvailable && (e.target.style.backgroundColor = 'transparent')}
                >
                  <FiExternalLink />
                  <span>فتح في نافذة جديدة</span>
                </button>

                <button
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200"
                  style={{ 
                    backgroundColor: 'rgba(205, 148, 95, 0.1)', 
                    color: '#CD945F'
                  }}
                  onMouseEnter={(e) => !isLoading && (e.target.style.backgroundColor = 'rgba(205, 148, 95, 0.2)')}
                  onMouseLeave={(e) => !isLoading && (e.target.style.backgroundColor = 'rgba(205, 148, 95, 0.1)')}
                >
                  <FiRefreshCw className={isLoading ? 'animate-spin' : ''} />
                  <span>تحديث حالة الخدمة</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions Section */}
        <div className="rounded-2xl shadow-lg p-6" style={{ backgroundColor: '#F8F1DE' }}>
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#000000' }}>
            كيفية استخدام التسميع الصوتي
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" 
                   style={{ backgroundColor: '#CD945F' }}>
                <span className="text-white font-bold text-lg">1</span>
              </div>
              <h3 className="font-semibold mb-2" style={{ color: '#000000' }}>
                افتح التطبيق
              </h3>
              <p className="text-sm" style={{ color: '#666666' }}>
                انقر على "بدء التسميع الصوتي" لفتح التطبيق
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" 
                   style={{ backgroundColor: '#CD945F' }}>
                <span className="text-white font-bold text-lg">2</span>
              </div>
              <h3 className="font-semibold mb-2" style={{ color: '#000000' }}>
                اسمح بالميكروفون
              </h3>
              <p className="text-sm" style={{ color: '#666666' }}>
                امنح التطبيق إذن الوصول للميكروفون
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" 
                   style={{ backgroundColor: '#CD945F' }}>
                <span className="text-white font-bold text-lg">3</span>
              </div>
              <h3 className="font-semibold mb-2" style={{ color: '#000000' }}>
                ابدأ القراءة
              </h3>
              <p className="text-sm" style={{ color: '#666666' }}>
                اقرأ الآيات بصوتك بوضوح
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" 
                   style={{ backgroundColor: '#CD945F' }}>
                <span className="text-white font-bold text-lg">4</span>
              </div>
              <h3 className="font-semibold mb-2" style={{ color: '#000000' }}>
                احصل على التقييم
              </h3>
              <p className="text-sm" style={{ color: '#666666' }}>
                استمع للتصحيحات والتوجيهات الصوتية
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatView;