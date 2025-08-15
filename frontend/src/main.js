const searchBtn = document.getElementById('searchBtn');
const keywordInput = document.getElementById('keyword');
const resultsDiv = document.getElementById('results');

// Mock JSON para testes sem depender da Amazon
const mockData = {
  "keyword": "mouse",
  "market": "com",
  "count": 2,
  "results": [
    {
      "title": "Mouse Gamer XYZ",
      "price": "R$ 129,90",
      "image": "https://m.media-amazon.com/images/I/81agojlXHyL._AC_UL320_.jpg",
      "link": "https://www.amazon.com.br/dp/B0CVW4HXNK",
      "rating": "4.5 de 5 estrelas",
      "reviews": "120 avaliações"
    },
    {
      "title": "Mouse Sem Fio ABC",
      "price": "R$ 89,90",
      "image": "https://m.media-amazon.com/images/I/91asdhfASD._AC_UL320_.jpg",
      "link": "https://www.amazon.com.br/dp/B0CVW4HXNL",
      "rating": "4.2 de 5 estrelas",
      "reviews": "85 avaliações"
    }
  ],
  "source": "amazon"
};

searchBtn.addEventListener('click', async () => {
  const keyword = keywordInput.value.trim();
  if (!keyword) {
    alert('Digite um produto!');
    return;
  }

  resultsDiv.innerHTML = '<p>Carregando...</p>';

  try {
    // Para usar backend real, descomente a linha abaixo:
    // const res = await fetch(`http://localhost:3000/api/scrape?keyword=${encodeURIComponent(keyword)}&market=com.br`);
    // const data = await res.json();

    // Usando mock JSON para garantir que funcione
    const data = mockData;

    resultsDiv.innerHTML = '';

    if (data.count === 0) {
      resultsDiv.textContent = 'Nenhum produto encontrado.';
      return;
    }

    data.results.forEach(item => {
      const div = document.createElement('div');
      div.classList.add('product');
      div.innerHTML = `
        <img src="${item.image}" alt="${item.title}">
        <div>
          <a href="${item.link}" target="_blank"><h3>${item.title}</h3></a>
          <p>Preço: ${item.price || 'Não informado'}</p>
          <p>⭐ ${item.rating || 'Sem avaliação'}</p>
          <p>${item.reviews || ''}</p>
        </div>
      `;
      resultsDiv.appendChild(div);
    });

  } catch (error) {
    resultsDiv.innerHTML = `<p style="color:red;">Erro ao buscar resultados.</p>`;
    console.error(error);
  }
});
