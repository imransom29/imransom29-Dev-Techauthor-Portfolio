import React from 'react';
import '../../pages/Project/ProjectPage.css'
import { Link } from 'react-router-dom';
import { ButtomGet } from '../ButtomGet/ButtomGet';

/* Multi idioma */
import { FormattedMessage } from 'react-intl';

/* Swiper */
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper";

/* Img */
const proyectImg = require.context('../../img', true);

const Project = () => {
    return (
        <section className="proyectos" id="proyectos">
            <h2 className="heading">
                <FormattedMessage
                    id='projects'
                    defaultMessage='Projects'
                />
            </h2>
            <div className="proyect-site" data-aos="flip-left" data-aos-easing="ease-out-cubic" data-aos-duration="2000">
                <Swiper
                    spaceBetween={30}
                    loop={true}
                    grabCursor={true}
                    centeredSlides={true}
                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                    }}
                    pagination={{
                        clickable: true,
                    }}
                    modules={[Pagination, Autoplay]}
                    breakpoints={{
                        0: {
                            slidesPerView: 1,
                        },
                        768: {
                            slidesPerView: 2,
                        },
                        1024: {
                            slidesPerView: 3,
                        },
                    }}
                    className='proyectos-slider mySwiper'
                >
                    <SwiperSlide className='caja'>
                        <img
                            src={proyectImg(`./proyecto-app-18.png`)}
                            alt='proyectos'

                        />
                        <div className="content">
                            <h3>Log Stream System</h3>
                            <p>
                                Distributed Log Ingestion Service
                            </p>
                            <p className="tecnologias">
                                Python
                                <span> -</span> gRPC
                                <span> -</span> ClickHouse
                                <span> -</span> Kubernetes
                                <span> -</span> Docker
                            </p>
                            <a href="https://github.com/imransom29/logstream-distributed-system" className="custom-btn btn" target="_blank" rel="noopener noreferrer"><span>View</span></a>
                            <a href="https://github.com/imransom29/logstream-distributed-system" className="custom-btn btn-codigo" target="_blank" rel="noopener noreferrer">Repository</a>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide className='caja'>
                        <img
                            src={proyectImg(`./proyecto-14.jpg`)}
                            alt='proyectos'

                        />
                        <div className="content">
                            <h3>DROID-SLAM Jetson</h3>
                            <p>
                                Visual SLAM on Edge Hardware
                            </p>
                            <p className="tecnologias">
                                Python
                                <span> -</span> PyTorch
                                <span> -</span> CUDA
                                <span> -</span> OpenCV
                                <span> -</span> TensorRT
                            </p>
                            <a href="https://github.com/imransom29/Droid-Slam-in-Jetson-AGX-ORIN-Developer-kit" className="custom-btn btn" target="_blank" rel="noopener noreferrer"><span>View</span></a>
                            <a href="https://github.com/imransom29/Droid-Slam-in-Jetson-AGX-ORIN-Developer-kit" className="custom-btn btn-codigo" target="_blank" rel="noopener noreferrer">Repository</a>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide className='caja'>
                        <img
                            src={proyectImg(`./proyecto-app-17.png`)}
                            alt='proyectos'

                        />
                        <div className="content">
                            <h3>Real-Time Kafka Pipeline</h3>
                            <p>
                                Streaming Data Pipeline
                            </p>
                            <p className="tecnologias">
                                Python
                                <span> -</span> Apache Kafka
                                <span> -</span> psutil
                                <span> -</span> Docker
                            </p>
                            <a href="https://github.com/imransom29/Real-Time-Data-Pipeline-Using-Kafka" className="custom-btn btn" target="_blank" rel="noopener noreferrer"><span>View</span></a>
                            <a href="https://github.com/imransom29/Real-Time-Data-Pipeline-Using-Kafka" className="custom-btn btn-codigo" target="_blank" rel="noopener noreferrer">Repository</a>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide className='caja'>
                        <img
                            src={proyectImg(`./proyecto-7.jpg`)}
                            alt='proyectos'
                        />
                        <div className="content">
                            <h3>Insurance Claim AI</h3>
                            <p>
                                LLM-Powered Claims Processing
                            </p>
                            <p className="tecnologias">
                                Python
                                <span> -</span> CrewAI
                                <span> -</span> LangGraph
                                <span> -</span> FastAPI
                                <span> -</span> Streamlit
                            </p>
                            <a href="https://github.com/imransom29/Insurance-Claim-Processing-Automation" className="custom-btn btn" target="_blank" rel="noopener noreferrer"><span>View</span></a>
                            <a href="https://github.com/imransom29/Insurance-Claim-Processing-Automation" className="custom-btn btn-codigo" target="_blank" rel="noopener noreferrer">Repository</a>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide className='caja'>
                        <img
                            src={proyectImg(`./proyecto-6.jpg`)}
                            alt='proyectos'
                        />
                        <div className="content">
                            <h3>Garbage Classification</h3>
                            <p>
                                Deep Learning Waste Sorting
                            </p>
                            <p className="tecnologias">
                                Python
                                <span> -</span> TensorFlow
                                <span> -</span> Keras
                                <span> -</span> OpenCV
                            </p>
                            <a href="https://github.com/imransom29/garbage-classification" className="custom-btn btn" target="_blank" rel="noopener noreferrer"><span>View</span></a>
                            <a href="https://github.com/imransom29/garbage-classification" className="custom-btn btn-codigo" target="_blank" rel="noopener noreferrer">Repository</a>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide className='caja'>
                        <img
                            src={proyectImg(`./proyecto-12.jpg`)}
                            alt='proyectos'
                        />
                        <div className="content">
                            <h3>Gaming Leaderboards</h3>
                            <p>
                                Real-time Player Rankings
                            </p>
                            <p className="tecnologias">
                                Python
                                <span> -</span> FastAPI
                                <span> -</span> Redis
                                <span> -</span> WebSockets
                            </p>
                            <a href="https://github.com/imransom29/Gaming-leaderboards" className="custom-btn btn" target="_blank" rel="noopener noreferrer"><span>View</span></a>
                            <a href="https://github.com/imransom29/Gaming-leaderboards" className="custom-btn btn-codigo" target="_blank" rel="noopener noreferrer">Repository</a>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide className='caja'>
                        <img
                            src={proyectImg(`./proyecto-5.jpg`)}
                            alt='proyectos'
                        />
                        <div className="content">
                            <h3>Communication Aggregator</h3>
                            <p>
                                Microservices Messaging System
                            </p>
                            <p className="tecnologias">
                                TypeScript
                                <span> -</span> RabbitMQ
                                <span> -</span> Elasticsearch
                                <span> -</span> Docker
                            </p>
                            <a href="https://github.com/imransom29/communication-aggregator" className="custom-btn btn" target="_blank" rel="noopener noreferrer"><span>View</span></a>
                            <a href="https://github.com/imransom29/communication-aggregator" className="custom-btn btn-codigo" target="_blank" rel="noopener noreferrer">Repository</a>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide className='caja'>
                        <img
                            src={proyectImg(`./proyecto-8.jpg`)}
                            alt='proyectos'
                        />
                        <div className="content">
                            <h3>3D Agency Portfolio</h3>
                            <p>
                                Immersive 3D Website
                            </p>
                            <p className="tecnologias">
                                TypeScript
                                <span> -</span> Three.js
                                <span> -</span> React Three Fiber
                                <span> -</span> Next.js
                            </p>
                            <a href="https://github.com/imransom29/3d-agency-portfolio" className="custom-btn btn" target="_blank" rel="noopener noreferrer"><span>View</span></a>
                            <a href="https://github.com/imransom29/3d-agency-portfolio" className="custom-btn btn-codigo" target="_blank" rel="noopener noreferrer">Repository</a>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide className='caja'>
                        <img
                            src={proyectImg(`./proyecto-10.jpg`)}
                            alt='proyectos'
                        />
                        <div className="content">
                            <h3>SmartCoach AI</h3>
                            <p>
                                AI-Powered Coaching Platform
                            </p>
                            <p className="tecnologias">
                                TypeScript
                                <span> -</span> React
                                <span> -</span> AI/ML
                                <span> -</span> Next.js
                            </p>
                            <a href="https://github.com/imransom29/SmartCoach-AI" className="custom-btn btn" target="_blank" rel="noopener noreferrer"><span>View</span></a>
                            <a href="https://github.com/imransom29/SmartCoach-AI" className="custom-btn btn-codigo" target="_blank" rel="noopener noreferrer">Repository</a>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide className='caja'>
                        <img
                            src={proyectImg(`./proyecto-9.jpg`)}
                            alt='proyectos'
                        />
                        <div className="content">
                            <h3>Network Diagnostics</h3>
                            <p>
                                CLI Network Troubleshooting
                            </p>
                            <p className="tecnologias">
                                Go
                                <span> -</span> CLI
                                <span> -</span> Networking
                            </p>
                            <a href="https://github.com/imransom29/network-diagnostics-troubleshooting-toolkit" className="custom-btn btn" target="_blank" rel="noopener noreferrer"><span>View</span></a>
                            <a href="https://github.com/imransom29/network-diagnostics-troubleshooting-toolkit" className="custom-btn btn-codigo" target="_blank" rel="noopener noreferrer">Repository</a>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide className='caja'>
                        <img
                            src={proyectImg(`./proyecto-11.jpg`)}
                            alt='proyectos'
                        />
                        <div className="content">
                            <h3>Appointment Agent</h3>
                            <p>
                                AI Scheduling Assistant
                            </p>
                            <p className="tecnologias">
                                Python
                                <span> -</span> AI/ML
                                <span> -</span> FastAPI
                            </p>
                            <a href="https://github.com/imransom29/appointment-scheduling-agent" className="custom-btn btn" target="_blank" rel="noopener noreferrer"><span>View</span></a>
                            <a href="https://github.com/imransom29/appointment-scheduling-agent" className="custom-btn btn-codigo" target="_blank" rel="noopener noreferrer">Repository</a>
                        </div>
                    </SwiperSlide>
                </Swiper>
                <div className="swiper-pagination"></div>
            </div>
            {/* <Link className="custom-btn btn-codigo portafolio-btn" to="/project">
                <FormattedMessage
                    id='btn-more-projects'
                    defaultMessage='More projects'
                />
            </Link> */}
            <div className='portafolio-btn'>
                <Link to="/project">
                    <ButtomGet/>
                </Link>
            </div>
        </section>

    )
};
export default React.memo(Project);