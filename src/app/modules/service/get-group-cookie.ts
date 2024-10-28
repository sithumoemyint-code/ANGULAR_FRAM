export function getCookie(name: string): any {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const cookieValue = parts.pop()!.split(';').shift()!;
    try {
      const decodedValue = decodeURIComponent(cookieValue); // Decode URL encoding
      return JSON.parse(decodedValue); // Parse JSON string to an array or object
    } catch (e) {
      console.error('Failed to parse cookie value:', e);
      return null;
    }
  }
  return null;
}