# Guia de Endpoints da API do TMDb

Com a chave da API do TMDb em mãos, você pode explorar um vasto universo de informações sobre filmes, séries e pessoas do entretenimento. Este guia apresenta os principais endpoints, suas funcionalidades e links para documentação oficial.

---

## 🌐 Endpoints Principais

### 🎬 Filmes

- **Detalhes de um filme**  
  `GET /movie/{movie_id}`  
  Obtém informações detalhadas sobre um filme específico.  
  [Documentação](https://developer.themoviedb.org/reference/movie-details)

- **Lista de filmes populares**  
  `GET /movie/popular`  
  Retorna uma lista de filmes populares.  
  [Documentação](https://developer.themoviedb.org/reference/movie-popular-list)

- **Alterações recentes em filmes**  
  `GET /movie/changes`  
  Obtém uma lista de filmes que foram alterados nas últimas 24 horas.  
  [Documentação](https://developer.themoviedb.org/reference/changes-movie-list)

- **Listas de filmes**  
  `GET /movie/{movie_id}/lists`  
  Obtém as listas nas quais um filme foi adicionado.  
  [Documentação](https://developer.themoviedb.org/reference/movie-lists)

---

### 📺 Séries de TV

- **Detalhes de uma série**  
  `GET /tv/{tv_id}`  
  Obtém informações detalhadas sobre uma série de TV específica.  
  [Documentação](https://developer.themoviedb.org/reference/tv-details)

- **Lista de séries populares**  
  `GET /tv/popular`  
  Retorna uma lista de séries de TV populares.  
  [Documentação](https://developer.themoviedb.org/reference/tv-popular-list)

---

### 👤 Pessoas (Atores, Diretores, etc.)

- **Detalhes de uma pessoa**  
  `GET /person/{person_id}`  
  Obtém informações detalhadas sobre uma pessoa específica.  
  [Documentação](https://developer.themoviedb.org/reference/person-details)

---

### 🔍 Pesquisa

- **Pesquisar filmes**  
  `GET /search/movie`  
  Permite pesquisar filmes por título.  
  [Documentação](https://developer.themoviedb.org/reference/search-movie)

- **Pesquisar séries de TV**  
  `GET /search/tv`  
  Permite pesquisar séries de TV por título.  
  [Documentação](https://developer.themoviedb.org/reference/search-tv)

- **Pesquisar pessoas**  
  `GET /search/person`  
  Permite pesquisar pessoas (atores, diretores, etc.) por nome.  
  [Documentação](https://developer.themoviedb.org/reference/search-person)

---

### 🖼️ Imagens

- **Configuração de imagens**  
  `GET /configuration`  
  Obtém informações sobre a configuração de imagens, como tamanhos disponíveis.  
  [Documentação](https://developer.themoviedb.org/reference/configuration-details)

- **Construir URLs de imagens**  
  Utilize os dados obtidos do endpoint de configuração para construir URLs de imagens.  
  [Documentação](https://developer.themoviedb.org/docs/image-basics)

---

### 🗺️ Configurações Regionais

- **Detalhes de configuração**  
  `GET /configuration`  
  Obtém informações sobre configurações regionais, como idiomas e fusos horários.  
  [Documentação](https://developer.themoviedb.org/reference/configuration-details)

---

## 🧰 Exemplos de Requisições

Para utilizar esses endpoints, faça requisições HTTP utilizando a sua chave da API:

```bash
https://api.themoviedb.org/3/movie/550?api_key=YOUR_API_KEY
