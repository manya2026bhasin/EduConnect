import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import Chats from './chats';
import GroupTasks from './grouptasks';
import Todolist from './todolist';
import GroupDetails from './groupdetails';
import '../styles/group.css'; // Add a CSS file for styling

const Group = () => {
  const { id } = useParams();
  const [groupDetails, setGroupDetails] = useState([]);
  const [activeFeature, setActiveFeature] = useState('chat'); // Set default to 'chat'
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
        return <Chats getEmailFromToken={getEmailFromToken} group_id={id}/>;
      case 'Group Tasks':
        return <GroupTasks getEmailFromToken={getEmailFromToken} group_id={id}/>;
      case 'todo':
        return <Todolist getEmailFromToken={getEmailFromToken} group_id={id}/>
      case 'details':
        return <GroupDetails getEmailFromToken={getEmailFromToken} group_id={id}/>
      default:
        return null;
    }
  };

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen); // Toggle the sidebar state
  };

  return (
    <div className="group-page">
      {/* Hamburger Menu Button for small screens */}
      <button className="hamburger-button" onClick={handleSidebarToggle}>
        ☰
      </button>
       {/* Sidebar Component */}
      <div className={`sidebar ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-option" onClick={() => setActiveFeature('chat')}>
          Chat
        </div>
        <div className="sidebar-option" onClick={() => setActiveFeature('Group Tasks')}>
          Group Tasks
        </div>
        <div className="sidebar-option" onClick={() => setActiveFeature('todo')}>
          To-Do List
        </div>
        <div className="sidebar-option" onClick={() => setActiveFeature('details')}>
          Group details
        </div>
        {/* Slider Button */}
        <button className={`${isSidebarOpen ? 'slider-button' : 'slider-button-invisible'}`} onClick={() => setIsSidebarOpen(false)} >
        &lt;
        </button>
      </div>
      <div className="group-content">
        {renderFeatureContent()}
      </div>
    </div>
  );
};

export default Group;
