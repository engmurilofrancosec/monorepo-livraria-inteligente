import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface StarRatingProps {
  rating: number;
  onChange: (rating: number) => void;
  maxRating?: number;
}

export default function StarRating({ rating, onChange, maxRating = 5 }: StarRatingProps) {
  return (
    <div className="flex items-center gap-1.5">
      {[...Array(maxRating)].map((_, index) => {
        const starValue = index + 1;
        const isActive = starValue <= rating;
        
        return (
          <motion.button
            key={index}
            type="button"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onChange(starValue)}
            className="focus:outline-none"
          >
            <Star
              size={24}
              className={`transition-colors ${
                isActive 
                ? "fill-yellow-500 text-yellow-500 shadow-yellow-500/50" 
                : "text-zinc-700 hover:text-zinc-500"
              }`}
            />
          </motion.button>
        );
      })}
    </div>
  );
}
