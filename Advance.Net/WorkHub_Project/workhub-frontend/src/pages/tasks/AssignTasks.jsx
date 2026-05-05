import { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip
} from "@mui/material";
import {
  DragDropContext,
  Droppable,
  Draggable
} from "@hello-pangea/dnd";

import { getUnassignedTasks, assignTask } from "../../services/taskService";
import { getNonAdminUsers } from "../../services/userService";

function AssignTasks() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const t = await getUnassignedTasks();
    const u = await getNonAdminUsers();
    setTasks(t.data);
    setUsers(u.data);
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const taskId = result.draggableId;
    const userId = result.destination.droppableId;

    await assignTask(taskId, userId);
    loadData(); // refresh UI
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Assign Tasks
      </Typography>

      <DragDropContext onDragEnd={onDragEnd}>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 20, backgroundColor: "grey.50",p: 3,borderRadius: 4,
                  border: "1px solid",borderColor: "grey.300" }}>
          
          {/* LEFT — TASKS */}
          <Droppable droppableId="tasks" isDropDisabled>
            {(provided) => (
              <Box ref={provided.innerRef} {...provided.droppableProps}>
                <Typography fontWeight="bold" mb={2}>
                  Unassigned Tasks
                </Typography>

                {tasks.map((task, index) => (
                  <Draggable
                    key={task.taskId}
                    draggableId={task.taskId.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        sx={{mb: 2,cursor: "grab",borderRadius: 2,boxShadow: 3,
                          transition: "all 0.2s ease",
                          "&:hover": { boxShadow: 6,transform: "scale(1.02)"}
                        }}
                      >

                        <CardContent>
                          <Typography fontWeight="bold">
                            {task.title}
                          </Typography>
                          <Typography variant="caption">
                            {task.status} • {task.priority}
                          </Typography>
                        </CardContent>
                      </Card>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Box>
            )}
          </Droppable>

         


          {/* RIGHT — USERS */}
          <Box sx={{ backgroundColor: "grey.50",p: 3,borderRadius: 4, border: "1px solid",borderColor: "grey.300"}}>
            <Typography fontWeight="bold" mb={2}>
              Users
            </Typography>

            {users.map(user => (
              // <Droppable
              //   key={user.userId}
              //   droppableId={user.userId.toString()}
              // >
              //   {(provided) => (
              //     <Card
              //       ref={provided.innerRef}
              //       {...provided.droppableProps}
              //       sx={{ mb: 2, p: 2 }}
              //     >
              //       <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              //         <Avatar src={user.profileImage || ""} />
              //         <Typography>{user.fullName}</Typography>
              //         {/* SKILLS */}
              //           <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
              //           {user.skills?.map(skill => (
              //               <Chip
              //               key={skill.skillId}
              //               label={skill.skillName}
              //               size="small"
              //               variant="outlined"
              //               />
              //           ))}
              //           </Box>
              //       </Box>
              //       {provided.placeholder}
              //     </Card>
              //   )}
              // </Droppable>
               <Droppable droppableId={user.userId.toString()}>
                {(provided, snapshot) => (
                  <Card
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{
                      mb: 2,
                      p: 2,
                      minHeight: 90,             
                      borderRadius: 3,
                      border: "2px dashed",
                      borderColor: snapshot.isDraggingOver
                        ? "primary.main"
                        : "grey.300",
                      backgroundColor: snapshot.isDraggingOver
                        ? "primary.50"
                        : "background.paper",
                      transition: "all 0.25s ease",
                      boxShadow: snapshot.isDraggingOver ? 6 : 1
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar src={user.profileImage || ""} />

                      <Box>
                        <Typography fontWeight="bold">
                          {user.fullName}
                        </Typography>

                        {/* SKILLS */}
                        <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mt: 0.5 }}>
                          {user.skills?.map(skill => (
                            <Chip
                              key={skill.skillId}
                              label={skill.skillName}
                              size="small"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      </Box>
                    </Box>

                    {provided.placeholder}
                    <Typography variant="caption" color="text.secondary"
                      sx={{ mt: 1, display: "block" }}
                    >
                      Drop task here to assign
                    </Typography>

                  </Card>
                )}
              </Droppable>
            ))}
          </Box>

        </Box>
      </DragDropContext>
    </Container>
  );
}

export default AssignTasks;
