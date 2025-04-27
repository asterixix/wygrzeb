import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Link,
  IconButton,
  Divider,
  Tooltip,
  Chip,
  Avatar,
  Stack
} from '@mui/material';
import { Tweet } from '@/types/news';
import ShareIcon from '@mui/icons-material/Share';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import VerifiedIcon from '@mui/icons-material/Verified';
import RepeatIcon from '@mui/icons-material/Repeat';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LaunchIcon from '@mui/icons-material/Launch';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { format } from 'date-fns';
import pl from 'date-fns/locale/pl';

interface TweetMetrics {
  replies?: number;
  retweets?: number;
  likes?: number;
  views?: number; // Assuming 'views' corresponds to 'impression_count'
}

interface TweetCardProps {
  tweet: Tweet;
  onBookmark?: (tweet: Tweet) => void;
  isBookmarked?: boolean;
}

const TweetCard: React.FC<TweetCardProps> = ({ 
  tweet, 
  onBookmark, 
  isBookmarked = false 
}) => {
  
  // Format date with error handling
  const formattedDate = tweet.date ? formatDate(tweet.date) : null;
  
  function formatDate(dateString: string) {
    try {
      return format(new Date(dateString), 'd MMMM yyyy • HH:mm', { locale: pl });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString; // Return the original string if can't format
    }
  }
  
  // Format numbers with K, M suffixes
  const formatNumber = (num: number | undefined): string => {
    if (num === undefined) return '0';
    
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num.toString();
  };
  
  // Safely access properties
  const metrics: TweetMetrics = tweet.metrics || {};
  const author = tweet.author || {
    name: 'Unknown User',
    username: 'unknown',
    profileImage: null,
    verified: false // Add default for verified if needed, or handle optional chaining below
  };
  
  // Check if this is a fallback tweet
  const isFallback = tweet.metadata?.fallbackNotice || tweet.metadata?.isFallback || false;
  
  return (
    <Card 
      elevation={1}
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          transform: 'translateY(-2px)'
        },
        borderLeft: '4px solid var(--tweet-color)'
      }}
      className="tweet-card"
    >
      <CardContent sx={{ flexGrow: 1, pt: 2, pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar 
              src={author.profileImage || undefined} 
              alt={author.name}
              sx={{ width: 48, height: 48, mr: 1.5 }}
            >
              {author.name.charAt(0)}
            </Avatar>
            
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography 
                  variant="subtitle1" 
                  component="span" 
                  fontWeight="medium"
                  sx={{ mr: 0.5 }}
                >
                  {author.name}
                </Typography>
                
                {author.verified && (
                  <Tooltip title="Verified Account">
                    <VerifiedIcon 
                      fontSize="small" 
                      sx={{ ml: 0.5, color: 'var(--tweet-color)' }} 
                    />
                  </Tooltip>
                )}
              </Box>
              
              <Typography variant="body2" color="text.secondary">
                @{author.username}
              </Typography>
            </Box>
          </Box>
          
          <Box>
            <IconButton 
              size="small" 
              onClick={() => onBookmark && onBookmark(tweet)}
              color={isBookmarked ? 'primary' : 'default'}
            >
              {isBookmarked ? <BookmarkIcon fontSize="small" /> : <BookmarkBorderIcon fontSize="small" />}
            </IconButton>
            
            <IconButton size="small">
              <ShareIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
        
        <Typography 
          variant="body1" 
          paragraph
          sx={{ 
            whiteSpace: 'pre-wrap', 
            mb: 2,
            wordBreak: 'break-word'
          }}
        >
          {tweet.content || 'No content available'}
        </Typography>
        
        {isFallback && (
          <Box sx={{ mb: 2 }}>
            <Chip
              size="small"
              label="FALLBACK DATA"
              sx={{ 
                bgcolor: 'var(--warning)',
                color: 'white',
                fontWeight: 'bold'
              }}
            />
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
              {typeof isFallback === 'string' 
                ? isFallback 
                : "This is fallback data as the Twitter API is currently unavailable."}
            </Typography>
          </Box>
        )}
        
        {tweet.media && (
          <Box 
            sx={{ 
              mt: 1, 
              mb: 2, 
              borderRadius: 2,
              overflow: 'hidden',
              height: 200,
              background: `url(${tweet.media}) no-repeat center center`,
              backgroundSize: 'cover'
            }}
          />
        )}
        
        {formattedDate && (
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1, mb: 2 }}>
            {formattedDate}
          </Typography>
        )}
      </CardContent>
      
      <Box sx={{ mt: 'auto', width: '100%' }}>
        <Divider />
        
        <Box sx={{ px: 2, py: 1 }}>
          <Stack direction="row" spacing={3} justifyContent="space-between" alignItems="center">
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Tooltip title="Replies">
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                  <ChatBubbleOutlineIcon sx={{ fontSize: '1rem', mr: 0.5, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">
                    {formatNumber(metrics.replies)}
                  </Typography>
                </Box>
              </Tooltip>
              
              <Tooltip title="Retweets">
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                  <RepeatIcon sx={{ fontSize: '1rem', mr: 0.5, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">
                    {formatNumber(metrics.retweets)}
                  </Typography>
                </Box>
              </Tooltip>
              
              <Tooltip title="Likes">
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                  <FavoriteBorderIcon sx={{ fontSize: '1rem', mr: 0.5, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">
                    {formatNumber(metrics.likes)}
                  </Typography>
                </Box>
              </Tooltip>
              
              {metrics.views !== undefined && (
                <Tooltip title="Views">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <VisibilityIcon sx={{ fontSize: '1rem', mr: 0.5, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      {formatNumber(metrics.views)}
                    </Typography>
                  </Box>
                </Tooltip>
              )}
            </Box>
            
            <Tooltip title="View on Twitter">
              <IconButton 
                component={Link}
                href={tweet.url || `https://twitter.com/${author.username}/status/${tweet.id}`}
                target="_blank"
                rel="noopener noreferrer"
                size="small"
              >
                <LaunchIcon sx={{ fontSize: '1rem' }} />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>
      </Box>
    </Card>
  );
};

export default TweetCard;