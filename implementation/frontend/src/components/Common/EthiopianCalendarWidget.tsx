// Ethiopian Calendar Widget Component
// Displays current date with Ethiopian cultural context (using Gregorian calendar)

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Tooltip,
  Grid,
  Divider,
  IconButton
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  Event as EventIcon,
  Schedule as ScheduleIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { 
  ethiopianCalendarService, 
  EthiopianDate,
  formatEthiopianDate,
  getCurrentEthiopianYear
} from '../../services/ethiopianCalendarService';
import { ethiopianLanguageService } from '../../services/ethiopianLanguageService';

interface EthiopianCalendarWidgetProps {
  showGregorianDate?: boolean;
  showHolidays?: boolean;
  showTime?: boolean;
  compact?: boolean;
  showFastingInfo?: boolean;
}

const EthiopianCalendarWidget: React.FC<EthiopianCalendarWidgetProps> = ({
  showGregorianDate = true,
  showHolidays = true,
  showTime = true,
  compact = false,
  showFastingInfo = true
}) => {
  const [currentDate, setCurrentDate] = React.useState<Date>(new Date());
  const [ethiopianDate, setEthiopianDate] = React.useState<EthiopianDate | null>(null);
  const [ethiopianTime, setEthiopianTime] = React.useState<string>('');

  React.useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentDate(now);
      setEthiopianDate(ethiopianCalendarService.convertToEthiopian(now));
      if (showTime) {
        setEthiopianTime(ethiopianCalendarService.getEthiopianTime(now));
      }
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [showTime]);

  const holidays = React.useMemo(() => {
    if (!showHolidays || !ethiopianDate) return [];
    return ethiopianCalendarService.getEthiopianHolidays(ethiopianDate.ethiopianYear);
  }, [showHolidays, ethiopianDate]);

  const fastingPeriods = React.useMemo(() => {
    if (!showFastingInfo || !ethiopianDate) return [];
    return ethiopianCalendarService.getFastingPeriods(ethiopianDate.ethiopianYear);
  }, [showFastingInfo, ethiopianDate]);

  const currentLanguage = ethiopianLanguageService.getCurrentLanguage();
  const isAmharic = currentLanguage === 'am';

  if (!ethiopianDate) {
    return (
      <Card>
        <CardContent>
          <Typography>Loading calendar...</Typography>
        </CardContent>
      </Card>
    );
  }

  const todayHolidays = holidays.filter(h => 
    ethiopianDate && h.date.month === ethiopianDate.ethiopianMonth && 
    h.date.day === ethiopianDate.ethiopianDay
  );

  const upcomingHolidays = holidays
    .filter(h => {
      const holidayDate = ethiopianCalendarService.convertSimpleDateToGregorian(h.date);
      const daysDiff = Math.ceil((holidayDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff > 0 && daysDiff <= 30;
    })
    .slice(0, 3);

  if (compact) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <CalendarIcon color="primary" />
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {formatEthiopianDate(currentDate, isAmharic)}
          </Typography>
          {showGregorianDate && (
            <Typography variant="caption" color="text.secondary">
              {currentDate.toLocaleDateString()}
            </Typography>
          )}
        </Box>
        {ethiopianDate.isHoliday && (
          <Chip 
            label={isAmharic ? "በዓል" : "Holiday"} 
            color="secondary" 
            size="small" 
          />
        )}
      </Box>
    );
  }

  return (
    <Card elevation={2}>
      <CardContent>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <CalendarIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {isAmharic ? 'የኢትዮጵያ ዘመን አቆጣጠር' : 'Ethiopian Calendar'}
          </Typography>
          <Tooltip title={isAmharic ? 'የቀን መረጃ' : 'Calendar Information'}>
            <IconButton size="small">
              <InfoIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Current Date */}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center', py: 2, bgcolor: 'primary.main', color: 'white', borderRadius: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {isAmharic ? ethiopianDate.dayNameAmharic : ethiopianDate.dayName}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {ethiopianDate.ethiopianDay}
              </Typography>
              <Typography variant="h6">
                {isAmharic ? ethiopianDate.monthNameAmharic : ethiopianDate.monthName}
              </Typography>
              <Typography variant="body1">
                {ethiopianDate.ethiopianYear}
              </Typography>
            </Box>
          </Grid>

          {/* Gregorian Date */}
          {showGregorianDate && (
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center', py: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {isAmharic ? 'የምዕራቡ ዓለም ዘመን አቆጣጠር' : 'Gregorian Calendar'}
                </Typography>
                <Typography variant="body1">
                  {currentDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Typography>
              </Box>
            </Grid>
          )}

          {/* Ethiopian Time */}
          {showTime && (
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
                <ScheduleIcon color="action" />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {isAmharic ? 'የኢትዮጵያ ሰዓት' : 'Ethiopian Time'}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {ethiopianTime}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          )}
        </Grid>

        {/* Today's Holidays */}
        {todayHolidays.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <EventIcon color="secondary" sx={{ mr: 1 }} />
                <Typography variant="subtitle2" color="secondary">
                  {isAmharic ? 'የዛሬ በዓላት' : "Today's Holidays"}
                </Typography>
              </Box>
              {todayHolidays.map((holiday, index) => (
                <Chip
                  key={index}
                  label={isAmharic ? holiday.nameAmharic : holiday.name}
                  color="secondary"
                  variant="outlined"
                  sx={{ mb: 1, mr: 1 }}
                />
              ))}
            </Box>
          </>
        )}

        {/* Upcoming Holidays */}
        {showHolidays && upcomingHolidays.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                {isAmharic ? 'የሚመጡ በዓላት' : 'Upcoming Holidays'}
              </Typography>
              {upcomingHolidays.map((holiday, index) => {
                const holidayGregorianDate = ethiopianCalendarService.convertSimpleDateToGregorian(holiday.date);
                const daysUntil = Math.ceil((holidayGregorianDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
                
                return (
                  <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.5 }}>
                    <Typography variant="body2">
                      {isAmharic ? holiday.nameAmharic : holiday.name}
                    </Typography>
                    <Chip
                      label={`${daysUntil} ${isAmharic ? 'ቀናት' : 'days'}`}
                      size="small"
                      variant="outlined"
                      color="primary"
                    />
                  </Box>
                );
              })}
            </Box>
          </>
        )}

        {/* Fasting Information */}
        {showFastingInfo && fastingPeriods.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                {isAmharic ? 'የጾም ጊዜዎች' : 'Fasting Periods'}
              </Typography>
              {fastingPeriods.slice(0, 2).map((fasting, index) => (
                <Box key={index} sx={{ mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {isAmharic ? fasting.nameAmharic : fasting.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatEthiopianDate(ethiopianCalendarService.convertSimpleDateToGregorian(fasting.startDate), isAmharic)} - 
                    {formatEthiopianDate(ethiopianCalendarService.convertSimpleDateToGregorian(fasting.endDate), isAmharic)}
                  </Typography>
                </Box>
              ))}
            </Box>
          </>
        )}

        {/* Calendar Year Info */}
        <Divider sx={{ my: 2 }} />
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            {isAmharic ? 'የኢትዮጵያ ዘመን አቆጣጠር አመት' : 'Ethiopian Calendar Year'} {getCurrentEthiopianYear()}
          </Typography>
          <br />
          <Typography variant="caption" color="text.secondary">
            {isAmharic ? '13 ወራት ያለው ዘመን አቆጣጠር' : '13-month calendar system'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default EthiopianCalendarWidget;
