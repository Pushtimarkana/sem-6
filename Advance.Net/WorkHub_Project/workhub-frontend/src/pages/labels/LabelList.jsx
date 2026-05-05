import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { getAllLabels, deleteLabel,updateLabel,createLabel } from "../../services/labelService";

function LabelList() {
  const [labels, setLabels] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

   const [form, setForm] = useState({
    skillId: null,
    skillName: ""
  });

  useEffect(() => {
    loadLabels();
  }, []);

  const loadLabels = async () => {
    const res = await getAllLabels();
    setLabels(res.data);
  };

  const handleOpenAdd = () => {
    setIsEdit(false);
    setForm({ labelId: null, labelName: ""});
    setOpenDialog(true);
  };

  const handleOpenEdit = (skill) => {
    setIsEdit(true);
    setForm(skill);
    setOpenDialog(true);
  };

  const handleClose = () => setOpenDialog(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
      if (isEdit) {
        await updateLabel(form.labelId, form);
      } else {
        await createLabel(form);
      }
  
      setOpenDialog(false);
      loadLabels();
    };
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this label?")) return;
    await deleteLabel(id);
    loadLabels();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack direction="row" justifyContent="space-between" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          Labels
        </Typography>

        <Button
          variant="contained"
          onClick={handleOpenAdd}
        >
          Add Label
        </Button>
      </Stack>

      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#F5F5F5" }}>
            <TableRow>
              <TableCell><b>ID</b></TableCell>
              <TableCell><b>Label Name</b></TableCell>
              <TableCell><b>Preview</b></TableCell>
              <TableCell align="center"><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {labels.map((label) => (
              <TableRow
                key={label.labelId}
                hover
                sx={{ cursor: "pointer" }}
              >
                <TableCell>{label.labelId}</TableCell>
                <TableCell>{label.labelName}</TableCell>

                <TableCell>
                  <Chip
                    label={label.labelName}
                    sx={{
                      backgroundColor: "#E3F2FD",
                      color: "#0D47A1"
                    }}
                  />
                </TableCell>

                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenEdit(label)}
                  >
                    <EditIcon />
                  </IconButton>

                  <IconButton
                    color="error"
                    onClick={() =>
                      handleDelete(label.labelId)
                    }
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}

            {labels.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No labels found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>{isEdit ? "Edit Label" : "Add Label"}</DialogTitle>

        <DialogContent>
            <TextField
            label="Label Name"
            name="labelName"
            value={form.labelName}
            onChange={handleChange}
            fullWidth
            sx={{ mt: 2 }}
            />
        </DialogContent>

        <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button variant="contained" onClick={handleSave}>
            {isEdit ? "Update" : "Save"}
            </Button>
        </DialogActions>
        </Dialog>

    </Container>
  );
}

export default LabelList;
