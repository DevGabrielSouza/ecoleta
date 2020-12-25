import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import './style.css';

import logo from '../../assets/logo.svg';
import api from '../../services/api';

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

const CreatePoint = () => {

    const [items, setItems] = useState<Array<Item>>([]);
    const [estados, setEstados] = useState<Array<Estado>>([]);

    useEffect(() => {

        api.get('items').then(response => {
            setItems(response.data);
        })

        fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome').then( async responseEstados => {
            let estados = await responseEstados.json()
            setEstados(estados);
        })

    }, []);

    


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

                        <div id="map"></div>

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
                                <label htmlFor="uf">Estado (UF)</label>
                                <select name="uf" id="uf">
                                    <option value="0">Selecione uma UF</option>

                                    {estados.map(estado => (
                                        <option key={estado.id} value={estado.id}>{estado.sigla}</option>
                                    ))}

                                </select>
                            </div>

                            <div className="field">
                                <label htmlFor="city">Cidade</label>
                                <select name="city" id="city">
                                    <option value="0">Selecione uma cidade</option>
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