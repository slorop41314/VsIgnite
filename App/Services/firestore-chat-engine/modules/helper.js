export function generateUUID(namespace) {
  const uuidv1 = require('uuid/v1');
  const uuidv3 = require('uuid/v3');
  const MY_NAMESPACE = uuidv1()
  return uuidv3(namespace, MY_NAMESPACE);
}

export const CHANNEL_TYPE = {
  single: 'single',
  group: 'group',
}
