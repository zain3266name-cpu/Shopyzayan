import { ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';

export function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 420);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Scroll back to top"
      title="Back to top"
      className="fixed bottom-5 left-5 z-30 w-11 h-11 rounded-full bg-white dark:bg-[#1C192E] text-[#24213A] dark:text-[#F4F2FF] border border-[#713BDB]/20 dark:border-white/15 shadow-lg hover:border-[#713BDB] hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center focus-visible:outline-2 focus-visible:outline-[#713BDB]"
    >
      <ArrowUp className="w-4 h-4" />
    </button>
  );
}
