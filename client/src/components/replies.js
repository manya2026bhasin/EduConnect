import React, { useState, useEffect } from 'react';
import '../styles/replies.css';

function Replies({ task_id, group_id, getEmailFromToken }) {
    const [replies, setReplies] = useState([]);
    const [newReply, setNewReply] = useState('');
    const currentUser = getEmailFromToken();

    useEffect(() => {
        async function fetchReplies() {
            // try {
            //     const response = await fetch(`http://localhost:5000/api/taskreplies?task_id=${task_id}`);
            //     if (!response.ok) throw new Error('Failed to fetch replies.');
            //     const data = await response.json();
            //     setReplies(data);
            // } catch (error) {
            //     console.error('Error fetching replies:', error);
            // }
            console.log('fetching replies');
        }
        fetchReplies();
    }, [task_id]);

    async function handleAddReply(e) {
        e.preventDefault();
        if (newReply) {
            // try {
            //     const response = await fetch('http://localhost:5000/api/replies', {
            //         method: 'POST',
            //         headers: { 'Content-Type': 'application/json' },
            //         body: JSON.stringify({
            //             task_id,
            //             group_id,
            //             author: currentUser,
            //             reply_text: newReply,
            //         }),
            //     });

            //     if (!response.ok) throw new Error('Failed to add reply.');

            //     setReplies([...replies, { author: currentUser, reply_text: newReply }]);
            //     setNewReply('');
            // } catch (error) {
            //     console.error('Error adding reply:', error);
            // }
            console.log('adding replies');
        }
    }

    return (
        <div className='replies'>
            {replies.map((reply, index) => (
                <div key={index} className='reply'>
                    <p>
                        <strong>{reply.author}:</strong> {reply.reply_text}
                    </p>
                </div>
            ))}
            <form onSubmit={handleAddReply}>
                <textarea
                    placeholder="Your solution..."
                    value={newReply}
                    onChange={(e) => setNewReply(e.target.value)}
                />
                <button type="submit">Reply</button>
            </form>
        </div>
    );
}

export default Replies;
