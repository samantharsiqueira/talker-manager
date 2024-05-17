const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const {
  validateToken,
  validateName,
  validateAge,
  validateTalk,
  validateWatchedAt,
  validateRate,
} = require('../validation');

const router = express.Router();
router.use(express.json());

const TALKER_FILE = path.join(__dirname, '../talker.json');

async function getTalkers() {
  const data = await fs.readFile('./src/talker.json', 'utf-8');
  return JSON.parse(data);
}

async function writeTalkers(talkers) {
  await fs.writeFile(TALKER_FILE, JSON.stringify(talkers, null, 2));
}

router.get('/', async (req, res) => { 
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

router.post(
  '/',
  validateToken,
  validateName,
  validateAge,
  validateTalk,
  validateWatchedAt,
  validateRate,
  async (req, res) => {
    const newTalker = { ...req.body };
    const talkers = await getTalkers();
    newTalker.id = talkers.length ? talkers[talkers.length - 1].id + 1 : 1;
    talkers.push(newTalker);
    await writeTalkers(talkers);
    res.status(201).json(newTalker);
  },
);

router.put(
  '/:id',
  validateToken,
  validateName,
  validateAge,
  validateTalk,
  validateWatchedAt,
  validateRate,
  async (req, res) => {
    const { id } = req.params;
    const newTalker = { ...req.body, id: parseInt(id, 10) };
    const talkers = await getTalkers();

    const talkerIndex = talkers.findIndex((t) => t.id === parseInt(id, 10));
    if (talkerIndex === -1) {
      return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
    }

    talkers[talkerIndex] = newTalker;
    await writeTalkers(talkers);
    res.status(200).json(newTalker);
  },
);

router.delete('/:id', validateToken, async (req, res) => {
  const { id } = req.params;
  const talkers = await getTalkers();
  const talkerIndex = talkers.findIndex((t) => t.id === parseInt(id, 10));
  if (talkerIndex === -1) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
  talkers.splice(talkerIndex, 1);
  await writeTalkers(talkers);
  res.sendStatus(204);
});

module.exports = router; 
