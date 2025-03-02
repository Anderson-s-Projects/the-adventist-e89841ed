import { useNavigate } from "react-router-dom";

interface PostHeaderProps {
  user: {
    id?: string;
    name: string;
    username: string;
    avatar: string;
  };
  timestamp: string;
}

export function PostHeader({ user, timestamp }: PostHeaderProps) {
  const navigate = useNavigate();

  const handleAvatarClick = () => {
    // Navigate to user profile if they have an ID
    if (user.id) {
      navigate(`/profile/${user.id}`);
    } else {
      // Otherwise navigate to the general profile page
      navigate('/profile');
    }
  };

  return (
    <div className="flex items-center mb-3 sm:mb-4">
      <img 
        src={user.avatar} 
        alt={user.name} 
        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover mr-2 sm:mr-3 cursor-pointer hover:opacity-80 transition-opacity" 
        onClick={handleAvatarClick} 
      />
      <div className="overflow-hidden">
        <h3 
          className="font-semibold cursor-pointer hover:underline text-sm sm:text-base truncate" 
          onClick={handleAvatarClick}
        >
          {user.name}
        </h3>
        <p className="text-muted-foreground text-xs sm:text-sm truncate">@{user.username} · {timestamp}</p>
      </div>
    </div>
  );
}
