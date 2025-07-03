# featManga - Busca Personalizada de Mangás com MangaDex API

O featManga é uma aplicação que permite aos usuários encontrar mangás que combinam com seus gostos pessoais, unindo múltiplos gêneros e filtros avançados. Utilizando a API do MangaDex, o sistema oferece buscas dinâmicas por título, tags, demografia, status, classificação de conteúdo, e ordenação, proporcionando uma experiência única e personalizada.

## Funcionalidades

- Busca por título ou múltiplas tags (ex.: Action + Romance, sem Harem)
- Filtros por status (ongoing, completed), demografia (shounen, seinen, etc.) e classificação de conteúdo (safe, erotica)
- Ordenação por relevância, rating, seguidores e data de upload
- Paginação para navegação eficiente
- Suporte a múltiplos idiomas e versões romanizadas
- Integração com links externos (MyAnimeList, Anilist, etc.) para mais informações

## Como usar

1. Clone este repositório
2. Configure sua chave de API (se aplicável)
3. Execute o script para realizar buscas personalizadas
4. Explore os mangás sugeridos conforme seus interesses

## Tecnologias

- JavaScript / Node.js
- Axios para requisições HTTP
- API MangaDex (https://api.mangadex.org)

## Exemplo de requisição

```js
const axios = require('axios');
const baseUrl = 'https://api.mangadex.org';

async function searchMangaByTags(includedTags, excludedTags) {
  const tags = await axios(`${baseUrl}/manga/tag`);
  const includedTagIDs = tags.data.data
    .filter(tag => includedTags.includes(tag.attributes.name.en))
    .map(tag => tag.id);
  const excludedTagIDs = tags.data.data
    .filter(tag => excludedTags.includes(tag.attributes.name.en))
    .map(tag => tag.id);

  const resp = await axios.get(`${baseUrl}/manga`, {
    params: {
      includedTags: includedTagIDs,
      excludedTags: excludedTagIDs,
      'order[followedCount]': 'desc'
    }
  });

  return resp.data.data.map(manga => manga.attributes.title.en || 'Sem título');
}
