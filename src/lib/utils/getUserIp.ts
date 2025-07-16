export const getUserIp = async (): Promise<string | null> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip; // returns IP string like "192.168.1.1"
  } catch (error) {
    console.error('Error fetching IP address:', error);
    return null;
  }
};
