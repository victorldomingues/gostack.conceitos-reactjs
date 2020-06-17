import React, { useState, useEffect } from "react";
import { ChangeEvent } from 'react-dom';
import "./styles.css";
import api from './services/api'
function App() {

  const [repositories, setRepositories] = useState([]);
  const [techs, setTechs] = useState([]);
  const [tech, setTech] = useState('');
  const [title, setTitle] = useState('');


  useEffect(() => {
    api.get('repositories').then(r => {
      setRepositories(r.data);
    });
  }, []);

  function handleTitleChange(event) {
    const { value } = event.target;
    setTitle(value);
  }

  function handleTechChange(event) {
    const { value } = event.target;
    setTech(value);
  }

  async function handleAddTech() {
    setTechs([...techs, { index: techs.length, name: tech }])
  }
  async function handleAddRepository() {
    let rep = {
      title: title,
      techs: techs.map(x => x.name)
    };
    rep = await api.post('repositories', rep);
    setRepositories([...repositories, rep.data]);
  }

  async function handleRemoveTech(index) {
    techs.splice(index, 1);
    setTechs([...techs]);
  }
  async function handleRemoveRepository(id) {
    await api.delete(`repositories/${id}`);
    repositories.splice(repositories.findIndex(x => x.id === id), 1)
    setRepositories([...repositories]);
  }

  return (

    <div>
      <h1>Repositórios</h1>
      <br />
      <div className="form">
        <div className="form-item">
          <label>Título</label>
          <input type="text" onChange={handleTitleChange} />
        </div>

        <div className="form-item">
          <label>Tecnologias</label>
          <input type="text" onChange={handleTechChange} /><button onClick={handleAddTech}>+</button>
        </div>
        <ul className="chips">
          {techs.map(x => (
            <li key={x.index}>
              <div className="title">{x.name}</div>
              <button className="remove-chip" onClick={() => handleRemoveTech(x.index)} type="button">x</button>
            </li>
          ))}

        </ul>
        <button onClick={handleAddRepository}>Adicionar</button>

      </div>

      <div>
        <br />
        <ul data-testid="repository-list">
          {repositories.map(x => (
            <li key={x.id}>
              {x.title}
              <button onClick={() => handleRemoveRepository(x.id)}>
                Remover
            </button>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}

export default App;
