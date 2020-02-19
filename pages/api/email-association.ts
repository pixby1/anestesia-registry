// Packages
import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

// Utils
import { errorWrapper, withApiHeaders } from '../../lib/utils';

const SENDGRID_MAIL_API = 'https://api.sendgrid.com/v3/mail/send';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  if (req.method === 'POST') {
    const { name, society } = req.body;
    const emailBody = {
      personalizations: [
        {
          to: [
            {
              email: 'hrauch@gmail.com',
              name: ''
            }
          ],
          subject: 'Nuevo registro'
        }
      ],
      from: {
        email: 'noreply@anestesia.com',
        name: 'Anestesia'
      },
      content: [
        {
          type: 'text/plain',
          value: `Confirma al usuario ${name} de la asociación ${society}`
        }
      ]
    };
    try {
      console.log('sending email');
      const response = await fetch(SENDGRID_MAIL_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${process.env.SENDGRID_API_KEY}`
        },
        body: JSON.stringify(emailBody)
      });
      if (response.status !== 202) {
        console.log(response);
        throw new Error(response.statusText);
      }
      res.status(200).end();
      return;
    } catch (e) {
      console.log(e.stack);
      res.status(500).json({ message: e.message });
      return;
    }
  }
  return res.status(404).json({
    error: {
      code: 'not_found',
      message:
        "The requested endpoint was not found or doesn't support this method."
    }
  });
}

export default errorWrapper(withApiHeaders(handler, { methods: ['POST'] }));
