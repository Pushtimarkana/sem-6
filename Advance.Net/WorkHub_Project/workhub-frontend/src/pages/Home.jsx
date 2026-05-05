import { Box, Button, Typography, Container, Grid, Card, CardContent } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  CheckCircleOutline, 
  GroupsOutlined, 
  BarChartOutlined, 
  TimelineOutlined,
  TaskAltOutlined,
  AssignmentTurnedInOutlined
} from "@mui/icons-material";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.8 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5 }
  }
};

function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <TaskAltOutlined sx={{ fontSize: 48, color: "#1976d2" }} />,
      title: "Task Management",
      description: "Break down complex projects into manageable tasks and subtasks. Track progress efficiently."
    },
    {
      icon: <GroupsOutlined sx={{ fontSize: 48, color: "#1976d2" }} />,
      title: "Team Collaboration",
      description: "Work together seamlessly with real-time updates and team communication tools."
    },
    {
      icon: <AssignmentTurnedInOutlined sx={{ fontSize: 48, color: "#1976d2" }} />,
      title: "Role-Based Access",
      description: "Secure your workspace with customizable permissions for different team roles."
    },
    {
      icon: <BarChartOutlined sx={{ fontSize: 48, color: "#1976d2" }} />,
      title: "Analytics & Reports",
      description: "Get insights into team performance with detailed analytics and reporting."
    },
    {
      icon: <TimelineOutlined sx={{ fontSize: 48, color: "#1976d2" }} />,
      title: "Timeline View",
      description: "Visualize project timelines and dependencies with Gantt charts."
    },
    {
      icon: <CheckCircleOutline sx={{ fontSize: 48, color: "#1976d2" }} />,
      title: "Track Progress",
      description: "Monitor task completion rates and ensure deadlines are met."
    }
  ];

  const stats = [
    { number: "1M+", label: "Active Users" },
    { number: "50K+", label: "Companies" },
    { number: "99.9%", label: "Uptime" },
    { number: "24/7", label: "Support" }
  ];

  const companies = [
    "Sodexo", "Yatra", "Honeywell", "Philips", "NHS", "Siemens", "Olympus", "NTT Data"
  ];

  return (
    <Box sx={{ overflowX: "hidden" }}>
      
      {/* HERO SECTION */}
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          background: "linear-gradient(135deg, #384c5a 0%, #2932ea 100%)",
          position: "relative",
          overflow: "hidden"
        }}
      >
        {/* Animated background elements */}
        <Box
          component={motion.div}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          sx={{
            position: "absolute",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.1)",
            top: "-200px",
            right: "-200px",
            filter: "blur(40px)"
          }}
        />

        <Box
          component={motion.div}
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, -45, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          sx={{
            position: "absolute",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.08)",
            bottom: "-100px",
            left: "-100px",
            filter: "blur(30px)"
          }}
        />
        
        <Container sx={{ position: "relative", zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            {/* Left side - Text content */}
            <Grid item xs={12} md={6}>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                <motion.div variants={fadeInUp}>
                  <Typography 
                    variant="h2" 
                    fontWeight="bold" 
                    gutterBottom
                    sx={{ 
                      color: "white",
                      fontSize: { xs: "2.5rem", md: "3.5rem" },
                      mb: 2
                    }}
                  >
                    More than <Box component="span" sx={{ color: "#4ade80" }}>1 million teams</Box>
                  </Typography>
                  <Typography 
                    variant="h2" 
                    fontWeight="bold"
                    sx={{ 
                      color: "white",
                      fontSize: { xs: "2.5rem", md: "3.5rem" },
                      mb: 3
                    }}
                  >
                    manage their work with WorkHub
                  </Typography>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <Typography 
                    variant="h6" 
                    sx={{ color: "rgba(255, 255, 255, 0.9)", mb: 4, maxWidth: "600px" }}
                  >
                    Follow the crowd. Do yourself proud. Organize, track, and manage your projects efficiently.
                  </Typography>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <Button
                    variant="contained"
                    size="large"
                    sx={{ 
                      mr: 2,
                      mb: { xs: 2, sm: 0 },
                      bgcolor: "white",
                      color: "#667eea",
                      px: 4,
                      py: 1.5,
                      fontSize: "1.1rem",
                      fontWeight: "bold",
                      "&:hover": {
                        bgcolor: "#f0f0f0",
                        transform: "translateY(-2px)",
                        boxShadow: "0 8px 20px rgba(0,0,0,0.2)"
                      },
                      transition: "all 0.3s ease"
                    }}
                    onClick={() => navigate("/login")}
                  >
                    Sign Up Now
                  </Button>

                  <Button
                    variant="outlined"
                    size="large"
                    sx={{ 
                      color: "white",
                      borderColor: "white",
                      px: 4,
                      py: 1.5,
                      fontSize: "1.1rem",
                      fontWeight: "bold",
                      "&:hover": {
                        borderColor: "white",
                        bgcolor: "rgba(255, 255, 255, 0.1)",
                        transform: "translateY(-2px)"
                      },
                      transition: "all 0.3s ease"
                    }}
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </Button>
                </motion.div>
              </motion.div>
            </Grid>

            {/* Right side - Animated Illustration */}
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Box
                  component={motion.div}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  sx={{
                    position: "relative",
                    display: { xs: "none", md: "block" }
                  }}
                >
                  {/* Main illustration container */}
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      height: "500px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    {/* Central circle with person icon */}
                    <Box
                      component={motion.div}
                      animate={{
                        y: [0, -20, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      sx={{
                        position: "relative",
                        width: "200px",
                        height: "200px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                        zIndex: 2
                      }}
                    >
                      <GroupsOutlined sx={{ fontSize: 80, color: "#667eea" }} />
                    </Box>

                    {/* Floating elements around */}
                    {[
                      { top: "10%", left: "10%", delay: 0, icon: <TaskAltOutlined sx={{ fontSize: 40, color: "#667eea" }} /> },
                      { top: "15%", right: "5%", delay: 0.5, icon: <AssignmentTurnedInOutlined sx={{ fontSize: 40, color: "#764ba2" }} /> },
                      { bottom: "15%", left: "5%", delay: 1, icon: <BarChartOutlined sx={{ fontSize: 40, color: "#4ade80" }} /> },
                      { bottom: "20%", right: "10%", delay: 1.5, icon: <TimelineOutlined sx={{ fontSize: 40, color: "#667eea" }} /> },
                    ].map((item, index) => {
                      const { icon, delay, ...position } = item;
                      return (
                        <Box
                          key={index}
                          component={motion.div}
                          animate={{
                            y: [0, -15, 0],
                            rotate: [0, 360],
                          }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: delay
                          }}
                          whileHover={{
                            scale: 1.2,
                            rotate: 0,
                            transition: { duration: 0.3 }
                          }}
                          sx={{
                            position: "absolute",
                            ...position,
                            width: "80px",
                            height: "80px",
                            borderRadius: "50%",
                            background: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                            cursor: "pointer",
                            zIndex: 1
                          }}
                        >
                          {icon}
                        </Box>
                      );
                    })}

                    {/* Connecting lines */}
                    <Box
                      component={motion.svg}
                      animate={{
                        opacity: [0.3, 0.6, 0.3],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      sx={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        top: 0,
                        left: 0,
                        zIndex: 0
                      }}
                    >
                      <motion.line
                        x1="50%"
                        y1="50%"
                        x2="20%"
                        y2="20%"
                        stroke="rgba(255,255,255,0.3)"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                      />
                      <motion.line
                        x1="50%"
                        y1="50%"
                        x2="80%"
                        y2="25%"
                        stroke="rgba(255,255,255,0.3)"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                      />
                      <motion.line
                        x1="50%"
                        y1="50%"
                        x2="20%"
                        y2="75%"
                        stroke="rgba(255,255,255,0.3)"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                      />
                      <motion.line
                        x1="50%"
                        y1="50%"
                        x2="80%"
                        y2="75%"
                        stroke="rgba(255,255,255,0.3)"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                      />
                    </Box>

                    {/* Orbiting particles */}
                    {[...Array(6)].map((_, i) => (
                      <Box
                        key={`particle-${i}`}
                        component={motion.div}
                        animate={{
                          rotate: [0, 360],
                        }}
                        transition={{
                          duration: 10 + i * 2,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                        sx={{
                          position: "absolute",
                          width: "100%",
                          height: "100%",
                          top: 0,
                          left: 0
                        }}
                      >
                        <Box
                          sx={{
                            position: "absolute",
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            background: i % 2 === 0 ? "#4ade80" : "#ffffff",
                            boxShadow: `0 0 10px ${i % 2 === 0 ? "#4ade80" : "#ffffff"}`,
                            top: `${10 + i * 15}%`,
                            left: "50%",
                            transform: "translateX(-50%)"
                          }}
                        />
                      </Box>
                    ))}
                  </Box>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* TRUSTED BY SECTION */}
      <Box sx={{ py: 8, bgcolor: "#f8fafc" }}>
        <Container>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeIn}
          >
            <Typography 
              variant="h4" 
              fontWeight="bold" 
              textAlign="center" 
              mb={6}
              sx={{ color: "#1e293b" }}
            >
              Trusted by leading companies worldwide
            </Typography>
            
            <Box 
              sx={{ 
                display: "flex", 
                flexWrap: "wrap", 
                justifyContent: "center", 
                alignItems: "center",
                gap: 4
              }}
            >
              {companies.map((company, index) => (
                <motion.div
                  key={company}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: "bold",
                      color: "#64748b",
                      px: 2,
                      "&:hover": {
                        color: "#1976d2",
                        transform: "scale(1.1)"
                      },
                      transition: "all 0.3s ease",
                      cursor: "pointer"
                    }}
                  >
                    {company}
                  </Typography>
                </motion.div>
              ))}
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* FEATURES SECTION */}
      <Container sx={{ py: 12 }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp}>
            <Typography 
              variant="h3" 
              fontWeight="bold" 
              textAlign="center"
              mb={2}
              sx={{ color: "#1e293b" }}
            >
              Everything you need to manage projects
            </Typography>
            <Typography 
              variant="h6" 
              textAlign="center"
              color="text.secondary"
              mb={8}
            >
              Powerful features to help your team stay organized and productive
            </Typography>
          </motion.div>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  variants={scaleIn}
                  whileHover={{ 
                    y: -10,
                    transition: { duration: 0.3 }
                  }}
                >
                  <Card 
                    sx={{ 
                      height: "100%",
                      p: 2,
                      borderRadius: 3,
                      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                      "&:hover": {
                        boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                      },
                      transition: "all 0.3s ease"
                    }}
                  >
                    <CardContent>
                      <Box sx={{ mb: 2 }}>
                        {feature.icon}
                      </Box>
                      <Typography variant="h5" fontWeight="bold" gutterBottom>
                        {feature.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>

      {/* STATS SECTION */}
      <Box sx={{ bgcolor: "#1e293b", py: 10 }}>
        <Container>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <Grid container spacing={4}>
              {stats.map((stat, index) => (
                <Grid item xs={6} md={3} key={index}>
                  <motion.div variants={fadeInUp}>
                    <Box textAlign="center">
                      <Typography 
                        variant="h2" 
                        fontWeight="bold"
                        sx={{ 
                          color: "#4ade80",
                          mb: 1
                        }}
                      >
                        {stat.number}
                      </Typography>
                      <Typography 
                        variant="h6"
                        sx={{ color: "rgba(255,255,255,0.8)" }}
                      >
                        {stat.label}
                      </Typography>
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* ORGANIZE SECTION */}
      <Container sx={{ py: 12 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Typography 
                variant="h3" 
                fontWeight="bold" 
                gutterBottom
                sx={{ color: "#10b981" }}
              >
                FINISH ON TIME
              </Typography>
              <Typography variant="h3" fontWeight="bold" gutterBottom>
                Organize your projects
              </Typography>
              <Typography variant="h6" color="text.secondary" paragraph>
                Break down complex projects into manageable lists, tasks, and subtasks to manage them efficiently. 
                Assign tasks to your team and track progress to ensure you finish on time.
              </Typography>
            </motion.div>
          </Grid>
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: 400,
                  borderRadius: 3,
                  overflow: "hidden",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.1)"
                }}
              >
                <Box
                  component="img"
                  src="https://media.geeksforgeeks.org/wp-content/uploads/20240427182308/How-to-Manage-Tasks.webp"
                  alt="Task Management"
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                  }}
                />
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>

      {/* TIMELINE SECTION */}
      <Box sx={{ bgcolor: "#f8fafc", py: 12 }}>
        <Container>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Box
                  sx={{
                    width: "100%",
                    height: 400,
                    borderRadius: 3,
                    overflow: "hidden", 
                    boxShadow: "0 10px 40px rgba(0,0,0,0.1)"
                  }}
                >
                  <Box
                    component="img"
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRptytXesaeB83DhGM6gO8bf7gx_SGWLPLKow&s"
                    alt="Timeline Management"
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                  />
                </Box>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Typography 
                  variant="h3" 
                  fontWeight="bold" 
                  gutterBottom
                  sx={{ color: "#10b981" }}
                >
                  NOTHING SLIPS
                </Typography>
                <Typography variant="h3" fontWeight="bold" gutterBottom>
                  Manage your timeline
                </Typography>
                <Typography variant="h6" color="text.secondary" paragraph>
                  Create dependencies between related tasks to make sure they're completed in a particular order. 
                  Set up recurring tasks and add reminders so nothing slips your mind!
                </Typography>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA SECTION */}
      <Box 
        sx={{ 
          py: 12, 
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          textAlign: "center" 
        }}
      >
        <Container>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <Typography 
                variant="h3" 
                fontWeight="bold"
                sx={{ color: "white", mb: 3 }}
              >
                Ready to boost your team's productivity?
              </Typography>
              <Typography 
                variant="h6"
                sx={{ color: "rgba(255,255,255,0.9)", mb: 5 }}
              >
                Join thousands of teams already using WorkHub
              </Typography>
            </motion.div>
            
            <motion.div variants={fadeInUp}>
              <Button
                variant="contained"
                size="large"
                sx={{
                  bgcolor: "white",
                  color: "#667eea",
                  px: 6,
                  py: 2,
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  borderRadius: 2,
                  "&:hover": {
                    bgcolor: "#f0f0f0",
                    transform: "scale(1.05)",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
                  },
                  transition: "all 0.3s ease"
                }}
                onClick={() => navigate("/login")}
              >
                Get Started Free
              </Button>
            </motion.div>
          </motion.div>
        </Container>
      </Box>

      {/* FOOTER */}
      <Box sx={{ bgcolor: "#1e293b", py: 6 }}>
        <Container>
          <Grid container spacing={4}>
            <Grid item xs={12} md={3}>
              <Typography variant="h6" fontWeight="bold" sx={{ color: "white", mb: 2 }}>
                WorkHub
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)" }}>
                Professional task management for modern teams
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="h6" fontWeight="bold" sx={{ color: "white", mb: 2 }}>
                Features
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)", mb: 1 }}>
                Task Management
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)", mb: 1 }}>
                Team Collaboration
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)", mb: 1 }}>
                Analytics
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="h6" fontWeight="bold" sx={{ color: "white", mb: 2 }}>
                Resources
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)", mb: 1 }}>
                Documentation
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)", mb: 1 }}>
                Support
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)", mb: 1 }}>
                Blog
              </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="h6" fontWeight="bold" sx={{ color: "white", mb: 2 }}>
                Company
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)", mb: 1 }}>
                About Us
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)", mb: 1 }}>
                Careers
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)", mb: 1 }}>
                Contact
              </Typography>
            </Grid>
          </Grid>
          <Box sx={{ borderTop: "1px solid rgba(255,255,255,0.1)", mt: 6, pt: 4, textAlign: "center" }}>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)" }}>
              © 2026, WorkHub. All Rights Reserved.
            </Typography>
          </Box>
        </Container>
      </Box>

    </Box>
  );
}

export default Home;