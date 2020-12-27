import React, { useState, useEffect, useLayoutEffect, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import './style.css';

import { withScriptjs, withGoogleMap } from 'react-google-maps';

import logo from '../../assets/logo.svg';
import api from '../../services/api';
import axios from 'axios';

import Map from '../../Components/Map';

const WrappedMap = withScriptjs(withGoogleMap(Map));

interface Item{
    id: number,
    title: string,
    imageUrl: string,
}

interface Estado{
    id: number,
    sigla: string,
    nome: string,
}

interface City{
    id: number,
    nome: string,
}

const CreatePoint = () => {

    const [items, setItems] = useState<Array<Item>>([]);
    const [estados, setEstados] = useState<Array<Estado>>([]);
    const [cities, setCities] = useState<Array<City>>([]);
    const [selectedUf, setSelectedUf] = useState('0');
    const [selectedCity, setSelectedCity] = useState('0');

    useEffect(() => {

        api.get('items').then(response => {
            setItems(response.data);
        })

    }, []);

    useEffect( () => {

        axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome').then( response => {
            let estados = response.data;
            setEstados(estados);
        });
    }, []);

    useEffect( () => {

        axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then( response => {
            let cities = response.data;
            setCities(cities);
        });

    }, [selectedUf]);

    function handleSelectedUf(event: ChangeEvent<HTMLSelectElement>){
        let selectedUf = event.target.value;
        setSelectedUf(selectedUf);
    }

    function handleSelectedCity(event: ChangeEvent<HTMLSelectElement>){
        let selectedCity = event.target.value;
        setSelectedCity(selectedCity);
    }

    function handleMapClick(){
        //
    }
    


    return (
        <div id="page-create-point">

            <header>
                <img src={logo} alt="Ecoleta"/>
                <Link to="/">
                    <FiArrowLeft/>
                    <strong>Voltar para home</strong>
                </Link>
            </header>

            <main>
                <form>
                    <h1>Cadastro do ponto <br/> de coleta</h1>

                    <fieldset>

                        <legend>
                            <h2>Dados</h2>
                        </legend>

                        <div className="field">
                            <label htmlFor="name">Nome da entidade</label>
                            <input 
                            type="text"
                            name="name"
                            id="name"
                            />
                        </div>

                        <div className="field-group">

                            <div className="field">
                                <label htmlFor="email">Email</label>
                                <input 
                                type="email"
                                name="email"
                                id="email"
                                />
                            </div>

                            <div className="field">
                                <label htmlFor="whatsapp">Whatsapp</label>
                                <input 
                                type="text"
                                name="whatsapp"
                                id="whatsapp"
                                />
                            </div>
                        </div>

                    </fieldset>

                    <fieldset>

                        <legend>
                            <h2>Endereço</h2>
                            <span>Selecione o endereço no mapa</span>
                            
                        </legend>

                        <div className="map" style={{ width: "100%", height: "400px" }}>
                            <WrappedMap 
                            googleMapURL={`https://maps.googleapis.com/maps/api/js?key=AIzaSyB3EKzanoc0PUcXz56ZU_V5VFzqVZPY1vM&v=3.exp&libraries=geometry,drawing,places`} 
                            loadingElement={<div style={{height: "100%"}} />}
                            containerElement={<div style={{height: "100%"}} />}
                            mapElement={<div style={{height: "100%"}} />}
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="name">Endereço</label>
                            <input 
                            type="text"
                            name="name"
                            id="name"
                            />
                        </div>

                        <div className="field-group">

                            <div className="field">
                                <label htmlFor="uf">Estado (UF) (selected: {selectedUf})</label>
                                <select name="uf" id="uf" onChange={handleSelectedUf} value={selectedUf}>
                                    <option value="0">Selecione uma UF</option>

                                    {estados.map(estado => (
                                        <option key={estado.id} value={estado.sigla}>{estado.sigla}</option>
                                    ))}

                                </select>
                            </div>

                            <div className="field">
                                <label htmlFor="city">Cidade</label>
                                <select name="city" id="city" onChange={handleSelectedCity}>
                                    <option value="0">Selecione uma cidade</option>

                                    {cities.map(city => (
                                        <option key={city.id} value={city.nome}>{city.nome}</option>
                                    ))}

                                </select>
                            </div>
                            

                        </div>

                    </fieldset>

                    <fieldset>

                        <legend>
                            <h2>Ítens de coleta</h2>
                            <span>Selecione um ou mais ítens abaixo</span>
                        </legend>

                        <ul className="items-grid">

                            {items.map((item, index) => (
                                <li key={index}>
                                    <img src={item.imageUrl} alt={`Coleta de resíduos de ${item.title}`}/>
                                    <span>{item.title}</span>
                                </li>
                            ))}

                        </ul>
                        


                    </fieldset>

                    <button type="submit">
                        Cadastrar ponto de coleta
                    </button>

                </form>
            </main>

        </div>
    );
}

export default CreatePoint;