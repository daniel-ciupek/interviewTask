import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import Message from '../models/message.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const messages = await Message.findAll({ order: [['id', 'ASC']] });
    res.json(messages);
  } catch (err) { next(err); }
});

router.post('/',
  body('message').trim().notEmpty().withMessage('Wiadomość nie może być pusta'),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
    try {
      const msg = await Message.create({ message: req.body.message });
      res.status(201).json(msg);
    } catch (err) { next(err); }
  }
);

router.put('/:id',
  body('message').trim().notEmpty().withMessage('Wiadomość nie może być pusta'),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
    try {
      const msg = await Message.findByPk(req.params.id);
      if (!msg) return res.status(404).json({ message: 'Nie znaleziono wiadomości' });
      await msg.update({ message: req.body.message });
      res.json(msg);
    } catch (err) { next(err); }
  }
);

router.delete('/:id', async (req, res, next) => {
  try {
    const msg = await Message.findByPk(req.params.id);
    if (!msg) return res.status(404).json({ message: 'Nie znaleziono wiadomości' });
    await msg.destroy();
    res.status(204).send();
  } catch (err) { next(err); }
});

export default router;
