import { useEffect, useState } from "react";
import { getLoggedInUser } from "../../services/authService";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Chip,
  Stack,
  Button,
  TextField,
  Checkbox,
  LinearProgress,
  Grow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Backdrop
} from "@mui/material";

import {
  getAllSubTasks,
  createSubTask,
  toggleSubTask,
  deleteSubTask
} from "../../services/subTaskService";


function SubTaskList() {
  const [groupedTasks, setGroupedTasks] = useState({});
  const [newSubTask, setNewSubTask] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState(null);
  const loggedUser = getLoggedInUser();

  // 🔄 Load + group subtasks
  const reloadSubTasks = async () => {
    const res = await getAllSubTasks();
    const grouped = {};

    res.data.forEach(st => {
      if (!grouped[st.taskId]) {
        grouped[st.taskId] = {
          taskTitle: st.tasktitle,
          assignedTo: Number(st.assignedTo),
          subtasks: []
        };
      }
      grouped[st.taskId].subtasks.push(st);
    });

    setGroupedTasks(grouped);
  };
  const canManageSubTask = (taskAssignedTo) => {
    console.log("loggedUser:", loggedUser);
    console.log("task.assignedTo:", taskAssignedTo, typeof taskAssignedTo);
    if (!loggedUser) return false;

    return loggedUser.role === "Admin" || taskAssignedTo === loggedUser.userId;
  };

  useEffect(() => {
    reloadSubTasks();
  }, []);

  // ➕ Add Subtask
  const handleAddSubTask = async (taskId) => {
    if (!newSubTask[taskId]) return;

    await createSubTask({
      taskId,
      title: newSubTask[taskId]
    });

    setNewSubTask({ ...newSubTask, [taskId]: "" });
    setOpenDialog(false);       
    setActiveTaskId(null);  
    reloadSubTasks();
  };

  // ✅ Toggle complete
  const handleToggle = async (subTaskId) => {
    await toggleSubTask(subTaskId);
    reloadSubTasks();
  };

  // ❌ Delete subtask
  const handleDeleteSubTask = async (id) => {
    if (!window.confirm("Delete this subtask?")) return;
    await deleteSubTask(id);
    reloadSubTasks();
  };

  // 📊 Progress calculation
  const getProgress = (subtasks) => {
    if (!subtasks.length) return 0;
    const done = subtasks.filter(s => s.isCompleted).length;
    return Math.round((done / subtasks.length) * 100);
  };
  

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Task & SubTasks
      </Typography>

      <Stack spacing={5}>
        {Object.entries(groupedTasks).map(([taskId, task]) => (
          <Card key={taskId} sx={{display: "flex",justifyContent: "space-between",alignItems: "flex-start", borderRadius: 5, boxShadow: 6 }}>
            <CardContent>
              <Grid container spacing={20}>

                {/* LEFT — TASK INFO */}
                <Grid item xs={12} md={4}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {task.taskTitle}
                  </Typography>

                  <Typography color="text.secondary">
                    {task.description}
                    task description
                  </Typography>

                  <Box mt={2}>
                    <Chip label="Read Only" size="small" />
                  </Box>

                  <Box mt={3}>
                    <Typography variant="caption">
                      Progress: {getProgress(task.subtasks)}%
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={getProgress(task.subtasks)}
                      sx={{ height: 8, borderRadius: 5 }}
                    />
                  </Box>
                </Grid>

                {/* RIGHT — SUBTASKS */}
                <Grid item xs={12} md={8}>
                  <Stack spacing={3}>

                    <Grid container spacing={2}>
                      {task.subtasks.map(st => (
                        <Grid item xs={12} sm={6} key={st.subTaskId}>
                          <Grow in timeout={400}>
                            <Card
                              sx={{
                                position: "relative",
                                borderRadius: 3,
                                boxShadow: 3,
                                transition: "all 0.3s ease","&:hover": {
                                  boxShadow: 10,
                                  transform: "translateY(-6px)"
                                }
                              }}
                            >
                              {/* DELETE ❌ */}
                              
                               {canManageSubTask(task.assignedTo) && (
                                    <Box
                                      sx={{
                                        position: "absolute",
                                        top: 6,
                                        right: 6
                                      }}
                                    >
                                      <Button
                                        size="small"
                                        color="#fff"
                                        sx={{
                                          minWidth: 15,
                                          width: 15,
                                          height: 15,
                                          borderRadius: "80%",
                                          fontWeight: "bold",
                                          backgroundColor: "error.main",
                                          color: "#fff",
                                        }}
                                        onClick={() => handleDeleteSubTask(st.subTaskId)}
                                      >
                                        ✕
                                      </Button>
                                    </Box>
                                )}
                              <CardContent sx={{ pt: 4}}>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                  <Typography
                                    fontWeight="bold"
                                    sx={{
                                      textDecoration: st.isCompleted
                                        ? "line-through"
                                        : "none",
                                      color: st.isCompleted
                                        ? "text.secondary"
                                        : "text.primary"
                                    }}
                                  >
                                    {st.title}
                                  </Typography>
                                </Stack>

                                <Chip
                                  label={st.isCompleted ? "Completed" : "Pending"}
                                  color={st.isCompleted ? "success" : "warning"}
                                  size="small"
                                  sx={{ mt: 1 }}
                                />
                                <Stack direction="row" alignItems="center" spacing={1}>
                                  <Checkbox
                                    checked={st.isCompleted}
                                    onChange={() => handleToggle(st.subTaskId)}
                                  />
                                  <Typography variant="caption">
                                    Complete or not ?
                                  </Typography>
                                </Stack>
                              </CardContent>
                            </Card>
                          </Grow>
                        </Grid>
                      ))}
                    </Grid>
                  </Stack>
                </Grid>
              </Grid>
            </CardContent>
                    {/* ADD SUBTASK */}
                    {canManageSubTask(task.assignedTo) && (
                        // <Button onClick={() => openDialogForTask(taskId)}>
                        //   Add SubTask
                        // </Button>
                        <Box textAlign="right" mt={1} mx={1}> 
                      
                          <Button 
                            size="small"
                            variant="outlined"
                            onClick={() => {setActiveTaskId(taskId);setOpenDialog(true);}}
                          >
                            + Add SubTask
                          </Button>
                        </Box>
                      )}
                    

          </Card>
        ))}
      </Stack>
      <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          fullWidth
          maxWidth="sm"
          BackdropComponent={Backdrop}
          BackdropProps={{
            sx: {
              backdropFilter: "blur(5px)",
              backgroundColor: "rgba(0,0,0,0.2)"
            }
          }}
      >
       
        <DialogTitle>Add SubTask</DialogTitle>
        <DialogContent>
          <TextField
              autoFocus
              margin="dense"
              label="SubTask Title"
              fullWidth
              // value={newSubTask[activeTaskId] || ""}
              value={activeTaskId ? newSubTask[activeTaskId] || "" : ""}

              onChange={(e) =>
                setNewSubTask({
                  ...newSubTask,
                  [activeTaskId]: e.target.value
                })
              }
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              handleAddSubTask(activeTaskId);
              setOpenDialog(false);
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

    </Container>
  );
}

export default SubTaskList;
