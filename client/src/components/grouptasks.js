import React, { useState, useEffect } from 'react';
import '../styles/grouptasks.css';
import Replies from './replies';
import axios from 'axios';

function GroupTasks({ getEmailFromToken, group_id }) {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({ title: '', contents: '' });
    const currentUser = getEmailFromToken();

    useEffect(() => {
        async function fetchTasks() {
            try {
                const response = await axios.get(`http://localhost:5000/api/groupTasks?group_id=${encodeURIComponent(group_id)}`);
                if (response.status === 200) {
                    const data = response.data;
                    console.log(data);
                    setTasks(data);
                }
            } catch (error) {
                console.error('Error fetching group tasks:', error);
            }
            console.log('getting tasks');
        }
        fetchTasks();
    }, [group_id]);

    async function handleAddTask(e) {
        e.preventDefault();
        const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
        if (newTask.title && newTask.contents) {
            try {
                const response = await axios.post('http://localhost:5000/api/groupTasks', {
                    ...newTask,
                    group_id,
                    created_at: date,
                    author: currentUser
                });
                setTasks([...tasks, response.data]);
                console.log(tasks);
                setNewTask({ title: '', contents: '' });
            } catch (error) {
                console.error('Error adding task:', error);
            }
        }
    }

    return (
        <div>
        <div className='group-tasks'>
            <h2>Discussion Box</h2>
            
            <div className='add-task'>
                <form onSubmit={handleAddTask}>
                    <input
                        type="text"
                        placeholder="Topic"
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    />
                    <textarea
                        placeholder="Description"
                        value={newTask.contents}
                        onChange={(e) => setNewTask({ ...newTask, contents: e.target.value })}
                    />
                    <button type="submit">Add Task</button>
                </form>
            </div>
        </div>

        {tasks.map((task) => (
                <div key={task.id} className="task">
                    <h3>{task.title}</h3>
                    <p>{task.contents}</p>
                </div>
            ))}
        </div>
    );
}

export default GroupTasks;
