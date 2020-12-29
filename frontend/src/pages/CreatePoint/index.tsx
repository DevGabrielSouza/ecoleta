import React, { useState, useEffect, useLayoutEffect, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import './style.css';

import { withScriptjs, withGoogleMap } from 'react-google-maps';

import logo from '../../assets/logo.svg';
import api from '../../services/api';
import axios from 'axios';

import Map from '../../Components/Map';
import { ClassLikeDeclaration } from 'typescript';

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
    
    const [selectedItems, setSelectedItems] = useState<number[]>([]);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: '',
    });

    const history = useHistory();


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

    function handleSelectItem(id: number){

        let alreadySelectedItem = selectedItems.findIndex(item => item === id);
        
        if( alreadySelectedItem >= 0  ){
            const filteredItems = selectedItems.filter(item => item !== id);
            setSelectedItems(filteredItems);
        }else{
            setSelectedItems([...selectedItems, id]);
        }

    }


    function handleInputChange(event: ChangeEvent<HTMLInputElement>){
        const {name, value} = event.target;
        setFormData({ ...formData, [name]: value});
    }

    async function handleSubmit(event: FormEvent){

        event.preventDefault();

        const { name, email, whatsapp } = formData;
        const uf = selectedUf;
        const city = selectedCity;
        const items = selectedItems;

        const data = {
            name,
            email,
            whatsapp,
            uf,
            city,
            items
        }

        await api.post('points', data);
        alert('Ponto de coleta cadastrado com sucesso!');
        history.push('/');
        
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
                <form onSubmit={handleSubmit}>
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
                            onChange={handleInputChange}
                            />
                        </div>

                        <div className="field-group">

                            <div className="field">
                                <label htmlFor="email">Email</label>
                                <input 
                                type="email"
                                name="email"
                                id="email"
                                onChange={handleInputChange}
                                />
                            </div>

                            <div className="field">
                                <label htmlFor="whatsapp">Whatsapp</label>
                                <input 
                                type="text"
                                name="whatsapp"
                                id="whatsapp"
                                onChange={handleInputChange}
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
                            onChange={handleInputChange}
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

                            {items.map(item => (
                                <li 
                                key={item.id} 
                                onClick={() => handleSelectItem(item.id)}
                                className={selectedItems.includes(item.id) ? 'selected' : ''}
                                >
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