import Agent from "@/components/Agent";
import Image from "next/image";
import InterviewInfoModal from "@/components/InterviewInfoModal";
import { getCurrentUser } from "@/lib/actions/auth.action";

const Page = async () => {
  const user = await getCurrentUser();

  return (
    <>
      {/* Info Modal - Shows on page load */}
      <InterviewInfoModal />

      {/* Main Interview Section - Clean and Focused */}
      <div className="space-y-8">
        {/* Minimal Header */}
        <section className="text-center space-y-4 animate-fadeIn">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-xl p-2">
              <Image 
                src="/logo.png" 
                alt="SkillSync Logo" 
                width={45} 
                height={45}
                className="object-contain rounded-full"
              />
            </div>
            <h1 className="text-3xl font-bold text-white">Interview Studio</h1>
          </div>
          
          <div className="max-w-xl mx-auto">
            <p className="text-lg text-light-100 leading-relaxed">
              Ready to practice? Start your AI-powered interview session below.
            </p>
          </div>
        </section>

        {/* Main Agent Section - Primary Focus */}
        <section className="space-y-6 animate-scaleIn" style={{ animationDelay: '0.1s' }}>
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-white">Ready to Begin?</h2>
            <p className="text-light-100">Start your AI-powered interview session now</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Agent
              userName={user?.name!}
              userId={user?.id}
              type="generate"
            />
          </div>
        </section>

        {/* Simple Help Link */}
        <section className="text-center animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-dark-200/30 rounded-full border border-primary-200/20">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span className="text-sm text-light-100">Make sure your microphone is enabled and you're in a quiet environment</span>
          </div>
        </section>
      </div>
    </>
  );
};

export default Page;