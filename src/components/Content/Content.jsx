import React from 'react';
import './Content.css';
import ParticleHeaderBg from '../ParticlesBg/ParticlesHeader/ParticleHeaderBg';

/* ReactScroll */
import { Link } from 'react-scroll';

/* Multi idioma */
import { FormattedMessage } from 'react-intl';

const Content = () => (
    <div className="contenido">
        <ParticleHeaderBg/>
        <section className="inicio" id="inicio">
        
            <div className="titulo">
            
                <p data-aos="fade-up" data-aos-delay="600">
                    <FormattedMessage
                        id='greeting'
                        defaultMessage='Hello'
                    />
                </p>
                <h1 data-aos="fade-up" data-aos-delay="800">
                    <FormattedMessage
                        id='name'
                        defaultMessage='I am Rahul Vinayak'
                    />
                </h1>
                <p data-aos="fade-up" data-aos-delay="1000">
                    <FormattedMessage
                        id='rol'
                        defaultMessage='Software Developer and Technical Author'
                    />
                </p>

                <div className="redes-sociales">
                    <a href="https://www.linkedin.com/in/imransom29/" target="_blank" rel="noopener noreferrer" data-aos="fade-up" data-aos-delay="1200"><i className="fab fa-linkedin"></i></a>
                    <a href="https://github.com/imransom29" target="_blank" rel="noopener noreferrer" data-aos="fade-up" data-aos-delay="1400"><i className="fab fa-github"></i></a>
                    <a href="mailto:imransom29@gmail.com" target="_blank" rel="noopener noreferrer" data-aos="fade-up" data-aos-delay="1600"><i className="fas fa-envelope"></i></a>
                    <a href="https://api.whatsapp.com/send?phone=918949489399" target="_blank" rel="noopener noreferrer" data-aos="fade-up" data-aos-delay="1800"><i className="fab fa-whatsapp"></i></a>
                </div>
                <div className="wrapper">
                    <a className="button" href="https://www.linkedin.com/in/imransom29/" target="_blank" rel="noopener noreferrer" data-aos="fade-up" data-aos-delay="1200">
                        <div className="icon">
                            <i className="fab fa-linkedin"></i>
                        </div>
                        <span>LinkedIn</span>
                    </a>
                    <a className="button" href="https://github.com/imransom29" target="_blank" rel="noopener noreferrer" data-aos="fade-up" data-aos-delay="1400">
                        <div className="icon">
                            <i className="fab fa-github"></i>
                        </div>
                        <span>GitHub</span>
                    </a>
                    <a className="button" href="mailto:imransom29@gmail.com" target="_blank" rel="noopener noreferrer" data-aos="fade-up" data-aos-delay="1600">
                        <div className="icon">
                            <i className="fas fa-envelope"></i>
                        </div>
                        <span>Email</span>
                    </a>
                    <a className="button" href="https://api.whatsapp.com/send?phone=918949489399" target="_blank" rel="noopener noreferrer" data-aos="fade-up" data-aos-delay="1800">
                        <div className="icon">
                            <i className="fab fa-whatsapp"></i>
                        </div>
                        <span>WhatsApp</span>
                    </a>
                </div>

                <Link to="sobre-mi" href="#sobre-mi">
                    <div className="scroll-down"></div>
                </Link>
            </div>
        </section>
    </div>
);

export default Content;