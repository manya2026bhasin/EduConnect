import React, { useState, useEffect } from 'react';
import '../styles/groupdetails.css';

function GroupDetails({ getEmailFromToken, group_id }) {
    const [group, setGroup] = useState({ name: '', description: '', members: [] });
    useEffect(() => {
        async function fetchDetails() {
            try {
                const response = await fetch(`http://localhost:5000/api/groupdetails?group_id=${encodeURIComponent(group_id)}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch group details');
                }
                const data = await response.json();
                console.log(data);
                setGroup(data);
            }
            catch (error) {
                console.log('Error fetching group details');
            }
        }
        fetchDetails();
    }, [group_id]);
    return (
        <div className='group-details-container'>
            <div className='group-header'>
            <div className='group-name'>{group.name}</div>
            <div className='group-desc'>{group.description}</div>
            </div>
            <div className='group-members'>
                <h3>Members:</h3>
                {group.members.map((member, index) => (
                    <div key={index} className='member'>
                        {member}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default GroupDetails;
