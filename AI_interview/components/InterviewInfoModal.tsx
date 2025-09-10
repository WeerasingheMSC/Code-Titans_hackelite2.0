"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const InterviewInfoModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show modal when component mounts (page loads)
    setIsOpen(true);
  }, []);

  const closeModal = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closeModal}
      />
      
      {/* Modal Content */}
      <div className="relative max-w-5xl max-h-[90vh] overflow-y-auto mx-4 animate-scaleIn">
        <div className="card-border">
          <div className="card p-8 space-y-8">
            {/* Header */}
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-r from-primary-100 to-primary-200 rounded-2xl shadow-xl">
                  <svg width="32" height="28" viewBox="0 0 32 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 10L16 6L24 10L16 14L8 10Z" fill="#020408" fillOpacity="0.8"/>
                    <path d="M8 14L16 10L24 14L16 18L8 14Z" fill="#020408" fillOpacity="0.6"/>
                    <path d="M8 18L16 14L24 18L16 22L8 18Z" fill="#020408" fillOpacity="0.8"/>
                    <circle cx="16" cy="14" r="2" fill="#020408"/>
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-white">Welcome to SkillSync Studio</h1>
              </div>
              <p className="text-lg text-light-100 leading-relaxed max-w-3xl mx-auto">
                Get ready for your AI-powered interview session. Here's everything you need to know to make the most of your practice.
              </p>
            </div>

            {/* Content Grid with Synchronized Neon Border Animation */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* How It Works - Synchronized Neon Border */}
              <div className="neon-border-container">
                <div className="neon-border-line"></div>
                <div className="neon-content space-y-6">
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-white mb-2">How It Works</h3>
                    <p className="text-sm text-light-100">Get started in just a few simple steps</p>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { step: "1", title: "Start Session", desc: "Click the call button" },
                      { step: "2", title: "Specify Details", desc: "Tell AI your role and preferences" },
                      { step: "3", title: "Practice Interview", desc: "Engage with personalized questions" },
                      { step: "4", title: "Get Feedback", desc: "Receive detailed performance analysis" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-primary-100 to-primary-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-dark-100 font-bold text-sm">{item.step}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-white text-base mb-1">{item.title}</h4>
                          <p className="text-sm text-light-100 leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* What You'll Get - Synchronized Neon Border */}
              <div className="neon-border-container">
                <div className="neon-border-line"></div>
                <div className="neon-content space-y-6">
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-white mb-2">What You'll Get</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-success-100 to-success-200 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" fill="#020408"/>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white text-base mb-1">Custom Questions</h4>
                        <p className="text-sm text-light-100 leading-relaxed">AI generates questions based on your specific role and tech stack</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-primary-100 to-primary-200 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 5.5V9.5L21 9ZM3 7V9L9 9.5V5.5L3 7Z" fill="#020408"/>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white text-base mb-1">Real-time Voice</h4>
                        <p className="text-sm text-light-100 leading-relaxed">Natural conversation with our advanced AI interviewer</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-destructive-100 to-destructive-200 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9 11H7V9H9V11ZM13 11H11V9H13V11ZM17 11H15V9H17V11Z" fill="#020408"/>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white text-base mb-1">Instant Feedback</h4>
                        <p className="text-sm text-light-100 leading-relaxed">Detailed analysis and improvement suggestions</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pro Tips - Synchronized Neon Border */}
              <div className="neon-border-container">
                <div className="neon-border-line"></div>
                <div className="neon-content space-y-6">
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-white mb-2">💡 Pro Tips</h3>
                  </div>
                  
                  <div className="space-y-5">
                    <div>
                      <h4 className="font-semibold text-primary-100 text-base mb-3">Before You Start:</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2 text-sm text-light-100">
                          <span className="text-success-100 mt-1 text-base">•</span>
                          <span className="leading-relaxed">Find a quiet environment</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm text-light-100">
                          <span className="text-success-100 mt-1 text-base">•</span>
                          <span className="leading-relaxed">Test your microphone</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm text-light-100">
                          <span className="text-success-100 mt-1 text-base">•</span>
                          <span className="leading-relaxed">Have your resume ready</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-primary-100 text-base mb-3">During Interview:</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2 text-sm text-light-100">
                          <span className="text-success-100 mt-1 text-base">•</span>
                          <span className="leading-relaxed">Take time to think</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm text-light-100">
                          <span className="text-success-100 mt-1 text-base">•</span>
                          <span className="leading-relaxed">Use the STAR method</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm text-light-100">
                          <span className="text-success-100 mt-1 text-base">•</span>
                          <span className="leading-relaxed">Ask clarifying questions</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 pt-6 border-t border-dark-200/50">
              <Button 
                onClick={closeModal}
                className="btn-primary px-8 py-3 text-lg font-semibold"
              >
                Got It, Let's Start! 🚀
              </Button>
            </div>

            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-dark-200/50 hover:bg-dark-200 transition-colors text-light-100 hover:text-white"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewInfoModal;