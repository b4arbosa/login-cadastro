import React, { useState, useEffect } from 'react';
import { getCookie } from 'cookies-next';
import { FaExclamationTriangle } from 'react-icons/fa';
import BarChart from '../components/BarChart';
import PieChart from '../components/PieChart';
import MetaEditor from '../components/MetaEditor';
import { useRouter } from 'next/router';

const Home = () => {
  const [barData, setBarData] = useState([]); // Dados do gráfico
  const [isEditing, setIsEditing] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', meta: '', gasto: '' }); // Novo item
  const [editedItem, setEditedItem] = useState(null); // Para armazenar item sendo editado
  const router = useRouter();

  // Calculando totais
  const totalMeta = barData.reduce((acc, item) => acc + item.meta, 0);
  const totalGasto = barData.reduce((acc, item) => acc + item.gasto, 0);

  // Alertas
  const alerts = barData
    .filter(item => item.gasto > item.meta)
    .map(item => `Seu orçamento para ${item.name} foi excedido.`);

  // Função para carregar os dados do backend
  const loadBarData = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/BarData');
      if (response.ok) {
        const data = await response.json();
        setBarData(data); // Atualizando os dados
      } else {
        console.error('Erro ao carregar dados:', response.statusText);
      }
    } catch (error) {
      console.error('Erro de conexão:', error);
    }
  };

  // Função para enviar um novo item ao backend
  const submitNewItem = async () => {
    if (newItem.name && newItem.meta >= 0 && newItem.gasto >= 0) {
      try {
        const response = await fetch('http://localhost:3001/api/BarData', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newItem),
        });

        if (response.ok) {
          setNewItem({ name: '', meta: '', gasto: '' }); // Resetando o formulário
          setIsEditing(false);
          loadBarData(); // Recarregando os dados após a inserção
        } else {
          console.error('Erro ao salvar o item:', response.statusText);
        }
      } catch (error) {
        console.error('Erro de conexão:', error);
      }
    } else {
      console.log('Dados inválidos no formulário.');
    }
  };

  // Função para atualizar uma meta no banco de dados
  const updateMeta = async (item) => {
    if (item.id) {
      try {
        const response = await fetch(`http://localhost:3001/api/BarData/${item.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(item),
        });

        if (response.ok) {
          loadBarData(); // Recarregar os dados após a atualização
          setEditedItem(null); // Finalizar a edição
        } else {
          console.log('Erro ao atualizar a meta:', response.statusText);
        }
      } catch (error) {
        console.error('Erro de conexão:', error);
      }
    } else {
      console.log('ID da meta ausente.');
    }
  };

  // Função para excluir ou "anular" uma meta
  const deleteMeta = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/api/BarData/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        loadBarData(); // Recarregar os dados após a exclusão
      } else {
        console.error('Erro ao excluir a meta:', response.statusText);
      }
    } catch (error) {
      console.error('Erro de conexão:', error);
    }
  };

  // Carregar dados na montagem do componente
  useEffect(() => {
    const token = getCookie('authorization');
    if (!token) {
      router.push('/login');
    } else {
      loadBarData(); // Carregando os dados do backend
    }
  }, [router]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '85vh',
      backgroundImage: 'url(".\styles\fundo.png")'
    }}>
      <div style={{ width: '45%', padding: '20px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h1 style={{ fontSize: '2em' }}>Orçamento e Meta</h1>
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', marginBottom: '20px', backgroundColor: '#FAFAD2' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', margin: 0 }}>
            <FaExclamationTriangle style={{ color: '#FFA500', marginRight: '10px' }} />
            Alertas
          </h2>
          <ul>
            {alerts.map((alert, index) => (
              <li key={index}>{alert}</li>
            ))}
          </ul>
        </div>
        <h2 style={{ fontSize: '2em' }}>Gráfico Comparativo</h2>
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', backgroundColor: '#FAFAD2' }}>
          <BarChart data={barData} />
        </div>
      </div>

      <div style={{ width: '35%', padding: '20px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h2 style={{ fontSize: '2em' }}>Valor Total</h2>
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', marginBottom: '20px', height: '45%', backgroundColor: '#FAFAD2' }}>
          <PieChart totalMeta={totalMeta} totalGasto={totalGasto} />
        </div>

        <h2 style={{ fontSize: '2em' }}>Metas</h2>
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', height: '55%', backgroundColor: '#FAFAD2' }}>
          <button onClick={() => setIsEditing(true)} style={{ marginBottom: '10px', padding: '10px', color: 'white', backgroundColor: 'orange', borderRadius: '10px' }}>
            Adicionar
          </button>
          <MetaEditor barData={barData} onSave={loadBarData} />
          {isEditing && (
            <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', backgroundColor: '#FAFAD2', marginTop: '10px' }}>
              <h3>Adicionar Novo Item</h3>
              <input
                type="text"
                name="name"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                placeholder="Nome"
                style={{ display: 'block', marginBottom: '10px', width: '100%' }}
              />
              <input
                type="number"
                name="meta"
                value={newItem.meta}
                onChange={(e) => setNewItem({ ...newItem, meta: Number(e.target.value) })}
                placeholder="Meta"
                style={{ display: 'block', marginBottom: '10px', width: '100%' }}
              />
              <input
                type="number"
                name="gasto"
                value={newItem.gasto}
                onChange={(e) => setNewItem({ ...newItem, gasto: Number(e.target.value) })}
                placeholder="Gasto"
                style={{ display: 'block', marginBottom: '10px', width: '100%' }}
              />
              <button onClick={submitNewItem} style={{ marginTop: '10px' }}>Adicionar Item</button>
            </div>
          )}
          {/* Edição de item */}
          {editedItem && (
            <div style={{ marginTop: '20px' }}>
              <h3>Editar Item</h3>
              <input
                type="text"
                value={editedItem.name}
                onChange={(e) => setEditedItem({ ...editedItem, name: e.target.value })}
              />
              <input
                type="number"
                value={editedItem.meta}
                onChange={(e) => setEditedItem({ ...editedItem, meta: Number(e.target.value) })}
              />
              <input
                type="number"
                value={editedItem.gasto}
                onChange={(e) => setEditedItem({ ...editedItem, gasto: Number(e.target.value) })}
              />
              <button onClick={() => updateMeta(editedItem)} style={{ marginTop: '10px' }}>Salvar Alterações</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
