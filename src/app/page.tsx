"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Container, 
  Grid, 
  Card, 
  CardContent,
  Paper,
  InputAdornment,
  IconButton,
  Link as MuiLink,
  Tooltip
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import VerifiedIcon from '@mui/icons-material/Verified';
import BarChartIcon from '@mui/icons-material/BarChart';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import InfoIcon from '@mui/icons-material/Info';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Link from "next/link";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsLoading(true);
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        background: 'var(--background)',
        color: 'var(--foreground)'
      }}
    >
      <Container maxWidth="lg" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            <span style={{ color: 'var(--primary)' }}>Wygrzeb</span>
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ mb: 4, maxWidth: '800px', mx: 'auto' }}>
            Inteligentne wyszukiwanie faktów, statystyk i aktualnych informacji z
            wiarygodnych źródeł krajowych i zagranicznych
          </Typography>

          <Paper 
            component="form" 
            onSubmit={handleSearch} 
            elevation={2} 
            sx={{ 
              p: 0.5, 
              display: 'flex', 
              maxWidth: '600px', 
              mx: 'auto', 
              mb: 6,
              bgcolor: 'var(--input-background)',
              border: '1px solid var(--input-border)',
              borderRadius: 'var(--radius-lg)',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                borderColor: 'var(--primary)'
              }
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Wyszukaj fakty, dane, statystyki i wiadomości..."
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton 
                      type="submit" 
                      aria-label="search"
                      disabled={isLoading || !searchQuery.trim()}
                      sx={{
                        color: 'var(--primary)',
                        '&:hover': {
                          backgroundColor: 'rgba(25, 118, 210, 0.08)'
                        }
                      }}
                    >
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: { 
                  px: 1,
                  color: 'var(--input-foreground)'
                }
              }}
              sx={{ 
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                '& .MuiInputBase-input': {
                  color: 'var(--input-foreground)'
                }
              }}
            />
          </Paper>

          <Grid container spacing={3} sx={{ mb: 6 }}>
            <Grid xs={12} sm={6} md={4}>
              <Card 
                elevation={2} 
                sx={{ 
                  height: '100%',
                  bgcolor: 'var(--card-bg)',
                  border: '1px solid var(--card-border)',
                  borderLeft: '4px solid var(--news-color)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <NewspaperIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
                  <Typography variant="h6" component="h3" gutterBottom>
                    Wiadomości
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Bieżące informacje z polskich i zagranicznych źródeł informacyjnych
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid xs={12} sm={6} md={4}>
              <Card 
                elevation={2} 
                sx={{ 
                  height: '100%',
                  bgcolor: 'var(--card-bg)',
                  border: '1px solid var(--card-border)',
                  borderLeft: '4px solid var(--factcheck-color)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <VerifiedIcon sx={{ fontSize: 40, mb: 2, color: 'var(--factcheck-color)' }} />
                  <Typography variant="h6" component="h3" gutterBottom>
                    Weryfikacja faktów
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Zweryfikowane informacje z niezależnych organizacji fact-checkingowych
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid xs={12} sm={6} md={4}>
              <Card 
                elevation={2} 
                sx={{ 
                  height: '100%',
                  bgcolor: 'var(--card-bg)',
                  border: '1px solid var(--card-border)',
                  borderLeft: '4px solid var(--dataset-color)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <BarChartIcon sx={{ fontSize: 40, mb: 2, color: 'var(--dataset-color)' }} />
                  <Typography variant="h6" component="h3" gutterBottom>
                    Dane i statystyki
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Oficjalne dane z Głównego Urzędu Statystycznego i dane.gov.pl
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={4} justifyContent="center">
            {/* Feature 1 */}
            <Grid xs={12} sm={6} md={4}>
              <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
                <SearchIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Wszechstronne Wyszukiwanie
                </Typography>
                <Typography>
                  Agreguj wyniki z wielu źródeł: wiadomości, fact-checków, danych rządowych i mediów społecznościowych.
                </Typography>
              </Paper>
            </Grid>

            {/* Feature 2 */}
            <Grid xs={12} sm={6} md={4}>
              <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
                <FactCheckIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Weryfikacja Informacji
                </Typography>
                <Typography>
                  Szybko sprawdzaj fakty i identyfikuj potencjalną dezinformację dzięki dostępowi do wiarygodnych źródeł.
                </Typography>
              </Paper>
            </Grid>

            {/* Feature 3 */}
            <Grid xs={12} sm={6} md={4}>
              <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
                <FilterAltIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Zaawansowane Filtrowanie
                </Typography>
                <Typography>
                  Precyzuj wyszukiwanie za pomocą filtrów daty, źródła, typu danych i trafności.
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              justifyContent: 'center',
              mb: 6
            }}
          >
            <Button 
              variant="contained" 
              component={Link} 
              href="/search"
              size="large"
              sx={{
                bgcolor: 'var(--primary)',
                '&:hover': {
                  bgcolor: 'var(--primary-hover)'
                }
              }}
            >
              Przejdź do zaawansowanego wyszukiwania
            </Button>
            <Button 
              variant="outlined" 
              component="a" 
              href="https://github.com/yourusername/wygrzeb" 
              target="_blank" 
              rel="noopener noreferrer"
              size="large"
              startIcon={<GitHubIcon />}
              sx={{
                borderColor: 'var(--primary)',
                color: 'var(--primary)',
                '&:hover': {
                  borderColor: 'var(--primary-hover)',
                  bgcolor: 'rgba(25, 118, 210, 0.08)'
                }
              }}
            >
              Zobacz kod źródłowy
            </Button>
          </Box>

          <Box sx={{ my: 6 }}>
            <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4 }}>
              Nasze Źródła Danych
            </Typography>
            <Grid container spacing={3} justifyContent="center">
              {/* Source 1 */}
              <Grid xs={12} sm={6} md={4}>
                <Paper elevation={2} sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                  <NewspaperIcon sx={{ mr: 1.5, color: 'primary.main' }} />
                  <Typography variant="body1">Wiadomości (Google News, NewsAPI)</Typography>
                </Paper>
              </Grid>
              {/* Source 2 */}
              <Grid xs={12} sm={6} md={4}>
                <Paper elevation={2} sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                  <FactCheckIcon sx={{ mr: 1.5, color: 'primary.main' }} />
                  <Typography variant="body1">Fact-Checking (Google Fact Check)</Typography>
                </Paper>
              </Grid>
              {/* Source 3 */}
              <Grid xs={12} sm={6} md={4}>
                <Paper elevation={2} sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                  <TwitterIcon sx={{ mr: 1.5, color: 'primary.main' }} />
                  <Typography variant="body1">Media Społecznościowe (Twitter/X)</Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>

          <Paper
            elevation={1}
            sx={{
              p: 3,
              mx: 'auto',
              maxWidth: '800px',
              bgcolor: 'var(--card-bg)',
              border: '1px solid var(--card-border)',
              borderRadius: 'var(--radius-md)'
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <InfoIcon sx={{ mr: 1, color: 'var(--info)' }} fontSize="small" />
              Dostępne źródła danych
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid xs={12} sm={6} md={4}>
                <Typography variant="body2" component="div">
                  <strong>Polskie:</strong>
                  <ul style={{ paddingLeft: '20px', marginTop: '4px' }}>
                    <li>GUS / Stat.gov.pl</li>
                    <li>Dane.gov.pl</li>
                    <li>Polskie media</li>
                  </ul>
                </Typography>
              </Grid>
              <Grid xs={12} sm={6} md={4}>
                <Typography variant="body2" component="div">
                  <strong>Zagraniczne:</strong>
                  <ul style={{ paddingLeft: '20px', marginTop: '4px' }}>
                    <li>Google News</li>
                    <li>Google Fact Check</li>
                    <li>Media międzynarodowe</li>
                  </ul>
                </Typography>
              </Grid>
              <Grid xs={12} sm={6} md={4}>
                <Typography variant="body2" component="div">
                  <strong>Media społecznościowe:</strong>
                  <ul style={{ paddingLeft: '20px', marginTop: '4px' }}>
                    <li>Twitter/X</li>
                    <Tooltip title="Wkrótce dostępne">
                      <li style={{ color: 'var(--muted)' }}>Facebook (wkrótce)</li>
                    </Tooltip>
                  </ul>
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Container>

      <Box 
        component="footer" 
        sx={{ 
          py: 3, 
          borderTop: 1, 
          borderColor: 'var(--border)', 
          bgcolor: 'var(--background)'
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: { xs: 2, md: 0 } }}>
              © 2025 Wygrzeb - Inteligentna wyszukiwarka informacji
            </Typography>
            <Box sx={{ display: 'flex', gap: 3 }}>
              <MuiLink href="/about" color="text.secondary" underline="hover" variant="body2">
                O projekcie
              </MuiLink>
              <MuiLink href="/privacy" color="text.secondary" underline="hover" variant="body2">
                Prywatność
              </MuiLink>
              <MuiLink href="/contact" color="text.secondary" underline="hover" variant="body2">
                Kontakt
              </MuiLink>
              <MuiLink href="https://twitter.com/wygrzeb" color="text.secondary" underline="hover" variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                <TwitterIcon fontSize="small" sx={{ mr: 0.5 }} />
                Twitter
              </MuiLink>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
