import { useEffect, useState } from "react";
import { getAllTasks, deleteTask } from "../../services/taskService";
import TaskCard from "../../components/tasks/TaskCard";
import { getAllLabels } from "../../services/labelService";
import {
  assignLabelToTask,
  removeLabelFromTask
} from "../../services/taskService";

import {
  Typography,
  Button,
  Stack,
  Container,
  Grow,
  Box
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // useEffect(() => {
  //   getAllTasks().then(res => {
  //     setTasks(res.data);
  //     setLoading(false);
  //   });
  // }, []);
  useEffect(() => {
    Promise.all([getAllTasks(), getAllLabels()])
      .then(([tasksRes, labelsRes]) => {
        setTasks(tasksRes.data);
        setLabels(labelsRes.data);
        setLoading(false);
      });
  }, []);


  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    await deleteTask(id);
    setTasks(tasks.filter(t => t.taskId !== id));
  };

  const handleAssignLabel = async (taskId, labelId) => {
    await assignLabelToTask(taskId, labelId);

    // refresh tasks so UI updates
    const res = await getAllTasks();
    setTasks(res.data);
  };

  const handleRemoveLabel = async (taskId, labelId) => {
    await removeLabelFromTask(taskId, labelId);

    const res = await getAllTasks();
    setTasks(res.data);
  };


  if (loading) return <p>Loading...</p>;

  return (
    <Container maxWidth="xl" sx={{ py: 4}}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography variant="h4" fontWeight="bold">
          Tasks
        </Typography>

        <Button
          variant="contained"
          size="large"
          onClick={() => navigate("/tasks/add")}
        >
          Add Task
        </Button>
      </Stack>

      {/* 🔥 PERFECT GRID */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 4
        }}
      >
        {tasks.map((task, index) => (
          <Grow in timeout={500 + index * 150} key={task.taskId}>
            <Box sx={{ height: "100%" }}>
              <TaskCard
                task={task}
                onDelete={handleDelete}
                labels={labels}                       
                assignLabelToTask={handleAssignLabel}
                removeLabelFromTask={handleRemoveLabel}
              />
            </Box>
          </Grow>
        ))}
      </Box>
    </Container>
  );
}


export default TaskList;
