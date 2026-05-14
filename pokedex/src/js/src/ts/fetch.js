export async function hacerFetch(url) {
    const res = await fetch(url);
    const data = await res.json();
    return data;
}
