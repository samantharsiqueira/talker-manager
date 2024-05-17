const express = require('express');
const fs = require('fs').promises;

const router = express.Router();

async function getTalkers() {
  const data = await fs.readFile('./src/talker.json', 'utf-8');
  return JSON.parse(data);
}

router.get('/', async (req, res) => { 
  console.log('Rota GET /talker acessada');
  const talkers = await getTalkers();
  res.status(200).json(talkers);
});

router.get('/:id', async (req, res) => { 
  const { id } = req.params;
  const talkers = await getTalkers();
  const talker = talkers.find((t) => t.id === parseInt(id, 10));
  if (!talker) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  res.status(200).json(talker);
});

module.exports = router; 
