import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import '../styles/todolist.css';

function Todolist({ getEmailFromToken, group_id }) {
    const [form, setForm] = useState({ task: '', email: '' });
    const [listItems, setListItems] = useState([]);
    const currentUser = getEmailFromToken();

    useEffect(() => {
        async function fetchTasks() {
            try {
                const response = await fetch(`http://localhost:5000/api/authortasks?author=${encodeURIComponent(currentUser)}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch to do list');
                }
                const data = await response.json();
                setListItems(data);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        }
        fetchTasks();
    }, [currentUser]);

    async function handleSubmit(e) {
        e.preventDefault();
        if (form.task !== '') {
            const newTask = { ...form, email: currentUser };
            try {
                await axios.post('http://localhost:5000/api/tasks', newTask);
                setListItems([...listItems, newTask]);
                setForm({ task: '', email: '' });
            } catch (error) {
                console.error('Error adding task:', error);
            }
        }
    }

    function handleTask(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    }

    async function deleteTask(id) {
        try {
            await axios.delete(`http://localhost:5000/api/tasks/${id}`);
            setListItems(listItems.filter(item => item.id !== id));
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    }

    return (
        <div>
            <div className='to-do-list'>
                <div className='heading'>To Do List</div>
                <div className='to-do-item'>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="task"
                            value={form.task}
                            onChange={handleTask}
                            placeholder="Add a new task"
                            required
                        />
                        <button type='submit'>Add</button>
                    </form>
                </div>
                <div className='list-items'>
                    {listItems.map((item) => (
                        <div key={item.id} className='list-item'>
                            <span>{item.task}</span>
                            <p onClick={() => deleteTask(item.id)} ><FontAwesomeIcon icon={faTrash} /></p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Todolist;
