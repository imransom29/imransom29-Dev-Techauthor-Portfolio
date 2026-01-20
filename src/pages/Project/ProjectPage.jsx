import React from 'react'
import './ProjectPage.css';

/* Componet */
import HeaderPage from '../../components/Header/HeaderPage';
import Footer from '../../components/Footer/Footer';
import ParticleBackground from "../../components/ParticlesBg/ParticleBackground";
import ScrollToTop from '../../components/ScrollToTop/ScrollToTop';

/* Multi idioma */
import { FormattedMessage } from 'react-intl';

/* Project Images */
const proyectsImg = require.context('../../img', true);

const githubProjects = [
  {
    name: "LogStream Distributed System",
    repo: "logstream-distributed-system",
    description: "A distributed log streaming system for real-time data processing",
    tech: ["Python", "Kafka", "Docker"],
    img: "./log_stream_distributed_system_image.jpeg"
  },
  {
    name: "Droid-SLAM Jetson AGX ORIN",
    repo: "Droid-Slam-in-Jetson-AGX-ORIN-Developer-kit",
    description: "SLAM implementation on NVIDIA Jetson AGX ORIN Developer Kit",
    tech: ["Python", "CUDA", "ROS"],
    img: "./Droiod-slam-jetson-AGX.jpg"
  },
  {
    name: "Real-Time Data Pipeline",
    repo: "Real-Time-Data-Pipeline-Using-Kafka",
    description: "Real-time data pipeline using Apache Kafka for stream processing",
    tech: ["Python", "Kafka", "Docker"],
    img: "./Real-Time Data Pipeline Using-Kafka.png"
  },
  {
    name: "Customer Support System",
    repo: "Customer-Support-Ticketing-Knowledge-Base-System",
    description: "AI-powered customer support ticketing and knowledge base system",
    tech: ["Python", "FastAPI", "LangChain"],
    img: "./Customer-Support-Ticketing-Knowledge-Base-System.png"
  },
  {
    name: "Network Diagnostics Toolkit",
    repo: "network-diagnostics-troubleshooting-toolkit",
    description: "Comprehensive toolkit for network diagnostics and troubleshooting",
    tech: ["Python", "Bash", "Linux"],
    img: "./network-diagnostics-troubleshooting-toolkit.jpg"
  },
  {
    name: "Splunk Dashboards",
    repo: "Splunk-dashboards",
    description: "Custom Splunk dashboards for monitoring and analytics",
    tech: ["Splunk", "SPL", "XML"],
    img: "./Splunk-dashboard.png"
  },
  {
    name: "Insurance Claim Automation",
    repo: "Insurance-Claim-Processing-Automation",
    description: "Automated insurance claim processing system",
    tech: ["Python", "ML", "FastAPI"],
    img: "./Insurance-Claim-Processing-Automation.jpg"
  },
  {
    name: "Appointment Scheduling Agent",
    repo: "appointment-scheduling-agent",
    description: "AI-powered appointment scheduling agent",
    tech: ["Python", "LangChain", "OpenAI"],
    img: "./appointment-scheduling-agent.png"
  },
  {
    name: "Communication Aggregator",
    repo: "communication-aggregator",
    description: "Multi-channel communication aggregation platform",
    tech: ["Python", "FastAPI", "Redis"],
    img: "./Communication-aggregator -system.png"
  },
  {
    name: "SmartCoach AI",
    repo: "SmartCoach-AI",
    description: "AI-powered coaching and training assistant",
    tech: ["Python", "TensorFlow", "FastAPI"],
    img: "./Smart-coach.png"
  },
  {
    name: "Garbage Classification",
    repo: "garbage-classification",
    description: "ML-based garbage classification system for waste management",
    tech: ["Python", "PyTorch", "OpenCV"],
    img: "./garbage-classification.png"
  },
  {
    name: "3D Agency Portfolio",
    repo: "3d-agency-portfolio",
    description: "Modern 3D portfolio website for agencies",
    tech: ["React", "Three.js", "CSS"],
    img: "./3d-agency picture.png"
  },
  {
    name: "Gaming Leaderboards",
    repo: "Gaming-leaderboards",
    description: "Real-time gaming leaderboard system",
    tech: ["Python", "Redis", "FastAPI"],
    img: "./gaming-leaderboard.jpg"
  },
  {
    name: "Secret Santa Game",
    repo: "Secret-Santa-Game",
    description: "Fun Secret Santa gift exchange organizer",
    tech: ["JavaScript", "React", "Node.js"],
    img: "./Secret-santa.jpeg"
  }
];

const Project = () => {
  return (
    <div>
      <HeaderPage />
      <ParticleBackground />

      <main>
        <section className="proyectos mas-proyect" id="proyectos">
          <h1 className="heading" data-section="Nav" data-value="projects">
            <FormattedMessage
              id='projects'
              defaultMessage='Projects'
            />
          </h1>
          <p style={{textAlign: 'center', color: '#ccc', marginBottom: '2rem'}}>
            View all my projects on GitHub
          </p>
        </section>

        <section className="github-projects-grid">
          {githubProjects.map((project, index) => (
            <a 
              key={index}
              href={`https://github.com/imransom29/${project.repo}`}
              target="_blank"
              rel="noreferrer"
              className="github-project-card"
            >
              <div className="github-card-img">
                <img src={proyectsImg(project.img)} alt={project.name} />
              </div>
              <div className="github-card-content">
                <div className="github-card-header">
                  <svg height="20" width="20" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"/>
                  </svg>
                  <span className="github-card-title">{project.name}</span>
                </div>
                <p className="github-card-desc">{project.description}</p>
                <div className="github-card-tech">
                  {project.tech.map((t, i) => (
                    <span key={i} className="tech-tag">{t}</span>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </section>
      </main>

      <ScrollToTop />
      <Footer />
    </div>
  )
}

export default Project;
