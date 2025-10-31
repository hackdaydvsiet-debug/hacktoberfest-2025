import { useState, useEffect } from "react";

const motivationalQuotes = [
  {
    text: "Success is the sum of small efforts repeated day in and day out.",
    author: "Robert Collier",
  },
  {
    text: "The expert in anything was once a beginner.",
    author: "Helen Hayes",
  },
  {
    text: "Study while others are sleeping; work while others are loafing; prepare while others are playing.",
    author: "William Arthur Ward",
  },
  {
    text: "Education is the most powerful weapon which you can use to change the world.",
    author: "Nelson Mandela",
  },
  {
    text: "The beautiful thing about learning is that no one can take it away from you.",
    author: "B.B. King",
  },
  {
    text: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson",
  },
  {
    text: "Your limitation—it's only your imagination.",
    author: "Unknown",
  },
  {
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain",
  },
  {
    text: "It's not about how bad you want it. It's about how hard you're willing to work for it.",
    author: "Unknown",
  },
  {
    text: "Study hard, for the well is deep, and our brains are shallow.",
    author: "Richard Baxter",
  },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
  },
  {
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
  },
  {
    text: "The future depends on what you do today.",
    author: "Mahatma Gandhi",
  },
  {
    text: "Learning is not attained by chance, it must be sought for with ardor and diligence.",
    author: "Abigail Adams",
  },
  {
    text: "You don't have to be great to start, but you have to start to be great.",
    author: "Zig Ziglar",
  },
  {
    text: "The best time to plant a tree was 20 years ago. The second best time is now.",
    author: "Chinese Proverb",
  },
  {
    text: "Success doesn't come from what you do occasionally, it comes from what you do consistently.",
    author: "Marie Forleo",
  },
  {
    text: "Don't let what you cannot do interfere with what you can do.",
    author: "John Wooden",
  },
  {
    text: "Start where you are. Use what you have. Do what you can.",
    author: "Arthur Ashe",
  },
  {
    text: "The only impossible journey is the one you never begin.",
    author: "Tony Robbins",
  },
  {
    text: "Intelligence plus character—that is the goal of true education.",
    author: "Martin Luther King Jr.",
  },
  {
    text: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.",
    author: "Brian Herbert",
  },
  {
    text: "Discipline is the bridge between goals and accomplishment.",
    author: "Jim Rohn",
  },
  {
    text: "Live as if you were to die tomorrow. Learn as if you were to live forever.",
    author: "Mahatma Gandhi",
  },
  {
    text: "An investment in knowledge pays the best interest.",
    author: "Benjamin Franklin",
  },
  {
    text: "The difference between ordinary and extraordinary is that little extra.",
    author: "Jimmy Johnson",
  },
  {
    text: "What we learn with pleasure we never forget.",
    author: "Alfred Mercier",
  },
  {
    text: "Push yourself, because no one else is going to do it for you.",
    author: "Unknown",
  },
  {
    text: "Great things never come from comfort zones.",
    author: "Unknown",
  },
  {
    text: "Dream it. Wish it. Do it.",
    author: "Unknown",
  },
];

export default function MotivationalQuote() {
  const [quote, setQuote] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Pick a random quote on component mount (every refresh)
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    setQuote(motivationalQuotes[randomIndex]);

    // Trigger animation
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  if (!quote) return null;

  return (
    <div
      className={`w-full max-w-4xl mx-auto px-4 mt-8 transition-all duration-1000 transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}>
      <div className="relative group">
        {/* Animated gradient border */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-xy"></div>

        {/* Content */}
        <div className="relative bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
          <div className="flex items-start gap-4">
            {/* Animated icon */}
            <div className="text-4xl flex-shrink-0 animate-bounce-slow">💡</div>

            <div className="flex-1">
              <p className="text-lg md:text-xl font-medium text-gray-800 italic mb-3 leading-relaxed">
                "{quote.text}"
              </p>
              <p className="text-sm text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 font-semibold text-right">
                — {quote.author}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
