import express from "express";
import axios from "axios";
import { JSDOM } from "jsdom";

const app = express();
const PORT = process.env.PORT || 3000;

// CORS simples para o frontend
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

// Health check
app.get("/health", (_req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

// Monta URL de busca
function buildAmazonSearchUrl(keyword: string, market = "com.br") {
  const base = `https://www.amazon.${market}/s`;
  const params = new URLSearchParams({ k: keyword });
  return `${base}?${params.toString()}`;
}

// Rota principal de scraping
app.get("/api/scrape", async (req, res) => {
  try {
    const keyword = String(req.query.keyword || "").trim();
    const market = String(req.query.market || "com").trim();

    if (!keyword) return res.status(400).json({ error: "Parâmetro 'keyword' obrigatório" });

    const url = buildAmazonSearchUrl(keyword, market);

    const headers = {
      "User-Agent": "Mozilla/5.0",
    };

    const response = await axios.get(url, { headers, validateStatus: () => true });

    if (response.status >= 400) {
      return res.status(502).json({ error: "Falha ao buscar na Amazon", status: response.status });
    }

    const dom = new JSDOM(response.data);
    const document = dom.window.document;

    const nodes = [...document.querySelectorAll("div.s-result-item[data-component-type='s-search-result']")];
    const products = nodes.map(item => {
      const title = item.querySelector("h2 a span")?.textContent?.trim() || null;
      const price = item.querySelector(".a-price .a-offscreen")?.textContent?.trim() || null;
      const imgEl = item.querySelector("img.s-image") as HTMLImageElement | null;
const img = imgEl?.src || null;

      const a = item.querySelector("h2 a");
      const link = a ? (a.getAttribute("href")?.startsWith("http") ? a.getAttribute("href") : `https://www.amazon.${market}${a.getAttribute("href")}`) : null;
      const rating = item.querySelector("i span.a-icon-alt")?.textContent?.trim() || null;
      const reviews = item.querySelector("span.a-size-base")?.textContent?.trim() || null;

      return title && img && link ? { title, price, image: img, link, rating, reviews } : null;
    }).filter(Boolean);

    res.json({ keyword, market, count: products.length, results: products });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro interno no backend", details: String(err) });
  }
});

app.listen(PORT, () => console.log(`✅ Backend rodando em http://localhost:${PORT}`));
