import StackedCardsCarousel from "../components/carousel/StackedCardsCarousel";
import { Typography, Box } from "@mui/material";

function Showcase() {
  return (
    <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          Explore WorkHub
        </Typography>
        {/* <Typography color="text.secondary">
          Navigate quickly using interactive cards
        </Typography> */}
        <br></br>
        <br></br>
        <StackedCardsCarousel />
      </Box>
    
  );
}

export default Showcase;
