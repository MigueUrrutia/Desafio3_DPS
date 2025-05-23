const express = require('express');
const { Book } = require('./models');
const protect = require('./middleware');

const router = express.Router();

router.use(protect);

router.get('/', async (req, res) => {
  const books = await Book.findAll({ where: { userId: req.user.id } });
  res.json(books);
});

router.post('/', async (req, res) => {
  try {
    const book = await Book.create({ ...req.body, userId: req.user.id });
    res.status(201).json(book);
  } catch {
    res.status(400).json({ error: 'No se pudo agregar el libro' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    await Book.update(req.body, {
      where: { id: req.params.id, userId: req.user.id }
    });
    res.json({ message: 'Actualizado' });
  } catch {
    res.status(400).json({ error: 'Error al actualizar' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Book.destroy({
      where: { id: req.params.id, userId: req.user.id }
    });
    res.json({ message: 'Eliminado' });
  } catch {
    res.status(400).json({ error: 'Error al eliminar' });
  }
});

module.exports = router;
