// components/StarRating.tsx

interface StarRatingProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
}

const StarRating: React.FC<StarRatingProps> = ({ rating, size = 'md' }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl'
  };

  return (
    <div className={`flex items-center ${sizeClasses[size]}`}>
      {[...Array(5)].map((_, i) => {
        if (i < fullStars) {
          return <span key={i} className="text-yellow-500">★</span>;
        } else if (i === fullStars && hasHalfStar) {
          return <span key={i} className="text-yellow-500">★</span>;
        } else {
          return <span key={i} className="text-gray-300">★</span>;
        }
      })}
    </div>
  );
};

export default StarRating;