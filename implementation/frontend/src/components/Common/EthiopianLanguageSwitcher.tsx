// Ethiopian Language Switcher Component
// Provides language switching functionality with cultural context

import React from 'react';
import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  Box,
  Typography,
  Tooltip,
  IconButton
} from '@mui/material';
import { Language as LanguageIcon, Public as PublicIcon } from '@mui/icons-material';
import { ethiopianLanguageService, LanguageCode } from '../../services/ethiopianLanguageService';

interface EthiopianLanguageSwitcherProps {
  variant?: 'compact' | 'full';
  showFlag?: boolean;
  showTooltip?: boolean;
  onLanguageChange?: (language: LanguageCode) => void;
}

const EthiopianLanguageSwitcher: React.FC<EthiopianLanguageSwitcherProps> = ({
  variant = 'compact',
  showFlag = true,
  showTooltip = true,
  onLanguageChange
}) => {
  const [currentLanguage, setCurrentLanguage] = React.useState<LanguageCode>(
    ethiopianLanguageService.getCurrentLanguage()
  );

  const languageOptions = ethiopianLanguageService.getLanguageOptions();

  const handleLanguageChange = (event: SelectChangeEvent<LanguageCode>) => {
    const newLanguage = event.target.value as LanguageCode;
    setCurrentLanguage(newLanguage);
    ethiopianLanguageService.setLanguage(newLanguage);
    onLanguageChange?.(newLanguage);
    
    // Reload page to apply language changes
    window.location.reload();
  };

  const getLanguageFlag = (code: LanguageCode): string => {
    switch (code) {
      case 'en':
        return '🇺🇸';
      case 'am':
        return '🇪🇹';
      default:
        return '🌐';
    }
  };

  if (variant === 'compact') {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 120 }}>
        {showTooltip ? (
          <Tooltip title={`Switch to ${currentLanguage === 'en' ? 'Amharic' : 'English'}`}>
            <IconButton
              onClick={() => handleLanguageChange({ target: { value: currentLanguage === 'en' ? 'am' : 'en' } } as SelectChangeEvent<LanguageCode>)}
              size="small"
              sx={{ mr: 1 }}
            >
              {showFlag ? (
                <span style={{ fontSize: '1.2em' }}>
                  {getLanguageFlag(currentLanguage === 'en' ? 'am' : 'en')}
                </span>
              ) : (
                <LanguageIcon />
              )}
            </IconButton>
          </Tooltip>
        ) : (
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <Select
              value={currentLanguage}
              onChange={handleLanguageChange}
              displayEmpty
              sx={{
                '& .MuiSelect-select': {
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }
              }}
            >
              {languageOptions.map((option) => (
                <MenuItem key={option.code} value={option.code}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {showFlag && (
                      <span style={{ fontSize: '1.1em' }}>
                        {getLanguageFlag(option.code)}
                      </span>
                    )}
                    <Typography variant="body2">
                      {option.code.toUpperCase()}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <PublicIcon color="action" />
        <Typography variant="body2" color="text.secondary">
          Language:
        </Typography>
      </Box>
      
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <Select
          value={currentLanguage}
          onChange={handleLanguageChange}
          displayEmpty
        >
          {languageOptions.map((option) => (
            <MenuItem key={option.code} value={option.code}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                {showFlag && (
                  <span style={{ fontSize: '1.2em' }}>
                    {getLanguageFlag(option.code)}
                  </span>
                )}
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {option.label}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {option.nativeLabel}
                  </Typography>
                </Box>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default EthiopianLanguageSwitcher;
