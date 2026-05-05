import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  MenuItem
} from "@mui/material";
import {
  createUser,
  getUserById,
  updateUser
} from "../../services/userService";

function AddEditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    roleId: 2,
    isActive: true
  });

  useEffect(() => {
    if (isEdit) {
      getUserById(id).then(res => {
        setForm({
          fullName: res.data.fullName,
          email: res.data.email,
          password: "",
          roleId: res.data.roleId,
          isActive: res.data.isActive
        });
      });
    }
  }, [id, isEdit]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({...form,[name]: name === "roleId" ? Number(value) : value });
  };

  const handleSubmit = async () => {
  const payload = {
      fullName: form.fullName,
      email: form.email,
      roleId: form.roleId,
      isActive: form.isActive
    };

    if (form.password && form.password.trim() !== "") {
      payload.password = form.password;
    }

    if (isEdit) {
      await updateUser(id, payload);
    } else {
      payload.password = form.password; // required
      await createUser(payload);
    }

  navigate("/users");
};


  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Card sx={{ borderRadius: 4, boxShadow: 6 }}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold" mb={3}>
            {isEdit ? "Edit User" : "Add User"}
          </Typography>

          <Stack spacing={2}>
            <TextField
              label="Full Name"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="New Password (leave blank to keep old)"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              fullWidth
            />


            <TextField
                select
                label="Role"
                name="roleId"
                value={form.roleId}
                onChange={handleChange}
                fullWidth
                >
                <MenuItem value={1}>Admin</MenuItem>
                <MenuItem value={2}>User</MenuItem>
            </TextField>


            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button onClick={() => navigate("/users")}>
                Cancel
              </Button>
              <Button variant="contained" onClick={handleSubmit}>
                {isEdit ? "Update" : "Create"}
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}

export default AddEditUser;
