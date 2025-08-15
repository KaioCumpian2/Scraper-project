Perfeito! Aqui está um **README completo, lúdico e pronto para GitHub**, já incluindo a explicação sobre os dados mockados e o erro 503 da Amazon:

````markdown
# 🛒 Amazon Scraper (Mocked Edition)

![Banner](https://img.shields.io/badge/Amazon-Scraper-orange?style=flat-square)

Um projeto divertido e educativo para simular a busca de produtos na Amazon usando **backend em Bun/Express e frontend em Vite**. Ideal para aprendizado de web scraping, APIs e manipulação de DOM.

---

## 🎯 Objetivo do Projeto

Criar um scraper que captura dados da primeira página de resultados da Amazon para uma palavra-chave fornecida, incluindo:

- Título do produto  
- Preço  
- Avaliação em estrelas  
- Número de reviews  
- URL da imagem  

Como a Amazon bloqueia requisições automáticas, utilizamos **mock JSON** para exibir resultados de forma confiável.

---

## ⚠️ Por que usamos dados mockados?

A Amazon implementa proteções que geram erros como:

- **503 – Service Unavailable**  
- Bloqueio por suspeita de automação  
- Mudanças constantes no HTML da página  

💡 Para garantir funcionalidade e testes consistentes, todos os resultados exibidos são simulados. Isso permite testar a aplicação sem depender de scraping real, mostrando como o backend processaria dados de verdade.

> Futuramente, técnicas como proxies, headless browsers ou APIs oficiais seriam necessárias para acessar dados reais de forma confiável.

---

## 🛠 Tecnologias

**Backend:**

- [Bun](https://bun.sh/)  
- [Express](https://expressjs.com/)  
- [Axios](https://axios-http.com/)  
- [JSDOM](https://github.com/jsdom/jsdom)  

**Frontend:**

- [Vite](https://vitejs.dev/)  
- HTML, CSS, JavaScript Vanilla  

---

## 🚀 Como rodar o projeto

1. **Clonar o repositório:**

```bash
git clone https://github.com/seu-usuario/amazon-scraper.git
cd amazon-scraper/backend
````

2. **Instalar dependências:**

```bash
bun install
```

3. **Rodar o backend:**

```bash
bun run index.js
```

* Health check: [http://localhost:3000/health](http://localhost:3000/health)
* Teste scraping (mock): [http://localhost:3000/api/scrape?keyword=mouse](http://localhost:3000/api/scrape?keyword=mouse)

4. **Rodar o frontend:**

```bash
cd ../
npm install
npm run dev
```

Acesse: [http://localhost:5173](http://localhost:5173) (ou porta do Vite)

---

## 🖌 Funcionalidades

* Input para pesquisar produtos
* Botão de busca
* Exibição de resultados com título, preço, imagem, rating e reviews
* Layout limpo e responsivo
* Backend com rota `/api/scrape` simulando dados reais via mock JSON

---

## 💡 Observações

* Todos os dados exibidos são mockados devido às limitações do scraping da Amazon.
* A ideia é aprender e demonstrar a integração **frontend-backend** sem depender de dados externos instáveis.

---

## 📁 Estrutura do Projeto

```
amazon-scraper/
├─ backend/
│  ├─ index.js        # Backend Express + JSDOM + Axios
│  ├─ package.json
│  └─ bun.lockb
├─ src/
│  ├─ main.js         # Lógica frontend
│  ├─ style.css
├─ index.html
└─ README.md
```

---

## 🎉 Conclusão

Este projeto é uma forma divertida de aprender:

* Integração entre **backend e frontend**
* Criação de **APIs REST**
* Manipulação de DOM com **JSDOM**
* Consumo de dados simulados com **mock JSON**

Mesmo sem scraping real, você consegue testar toda a experiência de busca de produtos na Amazon!

---


