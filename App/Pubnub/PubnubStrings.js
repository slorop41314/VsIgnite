const PubnubStrings = {
  message: {
    type: {
      text: 'text',
      images: 'images',
      system: 'system',
      custom: 'custom',
      update: 'update',
      announcement: 'announcement',
      typing: 'typing',
      read: 'read',
      receipt: 'receipt',
    },
    status: {
      sent: 'sent',
      delivered: 'delivered',
      read: 'read',

      waiting: 'waiting',
      failure: 'failure',
    }
  },
  space: {
    type: {
      single: 'single',
      group: 'group',
    }
  },
  event: {
    type: {
      status: "status",
      presence: "presence",
      message: "message",
      signal: "signal",
      messageAction: "messageAction",
      user: "user",
      space: "space",
      membership: "membership",

      create: 'create',
    },
    value: {
      delivered: 'message_delivered',
      read: 'message_read',
      added: 'added',
    }
  },
  presence: {
    join: 'join',
    leave: 'leave',
    timeout: 'timeout',
  },
  invite_type: {
    create: 'create',
    invite: 'invite'
  }
}

export default PubnubStrings