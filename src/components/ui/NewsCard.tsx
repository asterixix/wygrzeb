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
  CardMedia,
  Avatar,
  Stack
} from '@mui/material';
import { NewsArticle } from '@/types/news';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LaunchIcon from '@mui/icons-material/Launch';
import { format } from 'date-fns';
import pl from 'date-fns/locale/pl';

interface NewsCardProps {
  article: NewsArticle;
}

const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
  // Format date with error handling
  const formattedDate = article.publishedAt ? formatDate(article.publishedAt) : null;
  
  function formatDate(dateString: string) {
    try {
      return format(new Date(dateString), 'd MMMM yyyy', { locale: pl });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString; // Return the original string if can't format
    }
  }
  
  // Safe access to source data
  const sourceName = article.source?.name || 'Unknown Source';
  const sourceUrl = article.source?.url || article.url || '#';
  
  // Get the potential image URL using type assertion
  const imageUrl = (article as any).urlToImage;

  // Check if there's a valid image URL
  const hasValidImage = imageUrl &&
                       typeof imageUrl === 'string' && // Ensure it's a string
                       !imageUrl.includes('placeholder') &&
                       !imageUrl.includes('default');

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
          borderLeft: '4px solid var(--news-color)'
        }}
      >
        {hasValidImage && (
          <CardMedia
            component="img"
            height="160"
            image={imageUrl} // Use the variable here
            alt={article.title || 'News image'}
            sx={{
              objectFit: 'cover',
            }}
            onError={(e) => {
              // Handle image load error by hiding the image container
              const target = e.target as HTMLImageElement;
              if (target.parentElement) {
                target.parentElement.style.display = 'none'; // Hide the parent container
              }
            }}
          />
        )}
        
        <CardContent sx={{ flexGrow: 1, pt: 2 }}> {/* Adjust padding if no image */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {article.logo? (
            <Avatar 
              src={article.logo}
              alt={sourceName}
              sx={{ width: 32, height: 32, mr: 1.5 }}
              variant="rounded"
            />
          ) : (
            <Avatar
              sx={{ 
                width: 32, 
                height: 32, 
                mr: 1.5, 
                bgcolor: 'var(--news-color)',
                color: 'white'
              }}
              variant="rounded"
            >
              <NewspaperIcon fontSize="small" />
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
              <Typography variant="subtitle2" component="span" fontWeight="medium">
                {sourceName}
              </Typography>
            </Link>
            
            {formattedDate && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarTodayIcon sx={{ fontSize: '0.8rem', mr: 0.5, color: 'var(--muted)' }} />
                <Typography variant="caption" color="text.secondary">
                  {formattedDate}
                </Typography>
              </Box>
            )}
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
          {article.title || 'Untitled Article'}
        </Typography>
        
        {article.description && (
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
            {article.description}
          </Typography>
        )}
        
        {article.author && (
          <Typography 
            variant="body2" 
            color="text.secondary"
            fontStyle="italic"
            sx={{ mt: 1 }}
          >
            By {article.author}
          </Typography>
        )}
        
        {article.category && ( // Check if category exists
          <Box sx={{ mt: 2 }}>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {Array.isArray(article.category) && article.category.length > 0 ? ( // If it's a non-empty array
                article.category.map((category, index) => (
                  <Chip
                    key={index}
                    label={category}
                    size="small"
                    sx={{ 
                      my: 0.5,
                      bgcolor: 'var(--card-border)',
                      fontSize: '0.7rem'
                    }}
                  />
                ))
              ) : typeof article.category === 'string' && article.category.trim() ? ( // If it's a non-empty string
                <Chip
                  label={article.category}
                  size="small"
                  sx={{ 
                    my: 0.5,
                    bgcolor: 'var(--card-border)',
                    fontSize: '0.7rem'
                  }}
                />
              ) : null /* Render nothing otherwise */}
            </Stack>
          </Box>
        )}
      </CardContent>
      
      <Box sx={{ mt: 'auto' }}>
        <Divider />
        
        <Box sx={{ p: 2 }}>
          <Tooltip title="Read full article">
            <Link
              href={article.url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ 
                display: 'flex',
                alignItems: 'center',
                color: 'var(--news-color)',
                fontWeight: 'medium',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              Read full article
              <LaunchIcon sx={{ ml: 0.5, fontSize: '1rem' }} />
            </Link>
          </Tooltip>
        </Box>
      </Box>
    </Card>
  );
};

export default NewsCard;