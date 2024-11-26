export function getCookie(name: string): any {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  return parts[1]
}