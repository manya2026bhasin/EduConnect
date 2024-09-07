import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/home.css';

function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <section className="home">
        <div className="home-background"></div>
        <div className="home-container">
          <h1>Welcome to <span>EduConnect</span></h1>
          <button onClick={() => navigate('/signup')}>Sign Up</button>
          <button onClick={() => navigate('/login')}>Log In</button>
        </div>
      </section>

      <section className="benefits">
        <h2>Why Choose EduConnect?</h2>
        <div className="benefit-cards">
          <div className="benefit-card">
            <h3>Collaborative Learning</h3>
            <p>Join groups, share resources, and work on projects together.</p>
          </div>
          <div className="benefit-card">
            <h3>File Sharing</h3>
            <p>Seamlessly upload and share study materials with your peers.</p>
          </div>
          <div className="benefit-card">
            <h3>Stay Organized</h3>
            <p>Manage tasks, create to-do lists, and keep track of deadlines.</p>
          </div>
        </div>
      </section>

      <footer>
        <div class="footer-container">
          <div class="footer-column">
            <h3>About EduConnect</h3>
            <p>EduConnect is your go-to platform for collaborative study and knowledge-sharing, empowering students and educators worldwide.</p>
          </div>
          <div class="footer-column">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="#">Home</a></li>
              <li><a href="#">Features</a></li>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>
          <div class="footer-column">
            <h3>Follow Us</h3>
            <div class="social-icons">
              <a href="#"><i class="fab fa-facebook-f"></i></a>
              <a href="#"><i class="fab fa-twitter"></i></a>
              <a href="#"><i class="fab fa-instagram"></i></a>
              <a href="#"><i class="fab fa-linkedin-in"></i></a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2024 EduConnect. All Rights Reserved.</p>
        </div>
      </footer>

    </div>
  );
}

export default Home;
