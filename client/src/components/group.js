import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import '../styles/group.css'; // Add a CSS file for styling

const Group = () => {
  const { id } = useParams();
  const [groupDetails, setGroupDetails] = useState([]);
  const [activeFeature, setActiveFeature] = useState('chat'); // Set default to 'chat'

  function getEmailFromToken() {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const decodedToken = jwtDecode(token);
      return decodedToken.email;
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  }

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const email = getEmailFromToken();
        const response = await axios.get(`http://localhost:5000/api/groups/details?groupId=${encodeURIComponent(id)}`);
        setGroupDetails(response.data.group);
      } catch (error) {
        console.error('Error fetching group details:', error);
        alert('Error fetching group details. Please try again.');
      }
    };
    fetchGroupDetails();
  }, [id]);

  const renderFeatureContent = () => {
    switch (activeFeature) {
      case 'chat':
        return <div className="chat-box">Chat Feature Coming Soon</div>;
      case 'files':
        return <div className="files-box">File Sharing Coming Soon</div>;
      case 'todo':
        return <div className="todo-box">To-Do List Coming Soon</div>;
      default:
        return null;
    }
  };

  return (
    <div className="group-page">
      <div className="sidebar">
        <div className="sidebar-option" onClick={() => setActiveFeature('chat')}>
          Chat
        </div>
        <div className="sidebar-option" onClick={() => setActiveFeature('files')}>
          Files
        </div>
        <div className="sidebar-option" onClick={() => setActiveFeature('todo')}>
          To-Do List
        </div>
      </div>
      <div className="group-content">
        <h2>{groupDetails.name}</h2>
        <p>{groupDetails.description}</p>
        {renderFeatureContent()}
      </div>
    </div>
  );
};

export default Group;
