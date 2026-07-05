import { getLoginUrl } from '../../lib/spotify';

export default function handler(req, res) {
  try {
    res.redirect(getLoginUrl());
  } catch (err) {
    res.status(500).send(err.message);
  }
}
