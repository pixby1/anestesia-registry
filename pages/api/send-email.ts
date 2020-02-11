// tslint:disable object-literal-sort-keys

// Packages
import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

// Utils
import { errorWrapper, withApiHeaders } from '../../lib/utils';

// lib
import {
  emailAdmin,
  emailSupervisor,
  emailUser
} from '../../lib/templateEmail';

const SENDGRID_MAIL_API = 'https://api.sendgrid.com/v3/mail/send';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, society } = req.body;
    const response = await fetch(
      'https://dashboard.anestesiaclasa.org/api/only-supervisor',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ society })
      }
    );
    const users = await response.json();
    const supervisors = users.map((user: { email: any }, index: any) => {
      return user.email;
    });
    // para el emisor (usuario que se registro)
    await fetch(SENDGRID_MAIL_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${process.env.SENDGRID_API_KEY}`
      },
      body: JSON.stringify(emailUser(email, society))
    });
    if (supervisors.length) {
      users.map(async (user: { email: any }, index: any) => {
        await fetch(SENDGRID_MAIL_API, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${process.env.SENDGRID_API_KEY}`
          },
          body: JSON.stringify(emailSupervisor(user.email, society))
        });
      });
      return res.status(200).end();
    } else {
      await fetch(SENDGRID_MAIL_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${process.env.SENDGRID_API_KEY}`
        },
        body: JSON.stringify(emailAdmin('hrauch@gmail.com', society, email))
      });
      return res.status(200).end();
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
