import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-12 bg-gradient-to-br from-purple-50 via-white to-blue-50 border-t border-purple-100">
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-400/5 via-pink-400/5 to-blue-400/5 animate-gradient-xy"></div>

      <div className="relative max-w-7xl mx-auto py-4 px-8">
        <div className="flex items-center justify-center gap-2 text-gray-700 text-sm">
          <span>Made with</span>
          <span className="text-red-500 animate-bounce-slow">❤️</span>
          <span>by</span>
          <a
            className="font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
            href="https://shailavmalik.me"
            target="_blank"
            rel="noopener noreferrer">
            VibeMinds
          </a>
          <span className="text-gray-400">•</span>
          <span className="text-xs text-gray-500">© {currentYear}</span>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500"></div>
    </footer>
  );
};

export default Footer;
