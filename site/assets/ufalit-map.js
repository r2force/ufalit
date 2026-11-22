(() => {
  const atlas = document.querySelector('.atlas');
  if (!atlas) return;
  // Excerpts and images are taken from the corresponding entries in pages/places/.
  const places = {
  "places-text-004": {
    "title": "Мемориальный Дом-музей С. Т. Аксакова",
    "writer": "Аксаков Сергей Тимофеевич",
    "category": "Дом-музей",
    "address": "ул. Зайнуллы Расулева, 4",
    "image": "assets/places/aksakov/image003.jpg",
    "quote": "«А окна из столовой на улицу, возвышались аршина на три над землей; парадное крыльцо имело более двадцати пяти ступенек, и с него была видна река Белая почти во всю ширину».",
    "paragraphs": [
      "Мемориальный Дом-музей С.Т. Аксакова (филиал Национального музея РБ), представляющий собой образец деревянной архитектуры конца XVIII века, располагается на берегу р. Белой.",
      "Дом построен из уральской лиственницы, до настоящего времени сохранилось анфиладное построение комнат. Дом построен в конце XVIII века, стоит на косогоре. Размер дома - длина по ул. Зайнуллы Расулева – 44 м., а по ул. Салавата – 22 метра. Возраст его тоже достаточно солидный – более 250 лет. Здесь с 1795 по 1797 проживала семья писателя. Как «родовое гнездо» уфимский дом Аксаковых известен читателям по книге С.Т. Аксакова «Детские годы Багрова - внука»."
    ]
  },
  "places-text-016": {
    "title": "Аксаковский народный дом",
    "writer": "Аксаков Сергей Тимофеевич",
    "category": "Театр и Народный дом",
    "address": "угол ул. Ленина и ул. Пушкина",
    "image": "assets/places/aksakov/image011.jpg",
    "quote": "«Стиль его будет занятный: с одной стороны ренессанс, а с другой стороны - восточно-азиатский. Что из такого строительного флюса выйдет – Аллах знает!» — С.Р. Минцлов, дневник «Дебри жизни»",
    "paragraphs": [
      "Это единственное в своем роде здание, одно из ярких достопримечательностей столицы, имеет интересную историю. В 1909 году, когда вся Россия отмечала 50-летие со дня смерти великого русского писателя – С. Аксакова, 30 ноября 1908 года Уфимская дума приняла решение: построить в Уфе на добровольные пожертвования Аксаковский народный дом для увековечивания памяти этого замечательного человека. Был объявлен конкурс на лучший проект здания и сбор средств на его сооружение. По России было представлено 24 проекта. Взыскательное жюри отобрало лучший - проект губернского инженера Павла Павловича Рудавского. Интерьер спланировал архитектор Бондаренко. Здание строилось долго – заложили в 1909 г., а достроили только в 1920 г.",
      "В здании как бы соединились два стиля – если взглянуть с улицы Ленина, то видно, что главенствует русский классицизм, а со стороны улицы Пушкина преобладает мусульманский, восточный стиль (удлиненные прорези окон создают оригинальный вид.)"
    ]
  },
  "places-text-031": {
    "title": "Аксаковский сад",
    "writer": "Аксаков Сергей Тимофеевич",
    "category": "Парк и сквер",
    "address": "ул. А. Пушкина",
    "image": "assets/gallery/aksakov/311.jpg",
    "paragraphs": [
      "Сад им. С.Т. Аксакова находится на улице Пушкина. На улице Голубиная слободка (ул. Пушкина) когда-то стоял домик, купленный матерью Сергея Тимофеевича, где Сергей родился и провел свои детские годы. Усадебный дом стоял рядом с современным входом в сад со стороны ул. Пушкина, сгорел в 1821 году. На месте усадьбы позднее был разбит парк, поменявший за полтора с лишним века несколько владельцев и названий. Как общественный сад он был заложен на пожертвования купца Н. Блохина в 1833 году. В саду было много качелей, каруселей, деревянный летний театр, сгоревший в 1893 году."
    ]
  },
  "places-text-248": {
    "title": "Дом-музей Мажита Гафури",
    "writer": "Мажит Гафури",
    "category": "Дом-музей",
    "address": "ул. Гоголя, 28",
    "image": "assets/places/gafuri/image001.jpg",
    "paragraphs": [
      "Мемориальный Дом-музей М. Гафури - филиал Национального музея РБ в Уфе, ул. Гоголя, 28. Открыт в 1948 г. в доме, который был подарен Мажиту Гафури правительством Республики в связи с его юбилеем и присвоением ему звания Народного поэта Башкирии (1923).",
      "Одноэтажный, деревянный дом с двумя парадными дверями и шестью окнами на улицу Гоголя. Уличный фасад удлиненный, имеется мезонин со стороны двора. Дом построен в 1860 г. и до революции принадлежал Гиневским. После Октябрьской революции он был передан под детский диспансер. Архитектура характерна для построек Уфы XIX в. Карнизы окон и крыльцо украшены резьбой по дереву. Крыша железная, скатная. Здание не перестраивалось. В комнатах дома создана мемориальная экспозиция с подлинным интерьером."
    ]
  },
  "places-text-318": {
    "title": "Улица Мустая Карима",
    "writer": "Мустай Карим",
    "category": "Улица",
    "address": "Уфа",
    "image": "assets/places/karim/image039.jpg",
    "paragraphs": [
      "Бывшая ул. Социалистическая. Идет от ул. Коммунистической до ул. Революционной, между ул. Карла Маркса и ул. Ленина."
    ]
  },
  "places-text-437": {
    "title": "Центральная городская детская библиотека им. Ш. А. Худайбердина",
    "writer": "Шагит Худайбердин",
    "category": "Библиотека",
    "address": "Уфа",
    "image": "assets/places/hudaiberdin/image021.jpg",
    "paragraphs": [
      "В 1927 году при Центральной массовой библиотеке областного (республиканского) Комитета профсоюзов советских торговых служащих был открыт небольшой детский сектор.",
      "Сегодня ЦГДБ – это информационный и досуговый центр для детей и подростков столицы. В деятельность библиотеки внедряются интерактивные формы работы, новые информационные технологии. Расширяется парк компьютерной техники, созданы электронные каталоги и картотеки, есть доступ в ИНТЕРНЕТ, разработан свой сайт."
    ]
  }
};
  const title = atlas.querySelector('.atlas-feature h3');
  const writer = atlas.querySelector('.atlas-writer');
  const category = atlas.querySelector('.atlas-kicker');
  const address = atlas.querySelector('.atlas-address');
  const image = atlas.querySelector('.atlas-feature img');
  const quote = atlas.querySelector('.atlas-quote');
  const description = atlas.querySelector('.atlas-description');
  const more = atlas.querySelector('.atlas-more');
  const links = atlas.querySelectorAll('.atlas-choices a, .atlas-pins a');
  // SVG links expose an SVGAnimatedString as href and have no HTMLAnchorElement.hash.
  const targetId = link => (link.getAttribute('href') || '').split('#')[1];
  function select(id) {
    const place = places[id];
    if (!place) return;
    title.textContent = place.title;
    writer.textContent = place.writer;
    category.textContent = place.category;
    address.textContent = place.address;
    image.src = place.image;
    image.alt = place.title;
    quote.textContent = place.quote || '';
    quote.hidden = !place.quote;
    description.replaceChildren(...place.paragraphs.map(text => {
      const paragraph = document.createElement('p');
      paragraph.textContent = text;
      return paragraph;
    }));
    description.scrollTop = 0;
    more.href = `pages/places/#${id}`;
    links.forEach(link => {
      const selected = targetId(link) === id;
      link.classList.toggle('is-selected', selected);
      if (selected) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  }
  links.forEach(link => link.addEventListener('click', event => {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const id = targetId(link);
    if (!places[id]) return;
    event.preventDefault();
    select(id);
    if (window.matchMedia("(max-width: 48rem)").matches) {
      atlas.querySelector(".atlas-key").scrollIntoView({block: "nearest"});
    }
  }));
  select('places-text-004');
})();
