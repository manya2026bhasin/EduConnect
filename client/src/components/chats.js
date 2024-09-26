import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/chats.css'; // Add a CSS file for styling

function Chats({ getEmailFromToken, group_id }) {
    const [form, setForm] = useState({ message: '', email: '', createdat: '', group_id: group_id });
    const [chats, setChats] = useState([]);
    const user_email = getEmailFromToken();
    // Fetch chats when the component mounts
    useEffect(() => {
        async function fetchChats() {
            try {
                const response = await fetch(`http://localhost:5000/api/groupchats?group_id=${encodeURIComponent(group_id)}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch group chats');
                }
                const data = await response.json();
                console.log(data);
                setChats(data);
            } catch (error) {
                console.error('Error fetching chats:', error);
            }
        }

        fetchChats();
    }, [group_id]);

    // Handles input changes
    function handleMessage(e) {
        setForm({
            ...form,
            message: e.target.value, // Change to `message` to match the form state
        });
    }

    // Handles form submission
    async function handleSubmit(e) {
        e.preventDefault(); // Prevent the form from reloading the page
        const date = new Date().toISOString().slice(0, 19).replace('T', ' ');

        const newMessage = {
            ...form,
            email: user_email,
            createdat: date,
            group_id: group_id,
        };

        if (newMessage.message !== '') {
            try {
                await axios.post('http://localhost:5000/api/chats', newMessage);

                // Fetch updated chats after submission
                const response = await fetch(`http://localhost:5000/api/groupchats?group_id=${encodeURIComponent(group_id)}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch group chats');
                }
                const data = await response.json();
                setChats(data);

                // Clear the form after successful submission
                setForm({ message: '', email: '', createdat: '', group_id: group_id });
            } catch (error) {
                console.error('Error sending data:', error);
                alert('Error adding message. Please try again.');
            }
        }
    }

    return (
        <div>
            <div className='chats-section'>
                {chats.map((chat) => (
                    <div
                        key={chat.id}
                        className={`chat ${chat.email === user_email ? 'user-chats' : 'other-chats'}`}
                    >
                        <span className='chat_message'>{chat.message}</span>
                        <p>{chat.email}</p>
                        <p>{chat.createdat}</p>
                    </div>
                ))}
            </div>
            <div className='add-chat'>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="message" // Change name to "message" to match form state
                        value={form.message}
                        onChange={handleMessage}
                        required
                    />
                    <button type='submit'>Send</button>
                </form>
            </div>
        </div>
    );
}

export default Chats;
