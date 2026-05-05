import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  IconButton,
  Grid,
  Card,
  CardContent,
  Chip,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  Divider
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Edit,
  AccessTime,
  Menu as MenuIcon,
  Notifications,
  Settings,
  DarkMode,
  CalendarToday
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1)); // February 2026
  const [view, setView] = useState('Month');

  // Sample events data
  const events = [
    {
      id: 1,
      title: 'Weekly Team Meeting',
      date: new Date(2026, 4, 16),
      time: '9:00 AM - 10:00 AM',
      description: 'Discuss weekly progress and upcoming tasks',
      color: '#10b981',
      isAllDay: false
    },
    {
      id: 2,
      title: 'Project Deadline',
      date: new Date(2026, 4, 17),
      time: 'All Day',
      description: 'Submit final deliverables for Project X',
      color: '#f59e0b',
      isAllDay: true
    },
    {
      id: 3,
      title: 'Client Presentation',
      date: new Date(2026, 4, 18),
      time: '2:00 PM - 3:30 PM',
      description: 'Present quarterly results to the client',
      color: '#3b82f6',
      isAllDay: false
    },
    {
      id: 4,
      title: 'Design Review Session',
      date: new Date(2026, 4, 19),
      time: '11:00 AM - 12:00 PM',
      description: 'Review new design',
      color: '#ef4444',
      isAllDay: false
    },
    {
      id: 5,
      title: 'Team Meeting',
      date: new Date(2026, 1, 4),
      time: '9:00 AM',
      description: 'Weekly sync',
      color: '#3b82f6',
      isAllDay: false
    },
    {
      id: 6,
      title: 'Team Meeting',
      date: new Date(2026, 1, 8),
      time: '9:00 AM',
      description: 'Weekly sync',
      color: '#3b82f6',
      isAllDay: false
    },
    {
      id: 7,
      title: 'Team Meeting',
      date: new Date(2026, 1, 12),
      time: '9:00 AM',
      description: 'Weekly sync',
      color: '#3b82f6',
      isAllDay: false
    },
    {
      id: 8,
      title: 'Team Meeting',
      date: new Date(2026, 1, 15),
      time: '9:00 AM',
      description: 'Weekly sync',
      color: '#3b82f6',
      isAllDay: false
    },
    {
      id: 9,
      title: 'Project Review',
      date: new Date(2026, 1, 15),
      time: '2:00 PM',
      description: 'Review project progress',
      color: '#8b5cf6',
      isAllDay: false
    },
    {
      id: 10,
      title: 'Team Meeting',
      date: new Date(2026, 1, 20),
      time: '9:00 AM',
      description: 'Weekly sync',
      color: '#3b82f6',
      isAllDay: false
    },
    {
      id: 11,
      title: 'Team Meeting',
      date: new Date(2026, 1, 25),
      time: '9:00 AM',
      description: 'Weekly sync',
      color: '#3b82f6',
      isAllDay: false
    }
  ];

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getEventsForDay = (date) => {
    if (!date) return [];
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const getUpcomingEvents = () => {
    const today = new Date();
    return events
      .filter(event => event.date >= today)
      .sort((a, b) => a.date - b.date)
      .slice(0, 4);
  };

  const formatEventDate = (date) => {
    return {
      month: monthNames[date.getMonth()].substring(0, 3),
      day: date.getDate()
    };
  };

  const days = getDaysInMonth(currentDate);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Calendar Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" fontWeight="bold">
            Team Calendar
          </Typography>
          
          <FormControl sx={{ minWidth: 120 }}>
            <Select
              value={view}
              onChange={(e) => setView(e.target.value)}
              size="small"
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="Month">Month</MenuItem>
              <MenuItem value="Week">Week</MenuItem>
              <MenuItem value="Day">Day</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Calendar Controls */}
        <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" fontWeight="600">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton onClick={handlePrevMonth}>
                <ChevronLeft />
              </IconButton>
              <Button 
                variant="outlined" 
                onClick={handleToday}
                sx={{ borderRadius: 2 }}
              >
                Today
              </Button>
              <IconButton onClick={handleNextMonth}>
                <ChevronRight />
              </IconButton>
            </Box>
          </Box>

          {/* Calendar Grid */}
          <Box>
            {/* Day names */}
            <Grid container spacing={0} sx={{ mb: 1 }}>
              {dayNames.map((day) => (
                <Grid item xs={12 / 7} key={day}>
                  <Box sx={{ 
                    textAlign: 'center', 
                    py: 1,
                    color: '#64748b',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {day}
                  </Box>
                </Grid>
              ))}
            </Grid>

            {/* Calendar days */}
            <Grid container spacing={1}>
              {days.map((day, index) => {
                const dayEvents = getEventsForDay(day);
                const isTodayDate = isToday(day);
                
                return (
                  <Grid item xs={12 / 7} key={index}>
                    <motion.div
                      whileHover={{ scale: day ? 1.02 : 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Paper
                        elevation={0}
                        sx={{
                          minHeight: 100,
                          p: 1,
                          bgcolor: day ? 'white' : 'transparent',
                          border: isTodayDate ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                          borderRadius: 2,
                          cursor: day ? 'pointer' : 'default',
                          transition: 'all 0.2s',
                          '&:hover': {
                            boxShadow: day ? 2 : 0
                          }
                        }}
                      >
                        {day && (
                          <>
                            <Typography
                              sx={{
                                fontSize: '14px',
                                fontWeight: isTodayDate ? 'bold' : '500',
                                color: isTodayDate ? '#3b82f6' : '#1e293b',
                                mb: 0.5
                              }}
                            >
                              {day.getDate()}
                            </Typography>
                            
                            {dayEvents.map((event, idx) => (
                              <Box
                                key={idx}
                                sx={{
                                  bgcolor: event.color + '20',
                                  color: event.color,
                                  px: 0.5,
                                  py: 0.25,
                                  borderRadius: 1,
                                  fontSize: '11px',
                                  mb: 0.5,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  borderLeft: `3px solid ${event.color}`
                                }}
                              >
                                {event.time} — {event.title}
                              </Box>
                            ))}
                          </>
                        )}
                      </Paper>
                    </motion.div>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        </Paper>

        {/* Upcoming Events */}
        <Box>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
            Upcoming Events
          </Typography>
          
          <Grid container spacing={3}>
            {getUpcomingEvents().map((event, index) => {
              const eventDate = formatEventDate(event.date);
              
              return (
                <Grid item xs={12} md={6} key={event.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card 
                      sx={{ 
                        borderRadius: 3,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                        '&:hover': {
                          boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                        },
                        transition: 'all 0.3s'
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                          {/* Date Badge */}
                          <Box
                            sx={{
                              minWidth: 70,
                              height: 70,
                              borderRadius: 2,
                              bgcolor: event.color + '20',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}
                          >
                            <Typography 
                              sx={{ 
                                fontSize: '12px', 
                                fontWeight: '600',
                                color: event.color,
                                textTransform: 'uppercase'
                              }}
                            >
                              {eventDate.month}
                            </Typography>
                            <Typography 
                              sx={{ 
                                fontSize: '24px', 
                                fontWeight: 'bold',
                                color: event.color,
                                lineHeight: 1
                              }}
                            >
                              {eventDate.day}
                            </Typography>
                          </Box>

                          {/* Event Details */}
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                              <Typography variant="h6" fontWeight="600">
                                {event.title}
                              </Typography>
                              <IconButton size="small">
                                <Edit fontSize="small" />
                              </IconButton>
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                              <AccessTime sx={{ fontSize: 16, color: '#64748b' }} />
                              <Typography variant="body2" color="text.secondary">
                                {event.time}
                              </Typography>
                            </Box>
                            
                            <Typography variant="body2" color="text.secondary">
                              {event.description}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Calendar;