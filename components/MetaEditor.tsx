import React, { useState, useEffect } from 'react';

interface MetaTableProps {
  barData: { id: number; name: string; meta: number; gasto: number }[];
  onSave: (newData: { id: number; name: string; meta: number; gasto: number }[]) => void;
}

const MetaTable: React.FC<MetaTableProps> = ({ barData, onSave }) => {
  const [data, setData] = useState(barData);
  const [editingItem, setEditingItem] = useState<number | null>(null);

  useEffect(() => {
    setData(barData);  // Atualiza o estado com os dados passados para o componente
  }, [barData]);

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>, field: string, id: number) => {
    setData(prevData =>
      prevData.map(item =>
        item.id === id ? { ...item, [field]: field === 'name' ? e.target.value : Number(e.target.value) } : item
      )
    );
  };

  const handleSave = async (id: number) => {
    setEditingItem(null);

    // Envia a requisição PUT para atualizar o item no backend
    const updatedItem = data.find(item => item.id === id);
    if (updatedItem) {
      try {
        const response = await fetch(`http://localhost:3001/api/BarData/${updatedItem.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedItem),
        });

        if (!response.ok) {
          throw new Error('Erro ao salvar as alterações.');
        }

        onSave(data); // Atualiza os dados no componente pai após salvar
      } catch (error) {
        console.error('Erro ao atualizar os dados:', error);
      }
    }
  };

  const handleCancel = () => {
    setEditingItem(null);
  };

  const handleEdit = (id: number) => {
    setEditingItem(id);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3001/api/BarData/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir a meta.');
      }

      const updatedData = data.filter(item => item.id !== id);
      setData(updatedData);  // Atualiza o estado local
      onSave(updatedData);  // Informa ao componente pai sobre a mudança
    } catch (error) {
      console.error('Erro ao excluir do banco de dados:', error);
    }
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
  };

  const thTdStyle = {
    padding: '10px',
    textAlign: 'left',
    border: '1px solid #ddd',
  };

  const inputStyle = {
    padding: '5px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    width: '100%',
  };

  const buttonStyle = {
    padding: '5px 10px',
    margin: '0 5px',
    backgroundColor: '#FFA500',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  };

  const cancelButtonStyle = {
    padding: '5px 10px',
    margin: '0 5px',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    backgroundColor: '#f44336',
  };

  const tdActionsStyle = {
    textAlign: 'center',
    whiteSpace: 'nowrap',
    padding: '10px',
    minWidth: '180px',
  };

  return (
    <div>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thTdStyle}>Categoria</th>
            <th style={thTdStyle}>Meta</th>
            <th style={thTdStyle}>Gasto</th>
            <th style={thTdStyle}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id}>
              <td style={thTdStyle}>
                {editingItem === item.id ? (
                  <input
                    style={inputStyle}
                    type="text"
                    value={item.name}
                    onChange={(e) => handleEditChange(e, 'name', item.id)}
                  />
                ) : (
                  item.name
                )}
              </td>
              <td style={thTdStyle}>
                {editingItem === item.id ? (
                  <input
                    style={inputStyle}
                    type="number"
                    value={item.meta}
                    onChange={(e) => handleEditChange(e, 'meta', item.id)}
                  />
                ) : (
                  item.meta
                )}
              </td>
              <td style={thTdStyle}>
                {editingItem === item.id ? (
                  <input
                    style={inputStyle}
                    type="number"
                    value={item.gasto}
                    onChange={(e) => handleEditChange(e, 'gasto', item.id)}
                  />
                ) : (
                  item.gasto
                )}
              </td>
              <td style={tdActionsStyle}>
                {editingItem === item.id ? (
                  <>
                    <button
                      style={buttonStyle}
                      onClick={() => handleSave(item.id)}
                      aria-label="Salvar alterações"
                    >
                      Salvar
                    </button>
                    <button
                      style={cancelButtonStyle}
                      onClick={handleCancel}
                      aria-label="Cancelar edição"
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      style={buttonStyle}
                      onClick={() => handleEdit(item.id)}
                      aria-label="Editar item"
                    >
                      Editar
                    </button>
                    <button
                      style={buttonStyle}
                      onClick={() => handleDelete(item.id)}
                      aria-label="Excluir item"
                    >
                      Excluir
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MetaTable;
