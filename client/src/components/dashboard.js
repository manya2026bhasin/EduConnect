import React, { useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode'; // Correct import for jwt-decode
import { useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';
import axios from 'axios';

function Dashboard() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [groupForm, setGroupForm] = useState({
    groupname: '',
    groupdescription: '',
    members: [] // Array to store the emails of members
  });
  const [newMemberEmail, setNewMemberEmail] = useState('');

  const togglePopup = () => {
    setPopupVisible(!isPopupVisible);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGroupForm(prevForm => ({
      ...prevForm,
      [name]: value
    }));
  };

  const handleMemberEmailChange = (e) => {
    setNewMemberEmail(e.target.value);
  };

  const addMember = async () => {
    if (newMemberEmail.trim() !== '') {
      try {
        // Make a request to the backend to check if the email exists
        const response = await fetch(`http://localhost:5000/api/checkUser?email=${encodeURIComponent(newMemberEmail)}`);
        const data = await response.json();
  
        if (data.exists) {
          // Email exists, add the member to the form
          setGroupForm(prevForm => ({
            ...prevForm,
            members: [...prevForm.members, newMemberEmail]
          }));
          setNewMemberEmail(''); // Clear the input field after adding the member
        } else {
          // Email does not exist, show an alert or error
          alert('Email does not exist in the system');
        }
      } catch (error) {
        console.error('Error checking email:', error);
        alert('Error checking email. Please try again.');
      }
    }
  };  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = getEmailFromToken(); // Get the user email from the token

    try {
      await axios.post('http://localhost:5000/api/groups', {
        name: groupForm.groupname,
        description: groupForm.groupdescription,
        members: [email, ...groupForm.members] // Include the creator and added members
      });

      // Refresh the group list after adding the new group
      fetchGroups();
      togglePopup(); // Close popup after successful submission
    } catch (error) {
      console.error('Error creating group:', error);
      alert('Error creating group. Please try again.');
    }
  };

  function getEmailFromToken() {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const decodedToken = jwtDecode(token);
      return decodedToken.email; // Assuming the email is in the payload
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  }

  const fetchGroups = async () => {
    try {
      const email = getEmailFromToken();
      const response = await fetch(`http://localhost:5000/api/emailgroups?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      setGroups(data);
    } catch (error) {
      console.error('Error fetching groups:', error);
      alert('Error fetching groups. Please try again.');
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <div className="dashboard">
      <div className='dashboard-header'>
        <div className='logo'>Educonnect</div>
        <div className='header'>Your Study Groups</div>
        </div>
      <div className="group-list">
        {groups.map(group => (
          <div key={group.id} className="group-card">
            <h3>{group.gname}</h3>
            <p>{group.description}</p>
            <button onClick={() => window.location.href = `/group/${group.id}`}>
              Enter Group
            </button>
          </div>
        ))}
      </div>
      <button className="add-button" onClick={togglePopup}>
        Create Group
      </button>
      {isPopupVisible && (
        <div className="side-popup">
          <button className="close-button" onClick={togglePopup}>X</button>
          <h2>Create New Group</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Group Name:
              <input
                type="text"
                name="groupname"
                value={groupForm.groupname}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Description:
              <textarea
                name="groupdescription"
                value={groupForm.groupdescription}
                onChange={handleInputChange}
                required
              />
            </label>

            <h3>Members</h3>
            <ul>
              {groupForm.members.map((member, index) => (
                <li key={index}>{member}</li>
              ))}
            </ul>

            <label>
              Add Member:
              <input
                type="email"
                value={newMemberEmail}
                onChange={handleMemberEmailChange}
                placeholder="Enter member email"
              />
            </label>
            <button type="button" onClick={addMember}>
              Add Member
            </button>

            <button type="submit">Create Group</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
