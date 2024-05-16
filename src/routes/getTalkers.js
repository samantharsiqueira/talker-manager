const express = require('express');
const fs = require('fs').promises;

const router = express.Router();

// Função para ler o arquivo
async function getTalkers() {
  const data = await fs.readFile('./src/talker.json', 'utf-8'); // Corrigindo o caminho do arquivo JSON
  return JSON.parse(data);
}

router.get('/', async (req, res) => { // A rota não precisa de '/talker', pois já é definida ao usar app.use('/talker', talkerRouter);
  const talkers = await getTalkers();
  res.status(200).json(talkers);
});

module.exports = router; // Corrigindo 'module. Exports' para 'module.exports'
