import { db } from '../connect.js';

export const getUser = (req, res) => {
  const userId = req.params.userId;
  const q = 'SELECT * FROM users WHERE id=?';
  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(data);
    const { password, ...info } = data[0];
    return res.status(200).json(info);
  });
};
