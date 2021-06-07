import { useState } from 'react';
import { useEffect } from 'react';
import Todo from './components/Todo';
import Form from './components/Form';
import FilterButton from './components/FilterButton';
import axios from 'axios';

const FILTER_MAP = {
  All: () => true,
  Active: task => !task.completed,
  Completed: task => task.completed
};

const FILTER_NAMES = Object.keys(FILTER_MAP);

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const getData = async () => {
      try {
        const todos = await getTodos();
        setTasks(todos);
      } catch (error) {
        console.log(error);
      }
    }
    getData();
  }, []);

   const getTodos = async () => {
    const res = await axios.get('https://doyou-todo.herokuapp.com/getposts');
    try {
      const data = await res.data;
      return data;
    } catch (error) {
      console.log(error)
    }
  };

  const toggleTaskCompleted = (id) => {
    const updatedTasks = tasks.map( task => {
      if (id === task._id) {
        return {...task, completed : !task.completed}
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  const deleteTask = (id) => {
    axios.delete(`/delete/${id}`);
    const remainingTasks = tasks.filter(task => id !== task._id);
    setTasks(remainingTasks)
  };

  const editTask = (id, newName) => {
    const editedTaskList = tasks.map(task => {
      if (id === task._id) {
        return {...task, name: newName}
      }
      return task;
    });
    setTasks(editedTaskList)
  }

const addTask = async (task) => {
  await axios.post('/posts', {
    name: task
    }
  );

  const posts = await axios.get('https://doyou-todo.herokuapp.com/getposts');
  const data = await posts.data;
  
  setTasks(data)
}

  const taskList = tasks
.filter(FILTER_MAP[filter])
.map(task => (
  <Todo
    id={task._id}
    name={task.name}
    completed={task.completed}
    key={task._id}
    toggleTaskCompleted={toggleTaskCompleted}
    deleteTask={deleteTask}
    editTask={editTask}
  />
));

  const filterList = FILTER_NAMES.map(name => (<FilterButton key={name} name={name} isPressed={name === filter} setFilter={setFilter} />));

  const tasksNoun =  taskList.length !== 1 ? 'tasks' : 'task';
  const headingText = `${taskList.length} ${tasksNoun} remaining`;

  return (
    <div className="todoapp stack-large">
      <h1>Todo App</h1>
      <Form addTask={addTask} />
      <div className="filters btn-group stack-exception">
        {filterList}
      </div>
      <h2 id="list-heading">
        {headingText}
      </h2>
      <ul
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading"
      >
        {taskList}
      </ul>
    </div>
  );
}

export default App;
