let isConnected = true;

export function setConnectionStatus(status) {
  isConnected = status;
}

export function getConnectionStatus() {
  return isConnected;
}
