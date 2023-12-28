import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Box,
  Grid,
} from "@mui/material";
import Header from "./Header";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'

export default function HomePage() {
  const navigate = useNavigate();
  
  const {currentUser} = useAuth();

  useEffect(() => {
    if (!currentUser) {
      // kick them out 
      navigate("/login");
    }
    getTasks();
  }, [currentUser])

  


  // State to hold the list of tasks.
  const [tasks, setTasks] = useState([
    // Sample tasks to start with.
  ]);
  // State for the task name being entered by the user.
  const [taskName, setTaskName] = useState("");

  // TODO: Support retrieving your todo list from the API.
  // Currently, the tasks are hardcoded. You'll need to make an API call
  // to fetch the list of tasks instead of using the hardcoded data.
  async function getTasks() {
    let apiCall = `https://tpeo-todo.vercel.app/tasks/${currentUser.username}`
    const response = await fetch(apiCall);
    const tasks = await response.json();
    setTasks(tasks);
  }


  async function addTask() {
    // Check if task name is provided and if it doesn't already exist.
    if (taskName && !tasks.some((task) => task.task === taskName)) {

      // TODO: Support adding todo items to your todo list through the API.
      // In addition to updating the state directly, you should send a request
      // to the API to add a new task and then update the state based on the response.

      // make api call 
      let apiCall = `https://tpeo-todo.vercel.app/tasks`;
      let taskData = {
        "user": currentUser.username,
        "task": taskName,
        "finished": false,
      }
      let apiBody = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      }
      const response = await fetch(apiCall, apiBody);
      const data = await response.json();
      const newID = data.id;
      setTasks([...tasks, { id: newID, task: taskName, finished: false, user: currentUser.username }]);
      setTaskName("");
    } else if (tasks.some((task) => task.task === taskName)) {
      alert("Task already exists!");
    }
  }

  // Function to toggle the 'finished' status of a task.
  async function updateTask(name) {
    setTasks(
      tasks.map((task) =>
        task.task === name ? { ...task, finished: !task.finished } : task
      )
    );

    // TODO: Support removing/checking off todo items in your todo list through the API.
    // Similar to adding tasks, when checking off a task, you should send a request
    // to the API to update the task's status and then update the state based on the response.
    let taskID = "";
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].task === name) {
        taskID = tasks[i].id;
      }
    }
    let apiCall = `https://tpeo-todo.vercel.app/tasks/${taskID}`
    await fetch(apiCall, {method: 'DELETE'});
  }

  // Function to compute a message indicating how many tasks are unfinished.
  function getSummary() {
    const unfinishedTasks = tasks.filter((task) => !task.finished).length;
    return unfinishedTasks === 1
      ? `You have 1 unfinished task`
      : `You have ${unfinishedTasks} tasks left to do`;
  }

  return (
    <>
      <Header />
      <Container component="main" maxWidth="sm">
        {/* Main layout and styling for the ToDo app. */}
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Display the unfinished task summary */}
          <Typography variant="h4" component="div" fontWeight="bold">
            {getSummary()}
          </Typography>
          <Box
            sx={{
              width: "100%",
              marginTop: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Input and button to add a new task */}
            <Grid
              container
              spacing={2}
              alignItems="center"
              justifyContent="center"
            >
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small" // makes the textfield smaller
                  value={taskName}
                  placeholder="Type your task here"
                  onChange={(event) => setTaskName(event.target.value)}
                />
              </Grid>
              <Grid item xs={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={addTask}
                  fullWidth
                >
                  Add
                </Button>
              </Grid>
            </Grid>
            {/* List of tasks */}
            <List sx={{ marginTop: 3 }}>
              {tasks.map((task) => (
                <ListItem
                  key={task.task} 
                  dense
                  onClick={() => updateTask(task.task)}
                >
                  <Checkbox
                    checked={task.finished}
                  />
                  <ListItemText primary={task.task} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </Container>
    </>
  );
}
