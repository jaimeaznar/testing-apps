import express from 'express';
import { SHA3 } from 'sha3';

const salt =
  '89c5524326d6fef2ac24271e378b171cda8bcdf36743cb4c775aba3eb5929b627d81e68fa9f5203fa123bcdd48b8fee568171222d5c7ab079251751fcf3bd011';
const app = express();
app.disable('x-powered-by');
app.use(express.json()); // eslint-disable-line import/no-named-as-default-member
app.use(express.urlencoded({ extended: true })); // eslint-disable-line import/no-named-as-default-member

/**
 * Route to generate a hash for the inputs given as content
 * @name GET /generate
 * @param userId {string} 'I038282' - userId of the given user
 * @param userEmail {string} 'name.lastname@sanofi.com' - email address
 */
app.get('/generate', (req, res) => {
  try {
    const userId = req.query.userId as string;
    const userEmail = req.query.userEmail as string;
    const hash = new SHA3(512);

    if (!userId || !userEmail) {
      res.status(500).send("Error: can't generate certificate without params");
      return;
    }

    hash.update(userId).update(userEmail).update(salt);
    res.json({ certificate: hash.digest('hex') });
  } catch (error) {
    res.status(500).send(`Error: ${error}`);
  }
});

/**
 * Route to verify a hash belongs to the inputs given as content
 * @name GET /verify/:hash
 * @param userId {string} 'I038282' - userId of the given user
 * @param userEmail {string} 'name.lastname@sanofi.com' - email address
 */
app.get('/verify/:hash', (req, res) => {
  let resVerified = false;
  const hashValue = req.params.hash as string;
  const userId = req.query.userId as string;
  const userEmail = req.query.userEmail as string;
  const hash = new SHA3(512);

  if (!hashValue || !userId || !userEmail) {
    res
      .status(500)
      .send("Error: can't verify a certificate without the right params");
    return;
  }

  hash.update(userId).update(userEmail).update(salt);
  if (hash.digest('hex') === hashValue) {
    resVerified = true;
  }
  res.json({
    certificate: hashValue,
    verified: resVerified,
  });
});

export default app;
