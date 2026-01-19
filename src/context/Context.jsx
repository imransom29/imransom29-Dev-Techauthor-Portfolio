import React, {useState} from 'react';
import MensajeIngles from './../language/en.json';
import MensajeHindi from './../language/hi.json';
import {IntlProvider} from 'react-intl';

const langContext = React.createContext();


const LangProvider = ({children}) => {
    let localePorDefecto;
	let mensajesPorDefecto;
	const lang = localStorage.getItem('lang');

	if(lang){
		localePorDefecto = lang

		if(lang === 'hi-IN'){
			mensajesPorDefecto = MensajeHindi;
		} else if(lang === 'en-US'){
			mensajesPorDefecto = MensajeIngles;
		} else {
			localePorDefecto = 'en-US'
			mensajesPorDefecto = MensajeIngles;
		}
	}

    const [mensaje, setMensaje] = useState(mensajesPorDefecto);
    const [locale, setLocale] = useState(localePorDefecto);

    const selectLanguage = (language) =>{
        switch (language) {
            case 'hi-IN':
                setMensaje(MensajeHindi);
                setLocale('hi-IN');
                localStorage.setItem('lang', 'hi-IN');
                break;
            case 'en-US':
                setMensaje(MensajeIngles);
                setLocale('en-US');
                localStorage.setItem('lang', 'en-US');
                break;
            default:
                setMensaje(MensajeIngles);
                setLocale('en-US');
                localStorage.setItem('lang', 'en-US');
        }
    }
    return (
        <langContext.Provider value={{selectLanguage: selectLanguage}}>
            <IntlProvider locale={locale} messages={mensaje}>
                {children}
            </IntlProvider>
        </langContext.Provider>
    );
};

export {LangProvider, langContext};