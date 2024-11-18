import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import './App.css';
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
} from 'firebase/firestore';

function App() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const tasksCollectionRef = collection(db, 'tasks');

  // Fetch tasks from Firestore
  useEffect(() => {
    const q = query(tasksCollectionRef, orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setTasks(tasksData);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);



  // Add a new task
  const addTask = async (e) => {
    e.preventDefault();
    if (task.trim() === '') return;

    setIsLoading(true);
    try {
      await addDoc(tasksCollectionRef, {
        name: task,
        completed: false, // Default to not completed
        timestamp: new Date().getTime(), // Add creation time
      });
      setTask('');
    } catch (error) {
      console.error('Error adding task: ', error);
    }
    setIsLoading(false);
  };



  // Delete a task
  const deleteTask = async (id) => {
    try {
      const taskDoc = doc(db, 'tasks', id);
      await deleteDoc(taskDoc);
    } catch (error) {
      console.error('Error deleting task: ', error);
    }
  };



  // Start editing a task
  const startEditing = (task) => {
    setEditingId(task.id);
    setEditingText(task.name);
  };



  // Cancel editing
  const cancelEditing = () => {
    setEditingId(null);
    setEditingText('');
  };



  // Save edited task
  const saveEdit = async (id) => {
    if (editingText.trim() === '') return;

    try {
      const taskDoc = doc(db, 'tasks', id);
      await updateDoc(taskDoc, {
        name: editingText,
        lastEdited: new Date().getTime(),
      });
      setEditingId(null);
      setEditingText('');
    } catch (error) {
      console.error('Error updating task: ', error);
    }
  };


  
  // Toggle task completion
  const toggleComplete = async (id, currentStatus) => {
    try {
      const taskDoc = doc(db, 'tasks', id);
      await updateDoc(taskDoc, { completed: !currentStatus });
    } catch (error) {
      console.error('Error updating task: ', error);
    }
  };

  return (
    <>
      {/* Background Div */}
      <div className="background"></div>
      
      {/* Main Content */}
      <div className="container">
        <div className="card">
          <h1 className="card-title">ToDoEase - Todo</h1>

          <form onSubmit={addTask} className="input-group">
            <input type="text" value={task} onChange={(e) => setTask(e.target.value)} placeholder="Enter a task" disabled={isLoading}/>
            <button type="submit" style={{backgroundColor:"green"}} disabled={isLoading}>Add Task</button>
          </form>

          {isLoading ? (
            <div className="spinner-border" role="status"></div>
          ) : (
            <ul className="list-group">
              {tasks.map((t) => (
                <li key={t.id} className="list-group-item" style={{textDecoration: t.completed ? 'line-through' : 'none',color: t.completed ? 'gray' : 'black',
                  }}>
                  <div className="task-row">
                    {/* Toggle Completion */}
                    <input type="checkbox" checked={t.completed} onChange={() => toggleComplete(t.id, t.completed)}/>

                    {editingId === t.id ? (
                      <div className="input-group">
                        <input type="text" value={editingText} onChange={(e) => setEditingText(e.target.value)} autoFocus/>
                        <button onClick={() => saveEdit(t.id)} style={{backgroundColor:"green"}}>Save</button>
                        <button onClick={cancelEditing} style={{backgroundColor:"#555555"}}>Cancel</button>
                      </div>
                    ) : (
                      <>
                        <span style={{marginLeft:"5px"}}>{t.name}</span>
                        <div className="task-actions">
                          <button onClick={() => startEditing(t)} style={{backgroundColor:"#fcc200"}}>Edit</button>
                          <button onClick={() => deleteTask(t.id)} style={{backgroundColor:"#ed2939"}} >Delete</button>
                        </div>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
