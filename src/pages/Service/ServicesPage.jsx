import React from 'react';
import './ServicesPage.css'

/* Componet */
import HeaderPage from '../../components/Header/HeaderPage';
import Footer from '../../components/Footer/Footer';
import ParticleBackground from "../../components/ParticlesBg/ParticleBackground";
import ScrollToTop from '../../components/ScrollToTop/ScrollToTop';
import Accordion from './Accordion'


/* Multi idioma */
import { FormattedMessage } from 'react-intl';

const Services = () => {
  return (
    <div>

      <HeaderPage />

      <ParticleBackground />

      <main className="service-page">
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
    </section>

        <section className="site-services">
          <h2 className="heading">
            <FormattedMessage
              id='services-price'
              defaultMessage='Price'
            />
          </h2>
          <div className="row">
            <div className="columns" data-aos="fade-up" data-aos-delay="200">
              <h3>
                <FormattedMessage
                  id='services-info-title-1'
                  defaultMessage='Essential'
                />
              </h3>
              <h4 className="sub-title">
                <FormattedMessage
                  id='services-info-sub-title-1'
                  defaultMessage='Perfect for new businesses'
                />
              </h4>
              <p className="numero"><span>$</span>150</p>
              <ul className="ul-cards-services">
                <li>
                  <i className="fas fa-check"></i>
                  <span >
                    <FormattedMessage
                      id='services-info-1-p1'
                      defaultMessage='1 responsive page'
                    />
                  </span>
                </li>
                <li>
                  <i className="fas fa-check"></i>
                  <span>
                    <FormattedMessage
                      id='services-info-p2'
                      defaultMessage='+3 sections for page'
                    />
                  </span>
                </li>
                <li>
                  <i className="fas fa-check"></i>
                  <span>
                    <FormattedMessage
                      id='services-info-p3'
                      defaultMessage='Contact Form'
                    />
                  </span>
                </li>
                <li>
                  <i className="fas fa-check"></i>
                  <span>
                    <FormattedMessage
                      id='services-info-p4'
                      defaultMessage='Domain for 1 year'
                    />
                  </span>
                </li>
                <li>
                  <i className="fas fa-check"></i>
                  <span>
                    <FormattedMessage
                      id='services-info-p5'
                      defaultMessage='Hosting for 1 year'
                    />
                  </span>
                </li>
                <li>
                  <i className="fas fa-check"></i>
                  <span>
                    <FormattedMessage
                      id='services-info-1-p6'
                      defaultMessage='Delivered in 5 business days'
                    />
                  </span>
                </li>
              </ul>
              {/* <div className='portafolio-btn'>
                <a href="#" className="custom-btn btn-codigo">
                  <FormattedMessage
                    id='services-buy'
                    defaultMessage='buy now'
                /></a>
              </div> */}
            </div>
            <div className="columns recomendado" data-aos="fade-up" data-aos-delay="300">
              <h3>
                <FormattedMessage
                  id='services-info-title-2'
                  defaultMessage='Professional'
                />
              </h3>
              <h4 className="sub-title">
                <FormattedMessage
                  id='services-info-sub-title-2'
                  defaultMessage='Designed for medium businesses'
                />
              </h4>
              <p className="numero"><span>$</span>400</p>
              <ul className="ul-cards-services">
                <li>
                  <i className="fas fa-check"></i>
                  <span>
                    <FormattedMessage
                      id='services-info-2-p1'
                      defaultMessage='5 responsive page'
                    />
                  </span>
                </li>
                <li>
                  <i className="fas fa-check"></i>
                  <span>
                    <FormattedMessage
                      id='services-info-p2'
                      defaultMessage='+3 sections for page'
                    />
                  </span>
                </li>
                <li>
                  <i className="fas fa-check"></i>
                  <span>
                    <FormattedMessage
                      id='services-info-p3'
                      defaultMessage='Contact Form'
                    />
                  </span>
                </li>
                <li>
                  <i className="fas fa-check"></i>
                  <span>
                    <FormattedMessage
                      id='services-info-p4'
                      defaultMessage='Domain for 1 year'
                    />
                  </span>
                </li>
                <li>
                  <i className="fas fa-check"></i>
                  <span>
                    <FormattedMessage
                      id='services-info-p5'
                      defaultMessage='Hosting for 1 year'
                    />
                  </span>
                </li>
                <li>
                  <i className="fas fa-check"></i>
                  <span>
                    <FormattedMessage
                      id='services-info-p6'
                      defaultMessage='animations'
                    />
                  </span>
                </li>
                <li>
                  <i className="fas fa-check"></i>
                  <span>
                    <FormattedMessage
                      id='services-info-p7'
                      defaultMessage='Free maintenance for 6 months'
                    />
                  </span>
                </li>
                <li>
                  <i className="fas fa-check"></i>
                  <span>
                    <FormattedMessage
                      id='services-info-2-p6'
                      defaultMessage='Delivered in 7 business days'
                    />
                  </span>
                </li>
              </ul>
              
              {/* <div className='portafolio-btn'>
                <a href="#" className="custom-btn btn ">
                  <FormattedMessage
                    id='services-buy'
                    defaultMessage='buy now'
                  />
                </a> 
              </div> */}
            </div>
            <div className="columns" data-aos="fade-up" data-aos-delay="400">
              <h3>Premium</h3>
              <h4 className="sub-title">
                <FormattedMessage
                  id='services-info-sub-title-3'
                  defaultMessage='Great for large websites'
                />
              </h4>
              <p className="numero"><span>$</span>700</p>
              <ul className="ul-cards-services">
                <li>
                  <i className="fas fa-check"></i>
                  <span>
                    <FormattedMessage
                      id='services-info-3-p1'
                      defaultMessage='+10 responsive pages'
                    />
                  </span>
                </li>
                <li>
                  <i className="fas fa-check"></i>
                  <span>
                    <FormattedMessage
                      id='services-info-p2'
                      defaultMessage='+3 sections for page'
                    />
                  </span>
                </li>
                <li>
                  <i className="fas fa-check"></i>
                  <span>
                    <FormattedMessage
                      id='services-info-p3'
                      defaultMessage='Contact Form'
                    />
                  </span>
                </li>
                <li>
                  <i className="fas fa-check"></i>
                  <span>
                    <FormattedMessage
                      id='services-info-p4'
                      defaultMessage='Domain for 1 year'
                    />
                  </span>
                </li>
                <li>
                  <i className="fas fa-check"></i>
                  <span>
                    <FormattedMessage
                      id='services-info-p5'
                      defaultMessage='Hosting for 1 year'
                    />
                  </span>
                </li>
                <li>
                  <i className="fas fa-check"></i>
                  <span>
                    <FormattedMessage
                      id='services-info-p6'
                      defaultMessage='animations'
                    />
                  </span>
                </li>
                <li>
                  <i className="fas fa-check"></i>
                  <span>
                    <FormattedMessage
                      id='services-info-3-p7'
                      defaultMessage='Free maintenance for 1 year'
                    />
                  </span>
                </li>
                <li>
                  <i className="fas fa-check"></i>
                  <span>
                    <FormattedMessage
                      id='services-info-3-p6'
                      defaultMessage='Delivered in 14 business days'
                    />
                  </span>
                </li>
              </ul>
              
              {/* <div className='portafolio-btn'>
                <a href="#" className="custom-btn btn-codigo">
                  <FormattedMessage
                    id='services-buy'
                    defaultMessage='buy now'
                  />
                </a>
              </div> */}
            </div>
          </div>
        </section>

        <section className="preguntas">
          <h2 className="heading">
            <FormattedMessage
              id='services-questions'
              defaultMessage='Frequent questions'
            />
          </h2>
          <div className="accordion-container">
            <Accordion
              title={<FormattedMessage
                id='services-questions-1'
                defaultMessage='What is a responsive web page?'
              />}
              content={<FormattedMessage
                id='services-questions-p1'
                defaultMessage='It is that page that is capable of adapting to any device where it is viewed, such as cell phones, tablets, laptops, without losing appearance or usability.'
              />}
              dataAos="fade-right"
              dataAosDelay="300"
            />

            <Accordion
              title={<FormattedMessage
                id='services-questions-2'
                defaultMessage='What is a Domain and a Hosting?'
              />}
              content={<FormattedMessage
                id='services-questions-p2'
                defaultMessage='Both are essential elements of a website. In short, the domain name is the address of the web page, while the hosting provides the space and resources necessary to launch the website.'
              />}
              dataAos="fade-left"
              dataAosDelay="300"
            />

            <Accordion
              title={<FormattedMessage
                id='services-questions-3'
                defaultMessage='Is monthly maintenance necessary?'
              />}
              content={<FormattedMessage
                id='services-questions-p3'
                defaultMessage='Regular maintenance of your website allows you to attract and retain customers with new information, new products and services, in addition to helping you maintain or improve your ranking in Google.'
              />}
              dataAos="fade-right"
              dataAosDelay="300"
            />

            <Accordion
              title={<FormattedMessage
                id='services-questions-4'
                defaultMessage='How to pay'
              />}
              content={<FormattedMessage
                id='services-questions-p4'
                defaultMessage='You can pay online by credit or debit cards and payments by transfers.'
              />}
              dataAos="fade-left"
              dataAosDelay="300"
            />

          </div>
        </section>
      </main>


      <ScrollToTop />

      <Footer />

    </div>
  )
}
export default Services;