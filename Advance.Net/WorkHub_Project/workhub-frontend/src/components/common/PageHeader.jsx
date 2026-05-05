import { Box, Typography } from "@mui/material";

const PageHeader = ({ title, subtitle }) => {
  return (
    <Box mb={3}>
      <Typography variant="h5" fontWeight="bold">
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};

export default PageHeader;
