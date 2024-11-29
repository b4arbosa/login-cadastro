const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Configuração do banco de dados
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '34445977', 
  database: 'organiza'    
});

// Testando conexão
db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco:', err);
    process.exit(1);  // Caso a conexão falhe, o servidor para de rodar
  } else {
    console.log('Conectado ao banco de dados.');
  }
});

// Endpoint para obter os dados
app.get('/api/BarData', (req, res) => {
  db.query('SELECT * FROM BarData', (err, results) => {
    if (err) {
      console.error('Erro ao buscar dados:', err);
      res.status(500).send('Erro ao buscar dados.');
    } else {
      res.json(results);
    }
  });
});

// Endpoint para editar um item (atualizar os valores)
app.put('/api/BarData/:id', (req, res) => {
    const { id } = req.params;
    const { name, meta, gasto } = req.body;
  
    // Validação dos dados recebidos
    if (!name || typeof meta !== 'number' || typeof gasto !== 'number') {
      return res.status(400).json({ error: 'Dados inválidos. Verifique os parâmetros.' });
    }
  
    // Atualiza os valores no banco de dados
    db.query(
      'UPDATE BarData SET name = ?, meta = ?, gasto = ? WHERE id = ?',
      [name, meta, gasto, id],
      (err, results) => {
        if (err) {
          console.error('Erro ao atualizar a meta:', err);
          return res.status(500).send('Erro ao atualizar a meta');
        }
  
        if (results.affectedRows > 0) {
          res.status(200).send('Meta atualizada com sucesso!');
        } else {
          res.status(404).send('Meta não encontrada');
        }
      }
    );
  });
  

// Endpoint para adicionar um item
app.post('/api/BarData', (req, res) => {
  const { name, meta, gasto } = req.body;

  // Validação básica dos dados
  if (!name || typeof meta !== 'number' || typeof gasto !== 'number') {
    return res.status(400).json({ error: 'Dados inválidos. Verifique os parâmetros.' });
  }

  db.query(
    'INSERT INTO BarData (name, meta, gasto) VALUES (?, ?, ?)',
    [name, meta, gasto],
    (err, results) => {
      if (err) {
        console.error('Erro ao adicionar dados:', err);
        res.status(500).send('Erro ao adicionar dados.');
      } else {
        res.status(201).json({ id: results.insertId });
      }
    }
  );
});

// Endpoint para excluir um item
app.delete('/api/BarData/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM BarData WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Erro ao excluir a meta:', err);
      return res.status(500).send('Erro ao excluir a meta');
    }

    if (results.affectedRows > 0) {
      res.status(200).send('Meta excluída com sucesso!');
    } else {
      res.status(404).send('Meta não encontrada');
    }
  });
});

// Endpoint para "anular" um item (definir como NULL)
app.put('/api/BarData/:id', (req, res) => {
  const { id } = req.params;
  db.query('UPDATE BarData SET meta = NULL, gasto = NULL WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Erro ao anular a meta:', err);
      return res.status(500).send('Erro ao anular a meta');
    }

    if (results.affectedRows > 0) {
      res.status(200).send('Meta anulada com sucesso!');
    } else {
      res.status(404).send('Meta não encontrada');
    }
  });
});

// Iniciar o servidor
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
