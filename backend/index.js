import express from "express";
import axios from "axios";
import { JSDOM } from "jsdom";

const app = express();
const PORT = process.env.PORT || 3000;

// ======= CORS simples para o frontend funcionar =======
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// ======= Health check =======
app.get("/health", (_req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

// ======= Função para montar URL de busca da Amazon =======
function buildAmazonSearchUrl(keyword, market = "com.br") {
  const base = `https://www.amazon.${market}/s`;
  const params = new URLSearchParams({ k: keyword });
  return `${base}?${params.toString()}`;
}

// ======= Mock JSON (caso Amazon dê erro ou bloqueio 503) =======
const mockData = {
  keyword: "mouse",
  market: "com",
  count: 2,
  results: [
    {
      title: "Mouse Gamer XYZ",
      price: "R$ 129,90",
      image: "https://m.media-amazon.com/images/I/81agojlXHyL._AC_UL320_.jpg",
      link: "https://www.amazon.com.br/dp/B0CVW4HXNK",
      rating: "4.5 de 5 estrelas",
      reviews: "120 avaliações",
    },
    {
      title: "Mouse Sem Fio ABC",
      price: "R$ 89,90",
      image: "https://m.media-amazon.com/images/I/91asdhfASD._AC_UL320_.jpg",
      link: "https://www.amazon.com.br/dp/B0CVW4HXNL",
      rating: "4.2 de 5 estrelas",
      reviews: "85 avaliações",
    },
  ],
  source: "mock",
};

// ======= Rota principal de scraping =======
app.get("/api/scrape", async (req, res) => {
  try {
    const keyword = String(req.query.keyword || "").trim();
    const market = String(req.query.market || "com").trim();

    if (!keyword) return res.status(400).json({ error: "Parâmetro 'keyword' é obrigatório" });

    const url = buildAmazonSearchUrl(keyword, market);

    // ======= Cabeçalhos para simular navegador =======
    const headers = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
      "Connection": "keep-alive",
      "Cache-Control": "no-cache",
    };

    // ======= Chamada real à Amazon =======
    const response = await axios.get(url, {
      headers,
      timeout: 20000,
      maxRedirects: 5,
      validateStatus: () => true,
    });

    // ======= Se Amazon bloquear, retorna mock =======
    if (response.status >= 400) {
      console.warn(`⚠️ Amazon bloqueou ou deu erro ${response.status}, retornando mock`);
      return res.json(mockData);
    }

    // ======= Parse HTML com JSDOM =======
    const dom = new JSDOM(response.data);
    const document = dom.window.document;

    const nodes = [...document.querySelectorAll("div.s-result-item[data-component-type='s-search-result']")];
    const products = [];

    for (const item of nodes) {
      const title = item.querySelector("h2 a span")?.textContent?.trim() || null;
      const price = item.querySelector(".a-price .a-offscreen")?.textContent?.trim() || null;
      const img = item.querySelector("img.s-image")?.src || null;

      const a = item.querySelector("h2 a");
      let link = null;
      if (a) {
        const href = a.getAttribute("href");
        link = href?.startsWith("http") ? href : `https://www.amazon.${market}${href}`;
      }

      const rating = item.querySelector("i span.a-icon-alt")?.textContent?.trim() || null;
      const reviews = item.querySelector("span.a-size-base")?.textContent?.trim() || null;

      if (title && img && link && (price || rating)) {
        products.push({ title, price, image: img, link, rating, reviews });
      }
    }

    res.json({
      keyword,
      market,
      count: products.length,
      results: products,
      source: "amazon",
    });
  } catch (err) {
    console.error(err);
    // ======= Em caso de erro, também retorna mock =======
    return res.json(mockData);
  }
});

// ======= Start backend =======
app.listen(PORT, () => {
  console.log(`✅ Backend online em http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/health`);
  console.log(`   Teste scraping: http://localhost:${PORT}/api/scrape?keyword=mouse`);
});
