// tslint:disable: object-literal-sort-keys

function emailUser(email: string, society: string) {
  return {
    personalizations: [
      {
        to: [
          {
            email
          }
        ],
        subject: 'Registro enviado'
      }
    ],
    from: {
      email: 'noreply@anestesia.com',
      name: 'Anestesia'
    },
    content: [
      {
        type: 'text/html',
        value: `Gracias por registrate, a la brevedad lo incluiremos en la condefederación de la sociedad de <b>${society}</b>`
      }
    ]
  };
}

function emailSupervisor(email: string, society: string) {
  return {
    personalizations: [
      {
        to: [
          {
            email
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
        type: 'text/html',
        value: `Tienes nuevos registros de <b>${society}</b>, revise el dashboard para aprobarlos`
      }
    ]
  };
}

function emailAdmin(email: string, society: string, remi: string) {
  return {
    personalizations: [
      {
        to: [
          {
            email
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
        type: 'text/html',
        value: `El usuario ${remi} se registro pero no tiene supervisore en ${society} que lo aprueben, por favor asigine un supervisor para esa region.`
      }
    ]
  };
}

export { emailUser, emailSupervisor, emailAdmin };
