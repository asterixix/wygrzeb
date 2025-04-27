import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Link,
  Divider,
  Tooltip,
  Chip,
  Avatar,
  Stack
} from '@mui/material';
import { FactCheck } from '@/types/news';
import VerifiedIcon from '@mui/icons-material/Verified';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import LaunchIcon from '@mui/icons-material/Launch';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { format } from 'date-fns';
import pl from 'date-fns/locale/pl';

interface FactCheckCardProps {
  factCheck: FactCheck;
}

const FactCheckCard: React.FC<FactCheckCardProps> = ({ factCheck }) => {
  
  // Format date with error handling
  const formattedDate = factCheck.date ? formatDate(factCheck.date) : null;
  
  function formatDate(dateString: string) {
    try {
      return format(new Date(dateString), 'd MMMM yyyy', { locale: pl });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString; // Return the original string if can't format
    }
  }
  
  // Helper function to get rating color and icon
  const getRatingInfo = (rating: string | undefined) => {
    if (!rating) {
      return { 
        color: 'var(--muted)', 
        icon: <QuestionMarkIcon />, 
        label: 'Unrated'
      };
    }
    
    const ratingLower = rating.toLowerCase();
    
    if (ratingLower.includes('true') || 
        ratingLower.includes('mostly true') || 
        ratingLower.includes('correct') || 
        ratingLower.includes('accurate') ||
        ratingLower.includes('prawda')) {
      return { 
        color: 'var(--success)', 
        icon: <ThumbUpAltIcon />, 
        label: rating
      };
    } else if (ratingLower.includes('false') || 
               ratingLower.includes('fake') || 
               ratingLower.includes('incorrect') || 
               ratingLower.includes('misleading') ||
               ratingLower.includes('fałsz')) {
      return { 
        color: 'var(--error)', 
        icon: <ThumbDownAltIcon />, 
        label: rating
      };
    } else if (ratingLower.includes('partly') || 
               ratingLower.includes('half') || 
               ratingLower.includes('mixed') || 
               ratingLower.includes('unclear') ||
               ratingLower.includes('częściowo')) {
      return { 
        color: 'var(--warning)', 
        icon: <QuestionMarkIcon />, 
        label: rating
      };
    }
    
    return { 
      color: 'var(--muted)', 
      icon: <QuestionMarkIcon />, 
      label: rating
    };
  };
  
  const ratingInfo = getRatingInfo(factCheck.rating);
  
  // Safe access to source data
  const sourceName = factCheck.source?.name || 'Unknown Fact-Checker';
  const sourceUrl = factCheck.source?.url || factCheck.url || '#';
  
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
        borderLeft: '4px solid var(--factcheck-color)'
      }}
      className="factcheck-card"
    >
      <CardContent sx={{ flexGrow: 1, pt: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {factCheck.logo ? (
              <Avatar 
                src={factCheck.logo}
                alt={sourceName}
                sx={{ width: 40, height: 40, mr: 1.5 }}
                variant="rounded"
              />
            ) : (
              <Avatar
                sx={{ 
                  width: 40, 
                  height: 40, 
                  mr: 1.5, 
                  bgcolor: 'var(--factcheck-color)',
                  color: 'white'
                }}
                variant="rounded"
              >
                <VerifiedIcon />
              </Avatar>
            )}
            
            <Box>
              <Link 
                href={sourceUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                sx={{ 
                  textDecoration: 'none', 
                  color: 'inherit', 
                  '&:hover': { textDecoration: 'underline' } 
                }}
              >
                <Typography variant="subtitle1" component="span" fontWeight="medium">
                  {sourceName}
                </Typography>
              </Link>
              <Typography variant="caption" color="text.secondary" display="block">
                Fact-checker
              </Typography>
            </Box>
          </Box>
          
          <Box>
            <Tooltip title={ratingInfo.label}>
              <Chip
                icon={<Box sx={{ color: 'white', display: 'flex', alignItems: 'center' }}>{ratingInfo.icon}</Box>}
                label={ratingInfo.label}
                sx={{ 
                  bgcolor: ratingInfo.color,
                  color: 'white',
                  fontWeight: 'bold',
                  '& .MuiChip-icon': {
                    color: 'white'
                  }
                }}
              />
            </Tooltip>
          </Box>
        </Box>
        
        <Typography 
          variant="h6" 
          component="h2" 
          gutterBottom
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            lineHeight: 1.3,
          }}
        >
          {factCheck.claim || 'Unspecified Claim'}
        </Typography>
        
        {factCheck.claimant && (
          <Typography 
            variant="body2" 
            color="primary"
            fontWeight="medium"
            sx={{ mb: 1 }}
          >
            Claimed by: {factCheck.claimant}
          </Typography>
        )}
        
        {formattedDate && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CalendarTodayIcon fontSize="small" sx={{ mr: 0.5, color: 'var(--muted)' }} />
            <Typography variant="caption" color="text.secondary">
              {formattedDate}
            </Typography>
          </Box>
        )}
        
        {factCheck.summary && (
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{
              mb: 2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {factCheck.summary}
          </Typography>
        )}
        
        {Array.isArray(factCheck.topics) && factCheck.topics.length > 0 && (
          <Box sx={{ mt: 2, mb: 1 }}>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {factCheck.topics.map((topic, index) => (
                <Chip
                  key={index}
                  label={topic}
                  size="small"
                  sx={{ 
                    my: 0.5,
                    bgcolor: 'var(--card-border)',
                    fontSize: '0.7rem'
                  }}
                />
              ))}
            </Stack>
          </Box>
        )}
      </CardContent>
      
      <Box sx={{ mt: 'auto' }}>
        <Divider />
        
        <Box sx={{ p: 2 }}>
          <Tooltip title="Read full fact-check">
            <Link
              href={factCheck.url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ 
                display: 'flex',
                alignItems: 'center',
                color: 'var(--factcheck-color)',
                fontWeight: 'medium',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              Read full fact-check
              <LaunchIcon sx={{ ml: 0.5, fontSize: '1rem' }} />
            </Link>
          </Tooltip>
        </Box>
      </Box>
    </Card>
  );
};

export default FactCheckCard;