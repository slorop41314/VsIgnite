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
    },
    value: {
      delivered: 'message_delivered',
      read: 'message_read',
      added: 'added',
    }
  }
}

export default PubnubStrings