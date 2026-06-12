export async function hacerFetch(url: string) {
  const res = await fetch(url);

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    const message = `Fetch error ${res.status} ${res.statusText}` + (text ? `: ${text}` : "");
    throw new Error(message);
  }

  const data = await res.json();
  return data;
}
