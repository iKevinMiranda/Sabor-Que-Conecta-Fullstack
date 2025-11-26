const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres', 
  password: 'admin', 
  port: 5432,
});

pool.connect((err) => {
    if (err) console.error('Erro de conexão com o banco', err.stack);
    else console.log('📦 Banco de Dados Conectado com Sucesso!');
});

// --- ROTAS DE SEGURANÇA E AUTENTICAÇÃO ---

app.post('/register', async (req, res) => {
  const { nome, email, senha, tipo_usuario } = req.body;
  if (!nome || !email || !senha) {
    return res.status(400).json({ error: 'Preencha todos os campos obrigatórios.' });
  }

  try {
    const senha_hash = await bcrypt.hash(senha, saltRounds);
    const query = `
      INSERT INTO usuarios (nome, email, senha_hash, tipo_usuario) 
      VALUES ($1, $2, $3, $4) RETURNING id, nome, email, tipo_usuario
    `;
    const values = [nome, email, senha_hash, tipo_usuario || 'produtor'];
    const { rows } = await pool.query(query, values);
    
    res.status(201).json({ 
        message: 'Usuário registrado com sucesso!', 
        user: rows[0] 
    });

  } catch (err) {
    if (err.code === '23505') {
        return res.status(409).json({ error: 'Este e-mail já está em uso.' });
    }
    console.error('Erro no registro:', err);
    res.status(500).json({ error: 'Erro interno no servidor.' });
  }
});

app.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  try {
    const userQuery = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    const user = userQuery.rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const match = await bcrypt.compare(senha, user.senha_hash);
    if (!match) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const { senha_hash, ...userData } = user;
    res.json({ message: 'Login bem-sucedido!', user: userData });

  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ error: 'Erro interno no servidor.' });
  }
});

// --- ROTAS DE E-COMMERCE E LOGÍSTICA ---

app.post('/address', async (req, res) => {
  const user_id = 1; 
  const { cep, rua, numero, complemento, cidade, estado } = req.body;

  if (!cep || !rua || !numero || !cidade || !estado) {
    return res.status(400).json({ error: 'Preencha todos os campos obrigatórios de endereço.' });
  }

  try {
    const query = `
      INSERT INTO enderecos (usuario_id, cep, rua, numero, complemento, cidade, estado)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
    `;
    const values = [user_id, cep, rua, numero, complemento, cidade, estado];
    
    const { rows } = await pool.query(query, values);
    
    res.status(201).json({ message: 'Endereço cadastrado com sucesso!', address: rows[0] });

  } catch (err) {
    console.error('Erro ao cadastrar endereço:', err);
    res.status(500).json({ error: 'Erro interno ao salvar endereço.' });
  }
});

app.post('/orders', async (req, res) => {
  const { consumidor_id, endereco_entrega_id, itens } = req.body; 
  
  if (!consumidor_id || !endereco_entrega_id || !itens || itens.length === 0) {
    return res.status(400).json({ error: 'Dados do pedido incompletos.' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN'); 

    let valor_total = 0;
    for (const item of itens) {
        valor_total += item.preco_unitario * item.quantidade;
    }

    const pedidoQuery = await client.query(
      `INSERT INTO pedidos (consumidor_id, endereco_entrega_id, valor_total, status)
       VALUES ($1, $2, $3, 'AGUARDANDO_PAGAMENTO') RETURNING id`,
      [consumidor_id, endereco_entrega_id, valor_total]
    );
    const pedido_id = pedidoQuery.rows[0].id;

    for (const item of itens) {
      await client.query(
        `INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario)
         VALUES ($1, $2, $3, $4)`,
        [pedido_id, item.produto_id, item.quantidade, item.preco_unitario]
      );
    }

    await client.query('COMMIT'); 
    res.status(201).json({ 
        message: 'Pedido criado com sucesso!', 
        pedido_id: pedido_id, 
        total: valor_total 
    });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Erro ao processar pedido:', err);
    res.status(500).json({ error: 'Erro interno ao finalizar pedido.' });
  } finally {
    client.release();
  }
});

// --- ROTAS DE PRODUTOS E BUSCA (CRUD, FILTRO E PERFIL) ---

app.get('/produtos', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM produtos ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/produtos/categorias', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT DISTINCT categoria FROM produtos ORDER BY categoria');
    res.json(rows.map(row => row.categoria)); 
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/produtos/vendedor/:produtor', async (req, res) => {
  const { produtor } = req.params;
  try {
    const { rows } = await pool.query('SELECT * FROM produtos WHERE produtor = $1 ORDER BY nome', [produtor]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Nenhum produto encontrado para este vendedor.' });
    }
    
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar produtos do vendedor.' });
  }
});

app.post('/produtos', async (req, res) => {
  const { nome, produtor, preco, categoria, imagem } = req.body;
  try {
    const query = 'INSERT INTO produtos (nome, produtor, preco, categoria, imagem) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const { rows } = await pool.query(query, [nome, produtor, preco, categoria, imagem]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/produtos/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, produtor, preco, categoria, imagem } = req.body;

  try {
    const query = `
      UPDATE produtos SET 
      nome = $1, 
      produtor = $2, 
      preco = $3, 
      categoria = $4, 
      imagem = $5 
      WHERE id = $6
      RETURNING *
    `;
    const values = [nome, produtor, preco, categoria, imagem, id];
    
    const { rows } = await pool.query(query, values);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar produto' });
  }
});

app.delete('/produtos/:id', async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const deleteResult = await client.query('DELETE FROM produtos WHERE id = $1 RETURNING nome', [id]);
    
    if (deleteResult.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Produto não encontrado para exclusão' });
    }
    
    const produtoNome = deleteResult.rows[0].nome;
    await client.query(
        'INSERT INTO auditoria (operacao, detalhes) VALUES ($1, $2)', 
        ['DELETE_PRODUTO', `Produto "${produtoNome}" (ID: ${id}) excluído.`]
    );

    await client.query('COMMIT');
    res.json({ message: `Produto ID ${id} excluído com sucesso.` });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Erro ao excluir produto' });
  } finally {
    client.release();
  }
});

// ROTA 10: GET - Histórico de Pedidos do Usuário
app.get('/orders/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        // Busca os pedidos principais (Header)
        const pedidosQuery = await pool.query(
            `SELECT id, data_pedido, valor_total, status FROM pedidos WHERE consumidor_id = $1 ORDER BY data_pedido DESC`, 
            [userId]
        );
        const pedidos = pedidosQuery.rows;

        // Para cada pedido, busca seus itens (Details)
        for (const pedido of pedidos) {
            const itensQuery = await pool.query(
                `SELECT 
                    ip.quantidade, ip.preco_unitario,
                    p.nome as produto_nome, 
                    p.produtor 
                FROM itens_pedido ip
                JOIN produtos p ON ip.produto_id = p.id
                WHERE ip.pedido_id = $1`, 
                [pedido.id]
            );
            pedido.itens = itensQuery.rows;
        }

        res.json(pedidos);

    } catch (err) {
        console.error('Erro ao buscar histórico de pedidos:', err);
        res.status(500).json({ error: 'Erro ao buscar pedidos.' });
    }
});


app.listen(3000, () => console.log('🔥 Servidor rodando na porta 3000'));