import React from 'react';
import '../../pages/Service/ServicesPage.css'
import { Link } from 'react-router-dom';
import { ButtomGet } from '../ButtomGet/ButtomGet';

/* Multi idioma */
import { FormattedMessage } from 'react-intl';

const Service = () => (
    <section className="servicios" id="servicios">
        <h2 className="heading">
            <FormattedMessage
                id='services'
                defaultMessage='Services'
            />
        </h2>
        <div className="row">
            <div className="columns" data-aos="fade-up" data-aos-delay="200">
                <i className="fas fa-brain"></i>
                <h3>
                    <FormattedMessage
                        id='design'
                        defaultMessage='AI/ML'
                    />
                </h3>
                <p>
                    <FormattedMessage
                        id='design-info'
                        defaultMessage='Building and documenting LLM-driven systems, recommendation engines, and machine learning pipelines using PyTorch, TensorFlow, LangChain.'
                    />
                </p>
            </div>
            <div className="columns" data-aos="fade-up" data-aos-delay="300">
                <i className="fas fa-code"></i>
                <h3>
                    <FormattedMessage
                        id='development'
                        defaultMessage='Web Development'
                    />
                </h3>
                <p>
                    <FormattedMessage
                        id='development-info'
                        defaultMessage='Creating well-structured web applications with responsive design, attractive UI, and seamless user interactions using modern frameworks.'
                    />
                </p>
            </div>
            <div className="columns" data-aos="fade-up" data-aos-delay="400">
                <i className="fas fa-project-diagram"></i>
                <h3>
                    <FormattedMessage
                        id='marketing'
                        defaultMessage='DSA'
                    />
                </h3>
                <p>
                    <FormattedMessage
                        id='marketing-info'
                        defaultMessage='Strong foundation in Data Structures and Algorithms, problem-solving, and optimizing code for performance and scalability.'
                    />
                </p>
            </div>
            <div className="columns" data-aos="fade-up" data-aos-delay="500">
                <i className="fas fa-file-alt"></i>
                <h3>
                    <FormattedMessage
                        id='maintenance'
                        defaultMessage='Technical Author'
                    />
                </h3>
                <p>
                    <FormattedMessage
                        id='maintenance-info'
                        defaultMessage='Authoring and maintaining technical documentation covering APIs, system architectures, data pipelines, and operational workflows.'
                    />
                </p>
            </div>
            <div className="columns" data-aos="fade-up" data-aos-delay="600">
                <i className="fas fa-paint-brush"></i>
                <h3>
                    <FormattedMessage
                        id='seo'
                        defaultMessage='Design UX/UI'
                    />
                </h3>
                <p>
                    <FormattedMessage
                        id='seo-info'
                        defaultMessage='Design of attractive interfaces for both web and mobile users, creating intuitive user experiences with modern design principles.'
                    />
                </p>
            </div>
            <div className="columns" data-aos="fade-up" data-aos-delay="700">
                <i className="fas fa-tachometer-alt"></i>
                <h3>
                    <FormattedMessage
                        id='optimization'
                        defaultMessage='Website Optimization'
                    />
                </h3>
                <p>
                    <FormattedMessage
                        id='optimization-info'
                        defaultMessage='Complete optimization of web applications, improving loading speed, performance tuning, SEO optimization, and delivering better user experience.'
                    />
                </p>
            </div>
        </div>
        <div className='portafolio-btn'>
            <Link to="/service">
                <ButtomGet/>
            </Link>
        </div>
    </section>
);

export default React.memo(Service);