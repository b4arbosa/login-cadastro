import React, { useState, useEffect } from 'react';

interface MetaTableProps {
  barData: { name: string; meta: number; gasto: number }[];
  onSave: (newData: { name: string; meta: number; gasto: number }[]) => void;
}

const MetaTable: React.FC<MetaTableProps> = ({ barData, onSave }) => {
  const [data, setData] = useState(barData);
  const [editingItem, setEditingItem] = useState<string | null>(null);

  useEffect(() => {
    setData(barData);
  }, [barData]);

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>, field: string, name: string) => {
    setData(prevData =>
      prevData.map(item =>
        item.name === name ? { ...item, [field]: field === 'name' ? e.target.value : Number(e.target.value) } : item
      )
    );
  };

  const handleSave = (name: string) => {
    setEditingItem(null);
    onSave(data);
  };

  const handleCancel = () => {
    setEditingItem(null);
  };

  const handleEdit = (name: string) => {
    setEditingItem(name);
  };

  const handleDelete = (name: string) => {
    const updatedData = data.filter(item => item.name !== name);
    setData(updatedData);
    onSave(updatedData);
  };

  // Estilos em linha
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
    width: '100%', // Faz os inputs ocuparem todo o espaço disponível
  };

  const buttonStyle = {
    padding: '5px 10px',
    margin: '0 5px',
    backgroundColor: '#FFA500',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    whiteSpace: 'nowrap', // Impede que os botões quebrem a linha
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
    whiteSpace: 'nowrap', // Impede que os botões quebrem a linha
    padding: '10px', // Ajusta o espaçamento para as células de ação
    minWidth: '180px', // Garante que a célula de ações tenha largura mínima para os botões
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
            <tr key={item.name}>
              <td style={thTdStyle}>
                {editingItem === item.name ? (
                  <input
                    style={inputStyle}
                    type="text"
                    value={item.name}
                    onChange={(e) => handleEditChange(e, 'name', item.name)}
                  />
                ) : (
                  item.name
                )}
              </td>
              <td style={thTdStyle}>
                {editingItem === item.name ? (
                  <input
                    style={inputStyle}
                    type="number"
                    value={item.meta}
                    onChange={(e) => handleEditChange(e, 'meta', item.name)}
                  />
                ) : (
                  item.meta
                )}
              </td>
              <td style={thTdStyle}>
                {editingItem === item.name ? (
                  <input
                    style={inputStyle}
                    type="number"
                    value={item.gasto}
                    onChange={(e) => handleEditChange(e, 'gasto', item.name)}
                  />
                ) : (
                  item.gasto
                )}
              </td>
              <td style={tdActionsStyle}>
                {editingItem === item.name ? (
                  <>
                    <button
                      style={buttonStyle}
                      onClick={() => handleSave(item.name)}
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
                      onClick={() => handleEdit(item.name)}
                      aria-label="Editar item"
                    >
                      Editar
                    </button>
                    <button
                      style={buttonStyle}
                      onClick={() => handleDelete(item.name)}
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
