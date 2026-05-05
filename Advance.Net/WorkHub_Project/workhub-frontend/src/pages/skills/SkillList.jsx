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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { getAllSkills, createSkill, updateSkill, deleteSkill } from "../../services/skillService";

function SkillList() {
  const [skills, setSkills] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [form, setForm] = useState({
    skillId: null,
    skillName: ""
  });

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    const res = await getAllSkills();
    setSkills(res.data);
  };

  const handleOpenAdd = () => {
    setIsEdit(false);
    setForm({ skillId: null, skillName: ""});
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
      await updateSkill(form.skillId, form);
    } else {
      await createSkill(form);
    }

    setOpenDialog(false);
    loadSkills();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this skill?")) return;
    await deleteSkill(id);
    loadSkills();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Stack direction="row" justifyContent="space-between" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          Skills
        </Typography>

        <Button variant="contained" onClick={handleOpenAdd}>
          Add Skill
        </Button>
      </Stack>

      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#F5F5F5" }}>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Skill Name</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {skills.map((skill) => (
              <TableRow key={skill.skillId} hover>
                <TableCell>{skill.skillId}</TableCell>
                <TableCell>{skill.skillName}</TableCell>

                <TableCell align="center">
                  <IconButton color="primary" onClick={() => handleOpenEdit(skill)}>
                    <EditIcon />
                  </IconButton>

                  <IconButton color="error" onClick={() => handleDelete(skill.skillId)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}

            {skills.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No skills found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ===== POPUP DIALOG ===== */}
      <Dialog open={openDialog} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{isEdit ? "Edit Skill" : "Add Skill"}</DialogTitle>

        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Skill Name"
              name="skillName"
              value={form.skillName}
              onChange={handleChange}
              fullWidth
            />
          </Stack>
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

export default SkillList;
