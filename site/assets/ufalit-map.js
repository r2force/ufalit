(() => {
  const atlas = document.querySelector('.atlas');
  if (!atlas) return;
  // Text and image references are drawn from the corresponding places pages.
  const places = {
    'places-text-004': ['Мемориальный Дом-музей С. Т. Аксакова', 'ул. Зайнуллы Расулева, 4', 'Мемориальный Дом-музей С.Т. Аксакова (филиал Национального музея РБ), представляющий собой образец деревянной архитектуры конца XVIII века, располагается на берегу р. Белой.', 'assets/places/aksakov/image003.jpg'],
    'places-text-016': ['Аксаковский народный дом', 'угол ул. Ленина и ул. Пушкина', 'В 1908 году Уфимская дума приняла решение построить Аксаковский народный дом для увековечивания памяти писателя. Здание заложили в 1909 году, а достроили в 1920 году.', 'assets/places/aksakov/image011.jpg'],
    'places-text-031': ['Аксаковский сад', 'ул. А. Пушкина', 'Сад им. С.Т. Аксакова находится на улице Пушкина. На улице Голубиная слободка когда-то стоял домик, где Сергей Аксаков родился и провел свои детские годы.', 'assets/gallery/aksakov/311.jpg'],
    'places-text-248': ['Дом-музей Мажита Гафури', 'ул. Гоголя, 28', 'Мемориальный Дом-музей М. Гафури — филиал Национального музея РБ. Открыт в 1948 году в доме, подаренном поэту правительством республики.', 'assets/places/gafuri/image001.jpg'],
    'places-text-318': ['Улица Мустая Карима', 'Уфа', 'Бывшая ул. Социалистическая. Идет от ул. Коммунистической до ул. Революционной, между ул. Карла Маркса и ул. Ленина.', 'assets/persons/karim/03.jpg'],
    'places-text-437': ['Центральная городская детская библиотека им. Ш. А. Худайбердина', 'Уфа', 'История библиотеки и мемориального уголка Шагита Худайбердина — в разделе памятных мест.', 'assets/places/hudaiberdin/image021.jpg']
  };
  const title = atlas.querySelector('.atlas-feature h3');
  const address = atlas.querySelector('.atlas-feature p');
  const image = atlas.querySelector('.atlas-feature img');
  const description = atlas.querySelector('.atlas-description');
  const more = atlas.querySelector('.atlas-more');
  const links = atlas.querySelectorAll('.atlas-choices a, .atlas-pins a');
  function select(id) {
    const place = places[id];
    if (!place) return;
    [title.textContent, address.textContent, description.textContent, image.src] = place;
    image.alt = place[0];
    more.href = `pages/places/#${id}`;
    links.forEach(link => link.classList.toggle('is-selected', link.hash === `#${id}`));
  }
  links.forEach(link => link.addEventListener('click', event => {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    select(link.hash.slice(1));
  }));
  select('places-text-004');
})();
