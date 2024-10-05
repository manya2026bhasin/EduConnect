import React, { useState, useEffect } from 'react';
import '../styles/grouptasks.css';
import Replies from './replies';

function GroupTasks({ getEmailFromToken,group_id }) {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({ task_name: '', task_description: '' });
    const currentUser = getEmailFromToken();

    useEffect(() => {
        async function fetchTasks() {
            // try {
            //     const response = await fetch(`http://localhost:5000/api/grouptasks?group=${group_id}`);
            //     if (!response.ok) throw new Error('Failed to fetch group tasks.');
            //     const data = await response.json();
            //     setTasks(data);
            // } catch (error) {
            //     console.error('Error fetching tasks:', error);
            // }
            console.log('getting tasks');
        }
        fetchTasks();
    }, [group_id]);

    async function handleAddTask(e) {
        e.preventDefault();
        if (newTask.task_name && newTask.task_description) {
            // try {
            //     const response = await fetch('http://localhost:5000/api/grouptasks', {
            //         method: 'POST',
            //         headers: { 'Content-Type': 'application/json' },
            //         body: JSON.stringify({ 
            //             group_id, 
            //             task_name: newTask.task_name, 
            //             task_description: newTask.task_description 
            //         }),
            //     });

            //     if (!response.ok) throw new Error('Failed to add task.');

            //     // Update the state with the new task
            //     setTasks([...tasks, newTask]);
            //     setNewTask({ task_name: '', task_description: '' });
            // } catch (error) {
            //     console.error('Error adding task:', error);
            // }
            console.log('add task');
        }
    }

    return (
        <div className='group-tasks'>
            <h2>Group Tasks</h2>
            {tasks.map((task) => (
                <div key={task.id} className="task">
                    <h3>{task.task_name}</h3>
                    <p>{task.task_description}</p>
                    <Replies task_id={task.id} group_id={group_id} />
                </div>
            ))}
            <div className='add-task'>
                <form onSubmit={handleAddTask}>
                    <input
                        type="text"
                        placeholder="Task Name"
                        value={newTask.task_name}
                        onChange={(e) => setNewTask({ ...newTask, task_name: e.target.value })}
                    />
                    <textarea
                        placeholder="Task Description"
                        value={newTask.task_description}
                        onChange={(e) => setNewTask({ ...newTask, task_description: e.target.value })}
                    />
                    <button type="submit">Add Task</button>
                </form>
            </div>
        </div>
    );
}

export default GroupTasks;
