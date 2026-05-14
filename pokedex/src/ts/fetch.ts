export async function hacerFetch(url: string) {
  const res = await fetch(url);
  const data = await res.json();
  return data;
}