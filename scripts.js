/**
 * Verkefnalýsing fyrir verkefni 7 með mörgum athugasemdum, sjá einnig yfirferð í fyrirlestri 9.
 * Sjá `scripts-plain.js` fyrir lausn án athugasemda.
 * Föll og breytur eru skjalaðar með jsdoc, athugasemdir á þessu:
 * // formi eru til nánari útskýringa.
 * eru aukalega og ekki nauðsynlegar.
 * Kóðabútar eru innan ``.
 *
 * @see https://jsdoc.app/
 */

// Til að byrja með skilgreinum við gögn sem við notum í forritinu okkar. Við þurfum að skilgreina
// - Vörur sem er hægt að kaupa
// - Körfu sem geymir vörur sem notandi vill kaupa
// Í báðum tilfellum notum við gagnaskipan (e. data structure) með því að nota hluti (objects),
// fylki (array) og grunn gildi (e. primitive values) eins og tölur (numbers) og strengi (string).

// Hér notum við _typedef_ til að skilgreina hvernig Product hluturinn okkar lítur út.
// Þetta er ekki JavaScript heldur sérstök skilgreining frá JSDoc sem VSCode notar til að hjálpa
// okkur við að skrifa með því að birta intellisense/autocomplete og hugsanlega sýna villur.
// Við getum látið VSCode sýna okkur villur:
// - Opna „Settings“ með Cmd + , (macOS) eða Ctrl + , (Windows) og slá „check js“ í leitargluggann.
// - Velja „JavaScript › Implicit Project Config: Check JS“ og haka í.
// https://code.visualstudio.com/docs/nodejs/working-with-javascript#_type-checking-javascript

/**
 * @typedef {Object} product
 * @property {number} id Auðkenni vöru, jákvæð heiltala stærri en 0.
 * @property {string} title Titill vöru, ekki tómur strengur.
 * @property {string} description Lýsing á vöru, ekki tómur strengur.
 * @property {number} price Verð á vöru, jákvæð heiltala stærri en 0.
 */

// Við viljum geta haft fleiri en eina vöru þannig að við þurfum að hafa fylki af vörum.
// Við byrjum með fylki sem hefur færslur en gætum síðan í forritinu okkar bætt við vörum.

/**
 * Fylki af vörum sem hægt er að kaupa.
 * @type {Array<Product>}
 */
const products = [
  // Fyrsta stak í fylkinu, verður aðgengilegt sem `products[0]`
  {
    // Auðkennið er eitthvað sem við bara búum til sjálf, verður að vera einkvæmt en engin regla í
    // JavaScript passar upp á það.
    // Þar sem það er aðeins ein tegund af tölum í JavaScript þá verðum við að passa okkur hér að
    // nota heiltölu, ekkert sem bannar okkur að setja `1.1`.
    // Ef við kveikjum á að VSCode sýni villur og við breytum þessu í t.d. streng munum við sjá
    // villu með rauðum undirlínum og færslu í `Problems` glugganum.
    id: 1,

    // Titill er strengur, en gæti verið „tómi strengurinn“ (e. empty string) sem er bara `''`.
    // JavaScript gerir ekki greinarmun á tómum streng og strengjum sem innihalda eitthvað.
    // Við gætum líka notað `""` eða ` `` ` (backticks) til að skilgreina strengi en venjan er að
    // nota einfaldar gæsalappir/úrfellingarkommur (e. single quotes).
    title: 'HTML húfa',

    // Hér skilgreinum við streng í nýrri línu á eftir skilgreiningu á lykli (key) í hlutnum.
    description:
      'Húfa sem heldur hausnum heitum og hvíslar hugsanlega að þér hvaða element væri best að nota.',

    // Verð sem jákvæð heiltala. Getum líka notað `1000` en það er hægt að nota undirstrik (_) til
    // að gera stórar tölur læsilegri, t.d. `100_000_000`.
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#numeric_separators
    price: 5_000,
  },
  {
    id: 2,
    title: 'CSS sokkar',
    description: 'Sokkar sem skalast vel með hvaða fótum sem er.',
    price: 3_000,
  },
  {
    id: 3,
    title: 'JavaScript jakki',
    description: 'Mjög töff jakki fyrir öll sem skrifa JavaScript reglulega.',
    price: 20_000,
  },

  // Hér gætum við bætt við fleiri vörum í byrjun.
];

/**
 * @typedef {Object} cartLine
 * @property {Product} product Vara í körfu.
 * @property {number} quantity Fjöldi af vöru.
 */

/**
 * @typedef {Object} Cart
 * @property {Array<CartLine>} lines Fylki af línum í körfu.
 * @property {string|null} name Nafn á kaupanda ef skilgreint, annars `null`.
 * @property {string|null} address Heimilisfang kaupanda ef skilgreint, annars `null`.
 */

// Við notum `null` sem gildi fyrir `name` og `address` áður en notandi hefur skilgreint þau.

/**
 * Karfa sem geymir vörur sem notandi vill kaupa.
 * @type {Cart}
 */
const Cart = {
  lines: [],
  name: null,
  address: null,
};

// Nú höfum við skilgreint gögnin sem forritið okkar notar. Næst skilgreinum við föll sem vinna með
// gögnin og inntak frá notanda.
// Athugið að hér erum við að setja öll föll í sömu skrá og sama scope, það myndi hjálpa okkur að
// setja föll í mismunandi skrár og nota módúla til að tengja saman, við gerum það í verkefni 8.

// --------------------------------------------------------
// Hjálparföll

/**
 * Sníða (e. format) verð fyrir íslenskar krónur með því að nota `Intl` vefstaðalinn.
 * Athugið að Chrome styður ekki íslensku og mun því ekki birta verð formuð að íslenskum reglum.
 * @example
 * const price = formatPrice(123000);
 * console.log(price); // Skrifar út `123.000 kr.`
 * @param {number} price Verð til að sníða.
 * @returns {string}Verð sniðið með íslenskum krónu.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl
 */
function formatPrice(price) {
  return price.toString();
}

/**
 * Athuga hvort `num` sé heiltala á bilinu `[min, max]`.
 * @param {number} num Tala til að athuga.
 * @param {number} min Lágmarksgildi tölu (að henni meðtaldri), sjálfgefið `0`.
 * @param {number} max Hámarksgildi tölu (að henni meðtaldri), sjálfgefið `Infinity`.
 * @returns `true` ef `num` er heiltala á bilinu `[min, max]`, annars `false`.
 */
function validateInteger(num, min = 0, max = Infinity) {
  return  min <= num && num <= max;
}

/**
 * Sníða upplýsingar um vöru og hugsanlega fjölda af henni til að birta notanda.
 * @example
 * ```text
 * HTML húfa — 5.000 kr.
 * CSS sokkar — 2x3.000 kr. samtals 6.000 kr.
 * ```
 * @param {Product} product Vara til að birta
 * @param {number | undefined} quantity Fjöldi af vöru, `undefined` ef ekki notað.
 * @returns Streng sem inniheldur upplýsingar um vöru og hugsanlega fjölda af henni.
 */
function formatProduct(product, quantity = undefined) {

  if (quantity && quantity > 1) {
    const total = formatPrice (quantity * product.price);
    return `${product.title} - ${quantity} x ${formatPrice(product.price)} samtals ${total}` ;
}
  return `${product.title} - ${product.price} kr.`;
} 

/**
 * Skila streng sem inniheldur upplýsingar um körfu.
 * @example
 * ```text
 * HTML húfa — 5.000 kr.
 * CSS sokkar — 2x3.000 kr. samtals 6.000 kr.
 * Samtals: 11.000 kr.
 * ```
 * @param {Cart} cart Karfa til að fá upplýsingar um.
 * @returns Streng sem inniheldur upplýsingar um körfu.
 */
function cartInfo(cart) {
  let total = 0;
  const lines = cart.lines.map(item => {
    const product = products.find(p => p.id === item.product.id);
    if (!product) return '';

    const itemTotal = product.price * item.quantity;
    total += itemTotal;

    if (item.quantity === 1) {
      return `${product.title} — ${product.price.toLocaleString()} kr.`;
    }

    return `${product.title} - ${item.quantity}x${product.price.toLocaleString()} kr. samtals ${itemTotal.toLocaleString()} kr.`;
  }).filter(Boolean);
  
  lines.push(`Samtals: ${total.toLocaleString()} kr. `);
  return lines.join('/n');
}

// -------------------------------------------------
function addProduct(add) {
  const title = prompt('Titill:');
  if (!title) {
    console.error('Titill má ekki vera tómur.');
    return;
  }

  const description = prompt('Lýsing:');
  if (!description) {
    console.error('Lýsing má ekki vera tóm.');
    return;
  }

  const priceAsString = prompt('Verð:');
  if (!priceAsString) {
    console.error('Verð má ekki vera tómt.');
    return;
  }


  const price = validateInteger(priceAsString, 'Verð verður að vera jákvæð heiltala', 1);
  if (price === null) return; 

  const id = products.length +1;

  const product = {
    id,
    title,
    description,
    price
  };

  products.push(product);

  console.info('Vöru bætt við:\n${formatProduct(product)}');
}

function validateInteger(input, errorMessage, min = 0, max) {
  const number = Number.parseInt(input, 10);
  if (Number.isNaN(number) || number < min || (max !== undefined && number >= max)) {
    console.error(errorMessage);
    return null;
  }
  return number;
}
function formatProduct(product) {
  return `#${product.id} ${product.title} — ${product.description} — ${formatPrice(product.price)}`;
}

function formatPrice(price) {
  return `${price.toLocaleString()} kr.`;
}
/**
 * Birta lista af vörum í console.
 * @example
 * ```text
 * #1 HTML húfa — Húfa sem heldur hausnum heitum og hvíslar hugsanlega að þér hvaða element væri best að nota. — 5.000 kr.
 * ```
 * @returns undefined
 */
function formatProduct(product) {
  return `#${product.id} ${product.title} — ${product.description} — ${formatPrice(product.price)}`;
}

function showProducts() {
  if (products.length === 0) {
    console.log('Engar vörur eru til í kerfinu.');
    return;
  }

  console.log('Vörur í boði:');
  for (const product of products) {
    console.log(`${product.id}: ${product.title}, ${formatPrice(product.price)}`);
  }
}

function formatPrice(price) {
  return `${price.toLocaleString()} kr.`;
}



function addProductToCart() {
  const productIdAsString = prompt('Auðkenni vöru sem á að bæta í körfu:');
  if (!productIdAsString){
  return;
}

  const productId = validateInteger(productIdAsString, 'id verður að vera heiltala');
  if (productId === null) return;

  const product = products.find(p => p.id === productId);
  if (!product) {
    console.error('Vara fannst ekki')
    return;
  }

  const quantityAsString = prompt('Hversu mikið magn viltu af vörunni?');
  const quantity = validateInteger(quantityAsString, 'Magnið þarf að vera jákvæð heiltala');
  if (quantity === null) return;

  let line = Cart.lines.find(l => l.product.id === productId);
  if (line) {
    line.quantity += quantity;
  } else {
    line = {product, quantity};
    Cart.lines.push(line);
  }

  console.log(`Bætti ${quantity} stk af "${product.title}" í körfu.`);

}

function validateInteger(input, errorMessage, min = 1, max = Number.MAX_SAFE_INTEGER) {
  const number = Number.parseInt(input);
  if (Number.isNaN(number) || number < min || number > max) {
    console.error(errorMessage);
    return null;
  }
  return number;
  

}

/**
 * Birta upplýsingar um körfu í console. Ef ekkert er í körfu er „Karfan er tóm.“ birt, annars
 * birtum við upplýsingar um vörur í körfu og heildarverð.
 *
 * @example
 * ```text
 * HTML húfa — 5.000 kr.
 * CSS sokkar — 2x3.000 kr. samtals 6.000 kr.
 * Samtals: 11.000 kr.
 * ```
 * @returns undefined
 */
function showCart() {
  if (cart.lines.length === 0) {
    console.log('Karfan er tóm.');
    return;
  }

  let total = 0;
  console.log('Þú hefur valið:');
  for (const item of cart.lines) {
    const product = products.find(p => p.id === item.product.id);
    if (product) {
      const itemTotal = product.price * item.quantity;
      total += itemTotal;
      console.log(`${product.title} — ${item.quantity}x${product.price.toLocaleString()} kr. samtals ${itemTotal.toLocaleString()} kr.`);
    }
  }
  console.log(`Samtals: ${total.toLocaleString()} kr.`);
}

function checkout() {
  if (Cart.lines.length === 0) {
    console.log('Karfan er tóm.');
    return;
  }

  const name = prompt('Vinsamlegast sláðu inn nafnið þitt:');
  if (!name) {
    console.error('Nafn má ekki vera tómt');
    return;
  }

  const address = prompt('Vinsamlegast sláðu inn heimilisfangið þitt:');
  if (!address) {
    console.error('Heimilisfang má ekki vera tómt');
    return;
  }

  console.log(`Pöntun móttekin ${name}.`);
  console.log(`Vörur verða sendar á ${address}.`);
  console.log('');

  

  Cart.lines.length = 0;
}

