'use client'; // Indicando que a página é um componente client-side

import React, { useState, useEffect } from 'react';
import { getCookie } from 'cookies-next';
import { FaExclamationTriangle } from 'react-icons/fa';
import BarChart from '../components/BarChart';
import PieChart from '../components/PieChart';
import AlertList from '../components/AlertList';
import MetaEditor from '../components/MetaEditor';
import { useRouter } from 'next/router';

const Home = () => {
  // Estado para armazenar os dados dinâmicos
  const [barData, setBarData] = useState([]);  // Inicializando com um array vazio
  
  const [isEditing, setIsEditing] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', meta: '', gasto: '' }); // Dados para o novo item
  
  const router = useRouter();

  // Calculando os totais de meta e gasto
  const totalMeta = barData.reduce((acc, item) => acc + item.meta, 0);
  const totalGasto = barData.reduce((acc, item) => acc + item.gasto, 0);

  // Filtrando alertas
  const alerts = barData
    .filter(item => item.gasto > item.meta)
    .map(item => `Seu orçamento para ${item.name} foi excedido.`);

  // Função para salvar as alterações após editar
  const handleSave = (newData) => {
    setBarData(newData);
    setIsEditing(false);
    setNewItem({ name: '', meta: '', gasto: '' });
    localStorage.setItem('barData', JSON.stringify(newData)); // Salvando os dados no localStorage
  };

  // Função para ativar o modo de edição
  const handleAdd = () => {
    setIsEditing(true);
  };

  // Função para atualizar o valor dos campos de entrada
  const handleNewItemChange = (e) => {
    const { name, value } = e.target;
    setNewItem(prevState => ({
      ...prevState,
      [name]: name === 'meta' || name === 'gasto' ? Number(value) : value
    }));
  };

  // Função para adicionar o novo item ao barData
  const handleNewItemSubmit = () => {
    if (newItem.name && newItem.meta >= 0 && newItem.gasto >= 0) {
      const updatedData = [...barData, newItem];
      setBarData(updatedData);  // Adicionando o novo item ao array
      setIsEditing(false);
      setNewItem({ name: '', meta: '', gasto: '' });  // Resetando os campos
      localStorage.setItem('barData', JSON.stringify(updatedData)); // Salvando os dados no localStorage
    }
  };

  // Verificação do token no lado do cliente com useEffect
  useEffect(() => {
    const token = getCookie('authorization');
    if (!token) {
      router.push('/login'); // Redireciona para a página de login se não autenticado
    }

    // Carregar os dados do localStorage, se houver
    const storedData = localStorage.getItem('barData');
    if (storedData) {
      setBarData(JSON.parse(storedData)); // Carregando os dados do localStorage
    }
  }, [router]); // Só executa no cliente, quando o componente é montado

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '85vh', backgroundColor: '#ffffff'}}>
      <div style={{ width: '45%', padding: '20px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h1 style={{ fontSize: '2em' }}>Orçamento e Meta</h1>
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', marginBottom: '20px', backgroundColor: '#FAFAD2' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', margin: 0 }}>
            <FaExclamationTriangle style={{ color: '#FFA500', marginRight: '10px' }} />
            Alertas
          </h2>
          <AlertList alerts={alerts} />
        </div>
        <h2 style={{fontSize: '2em'}}>Gráfico Comparativo</h2>
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', backgroundColor: '#FAFAD2' }}>
          <BarChart data={barData} />
        </div>
      </div>

      <div style={{ width: '35%', padding: '20px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h2>Valor Total</h2>
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', marginBottom: '20px', height: '45%', backgroundColor: '#FAFAD2' }}>
          <PieChart totalMeta={totalMeta} totalGasto={totalGasto} />
        </div>

        <h2>Metas</h2>
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', height: '55%', backgroundColor: '#FAFAD2' }}>
          <button onClick={handleAdd} style={{ marginBottom: '10px' , padding: '10px', color: "white", backgroundColor: "orange", borderRadius: "10px"}}>Adicionar</button>
          <MetaEditor
            barData={barData}
            onSave={handleSave}
          />
          {isEditing && (
            <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', backgroundColor: '#FAFAD2', marginTop: '10px'}}>
              <h3>Adicionar Novo Item</h3>
              <input
                type="text"
                name="name"
                value={newItem.name}
                onChange={handleNewItemChange}
                placeholder="Nome"
                style={{ display: 'block', marginBottom: '10px', width: '100%' }}
              />
              <input
                type="number"
                name="meta"
                value={newItem.meta}
                onChange={handleNewItemChange}
                placeholder="Meta"
                style={{ display: 'block', marginBottom: '10px', width: '100%' }}
              />
              <input
                type="number"
                name="gasto"
                value={newItem.gasto}
                onChange={handleNewItemChange}
                placeholder="Gasto"
                style={{ display: 'block', marginBottom: '10px', width: '100%' }}
              />
              <button onClick={handleNewItemSubmit} style={{ marginTop: '10px' }}>Adicionar Item</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
