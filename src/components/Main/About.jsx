import React from 'react';
import '../../pages/About/AboutPage.css'
import { Link } from 'react-router-dom';
import cv from '../../cv/Rahul_Vinayak_Technical_Author_Developer.pdf';
import { ButtomGet } from '../ButtomGet/ButtomGet';

/* Multi idioma */
import { FormattedMessage } from 'react-intl';

const About = () => (
    <section className="sobre-mi" id="sobre-mi">
        <h2 className="heading">
            <FormattedMessage
                id='about'
                defaultMessage='About me'
            />
        </h2>

        <div className="row container">
            <div className="columns" data-aos="fade-right" data-aos-delay="300">
                <h3>
                    <FormattedMessage
                        id='im'
                        defaultMessage='who I am'
                    />
                </h3>
                <h4>
                    <FormattedMessage
                        id='description'
                        defaultMessage='My name is Rahul Vinayak and I am a Technical Author & Software Engineer.'
                    />
                </h4>
                <p>
                    <FormattedMessage
                        id='my-description'
                        defaultMessage='I have been working on software development for 2+ years. Constantly updating the technologies I already master, but also looking to learn new technologies to enrich my skills and improve my good practices as a developer.'
                    />
                </p>
                <ul>
                    <li>
                        <p>
                            <span>
                                Experience:{" "}
                            </span>
                            2+ Years
                        </p>
                    </li>
                    <li>
                        <p>
                            <span>
                                Role:{" "}
                            </span>
                                Technical Author & Software Engineer
                        </p>
                    </li>
                    <li>
                        <p><span>Email:</span> imransom29@gmail.com</p>
                    </li>
                    <li>
                        <p>
                            <span>
                                <FormattedMessage
                                    id='from'
                                    defaultMessage='From:'
                                />
                            </span>
                            Bengaluru, Karnataka, India
                        </p>
                    </li>
                </ul>
                <div className="mas-info">
                    <a href={cv} target="_blank" rel="noopener noreferrer" download="cv.pdf" className="btn-codigo buttonDownload">
                        <FormattedMessage
                            id='btn-cv'
                            defaultMessage='Download CV'
                        />
                    </a>
                    <div className='mas-info-btn'>
                    <Link to="/about">
                        <ButtomGet/>
                    </Link>
                    </div>
                </div>
            </div>
            <div className="columns col-skill" data-aos="fade-left" data-aos-delay="650">
                <h3>skills</h3>
                <h4>Languages & Frameworks</h4>
                <div className="skill">
                    <div>
                        <img alt="Python" className="icons-skils" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" />
                        <h5>Python</h5>
                    </div>
                    <div>
                        <img alt="Java" className="icons-skils" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" />
                        <h5>Java</h5>
                    </div>
                    <div>
                        <img alt="JavaScript" className="icons-skils" src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-plain.svg" />
                        <h5>JavaScript</h5>
                    </div>
                    <div>
                        <img alt="Scala" className="icons-skils" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scala/scala-original.svg" />
                        <h5>Scala</h5>
                    </div>
                    <div>
                        <img alt="FastAPI" className="icons-skils" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg" />
                        <h5>FastAPI</h5>
                    </div>
                    <div>
                        <img alt="Flask" className="icons-skils" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg" />
                        <h5>Flask</h5>
                    </div>
                    <div>
                        <img alt="PyTorch" className="icons-skils" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg" />
                        <h5>PyTorch</h5>
                    </div>
                    <div>
                        <img alt="TensorFlow" className="icons-skils" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg" />
                        <h5>TensorFlow</h5>
                    </div>
                </div>
                <h4>Cloud & DevOps</h4>
                <div className="skill">
                    <div>
                        <img alt="AWS" className="icons-skils" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" />
                        <h5>AWS</h5>
                    </div>
                    <div>
                        <img alt="Docker" className="icons-skils" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" />
                        <h5>Docker</h5>
                    </div>
                    <div>
                        <img alt="Kubernetes" className="icons-skils" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg" />
                        <h5>Kubernetes</h5>
                    </div>
                    <div>
                        <img alt="Linux" className="icons-skils" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg" />
                        <h5>Linux</h5>
                    </div>
                    <div>
                        <img alt="PostgreSQL" className="icons-skils" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original-wordmark.svg" />
                        <h5>PostgreSQL</h5>
                    </div>
                    <div>
                        <img alt="Kafka" className="icons-skils" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apachekafka/apachekafka-original.svg" />
                        <h5>Kafka</h5>
                    </div>
                    <div>
                        <img alt="Neo4j" className="icons-skils" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/neo4j/neo4j-original.svg" />
                        <h5>Neo4j</h5>
                    </div>
                </div>
                <h4>
                    <FormattedMessage
                        id='tools'
                        defaultMessage='Tools'
                    />
                </h4>
                <div className="skill">
                    <div>
                        <img alt="Git" className="icons-skils" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" title="Git" />
                        <h5>Git</h5>
                    </div>
                    <div>
                        <img alt="GitHub" className="icons-skils" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" title="GitHub" />
                        <h5>GitHub</h5>
                    </div>
                    <div>
                        <img alt="VS Code" className="icons-skils" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" title="VS Code" />
                        <h5>VS Code</h5>
                    </div>
                    <div>
                        <img alt="Grafana" className="icons-skils" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/grafana/grafana-original.svg" title="Grafana" />
                        <h5>Grafana</h5>
                    </div>
                    <div>
                        <img alt="Prometheus" className="icons-skils" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prometheus/prometheus-original.svg" title="Prometheus" />
                        <h5>Prometheus</h5>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

export default React.memo(About);