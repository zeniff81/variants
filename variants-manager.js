const VARIANTS = (function () {
  let selectedChoices = []
  let availableVariants = []
  let selectedVariants = []
  let currentProduct;

  const logChoices = () => console.log(selectedChoices)

  const addChoice = (choice) => {
    if (choice === null || typeof choice === 'undefined') return

    let choiceAdded
    if (selectedChoices.indexOf(choice) === -1) {
      selectedChoices.push(choice)
      choiceAdded = true
    } else {
      const idx = selectedChoices.indexOf(choice)
      selectedChoices.splice(idx, 1)
      choiceAdded = false
    }

    console.log(selectedChoices)
    return choiceAdded
  }

  const initVariants = product => {
    currentProduct = product
    if (product.product_variants === null) return

    selectedChoices.length = 0
    availableVariants.length = 0
    selectedVariants.length = 0

    product.product_variants.forEach(variant => {
      availableVariants.push({
        id: variant.id,
        variation_value1: { ...variant.variation_value1 },
        variation_value2: { ...variant.variation_value2 },
        variation_value3: { ...variant.variation_value3 }
      })
    })
  }
  const findMatchingVariants = () => {
    const filteredArray = availableVariants.filter(obj => selectedChoices.some(val => {
      return obj.variation_value1.variation_option_id === val ||
        obj.variation_value2.variation_option_id === val;
    }))

    return filteredArray
  }

  return {
    selectedChoices,
    addChoice,
    logChoices,
    initVariants,
    availableVariants,
    findMatchingVariants,
    selectedVariants,
    currentProduct
  }
})()

window.variants = VARIANTS

const newElement = (props) => {
  const { type, className, style } = props

  const elem = document.createElement(type)
  elem.classList.add(className)
  elem.style.cssText = style
  return elem
}

function clickChoice(e, choice, optionId){
  const choiceAdded = VARIANTS.addChoice(choice.id)
  VARIANTS.selectedVariants = VARIANTS.findMatchingVariants()
  const updatedChoices = getChoicesValues(VARIANTS.selectedVariants)
  updateAvailableChoices(updatedChoices)

  e.target.checked = choiceAdded

  const option = document.querySelector(`[data-option-id="${optionId}"]`);
  option.setAttribute('data-locked', true)
}

const generateOptionChoices = (choices, optionId) => {
  const variant__choices = newElement({
    type: 'div',
    className: 'variant__choices'
  })

  choices.map(choice => {
    const variant__choice = newElement({ type: 'label', className: 'variant__choice', style: "padding: .2rem; display: flex;" })
    variant__choice.setAttribute('data-choice-id', choice.id)

    const radio = newElement({ type: 'input', className: 'choice-radio' })
    radio.setAttribute('type', 'radio')
    radio.name = optionId
    radio.onclick = e => clickChoice(e, choice, optionId)

    const text = newElement({ type: 'div' })
    text.innerText = choice.display_value

    variant__choice.appendChild(radio)
    variant__choice.appendChild(text)
    variant__choices.appendChild(variant__choice)
  })

  return variant__choices
}

const generateVariantsOptions = (options) => {
  if (options === null) return

  options.map(option => {
    const variant__option = document.createElement('div')
    variant__option.classList.add('variant__option')
    variant__option.setAttribute('data-option-id', option.id)

    const title = document.createElement('div')
    title.classList.add('variants__option-title')
    title.innerText = option.name

    const choices = generateOptionChoices(option.product_variant_choices, option.id)

    variant__option.appendChild(title)
    variant__option.appendChild(choices)
    document.querySelector(".variant__options__container").appendChild(variant__option)
  })
}

const updateAvailableChoices = (arrChoices, arrOptionsToSkip=[]) => {
  const variant__choices = document.querySelectorAll('.variant__choice')
  variant__choices.forEach(choice => choice.style.opacity = 0.3)
  variant__choices.forEach(choice => choice.style.pointerEvents = 'none')


  const arrOptions = document.querySelectorAll('variant__option')

  arrChoices.forEach((choice) => {
    const variant__choice = document.querySelector(`[data-choice-id="${choice}"]`);
    if (variant__choice !== null) {
      variant__choice.style.opacity = 1
      variant__choice.style.pointerEvents = 'auto'
    }
  })
}

const getChoicesValues = product_variants => {
  const initialChoices = []
  product_variants.forEach(product => {
    initialChoices.push(product.variation_value1?.variation_option_id)
    initialChoices.push(product.variation_value2?.variation_option_id)
    initialChoices.push(product.variation_value3?.variation_option_id)
  })
  return initialChoices
}

const loadVariants = (product) => {
  document.querySelector('.variants__name').innerText = product.name
  document.querySelector('.variants__id').innerText = 'Id: ' + product.id
  document.querySelector('.variants__price').innerText = '$ ' + product.price

  generateVariantsOptions(product.product_variant_options)

  const initialChoices = getChoicesValues(product.product_variants)
  updateAvailableChoices(initialChoices.filter(c => typeof c !== 'undefined'))

  VARIANTS.initVariants(product)
}

const addToCartVariantProduct = () => {
  hideVariants()
}

const hideVariants = () => {
  document.querySelector('.variants__container').style.transform = 'translateX(-1rem)'
  document.querySelector('.variants__container').style.opacity = 0
  document.querySelector('.variants__container').style.zIndex = -1
  document.querySelector(".variant__options__container").innerHTML = ''
}

const showVariants = (product) => {
  document.querySelector('.variants__container').style.transform = 'translateX(0px)'
  document.querySelector('.variants__container').style.opacity = 1
  document.querySelector('.variants__container').style.zIndex = 1
  document.querySelector('.variants__container').setAttribute('data-product_id', product.id)
  loadVariants(product)
}


function dummyProduct() {
  console.log('using DUMMY PRODUCT')
  return {
    id: 11421,
    banner: null,
    product_type: 1,
    fulfillment_type: 1,
    sku: "345678",
    name: "Variant product",
    description: null,
    short_description: null,
    stock: 999,
    images: [{
      source: "https://storage.googleapis.com/store-assets-bucket/Asset%203.png",
      sizes: null,
      is_stock: true
    }],
    original_from_price: null,
    original_price: null,
    price: 0,
    price_base: null,
    product_category_ids: null,
    discount_percentage: 0,
    is_shippable: true,
    is_taxable: false,
    tax_ex_from_price: null,
    tax_ex_price: null,
    is_variant_available: true,
    shipping_charge: null,
    pickup_prep_time_unit: 0,
    pickup_prep_time_length: 0,
    product_categories: null,
    product_variant_options: [{
      id: 354,
      company_id: 14783,
      value_type_id: 1,
      name: "Size",
      product_variant_choices: [{
        id: 2756,
        variation_option_set_id: 354,
        display_value: "S",
        display_order: 1
      },
      {
        id: 2757,
        variation_option_set_id: 354,
        display_value: "M",
        display_order: 2
      },
      {
        id: 2758,
        variation_option_set_id: 354,
        display_value: "L",
        display_order: 3
      },
      {
        id: 2759,
        variation_option_set_id: 354,
        display_value: "XL",
        display_order: 4
      }
      ]
    },
    {
      id: 355,
      company_id: 14783,
      value_type_id: 1,
      name: "Color",
      product_variant_choices: [{
        id: 2760,
        variation_option_set_id: 355,
        display_value: "Red",
        display_order: 1
      },
      {
        id: 2761,
        variation_option_set_id: 355,
        display_value: "Blue",
        display_order: 2
      },
      {
        id: 2762,
        variation_option_set_id: 355,
        display_value: "Yellow",
        display_order: 3
      },
      {
        id: 2763,
        variation_option_set_id: 355,
        display_value: "Black",
        display_order: 4
      }
      ]
    }
    ],
    product_variants: [
      {
        id: 10851,
        banner: null,
        product_type: 1,
        fulfillment_type: 1,
        sku: "13321",
        name: "New Services Nov25",
        description: null,
        short_description: null,
        stock: 99,
        images: [{
          source: "https://storage.googleapis.com/store-assets-bucket/Asset%203.png",
          sizes: null,
          is_stock: true
        }],
        original_from_price: 6,
        original_price: 6,
        price: 6,
        price_base: 6,
        discount_percentage: 0,
        is_shippable: true,
        is_taxable: true,
        tax_ex_from_price: 6,
        tax_ex_price: 6,
        shipping_charge: null,
        variation_value1: {
          header: "Color",
          variation_option_id: 2761,
          value: "Blue",
          send_images: false
        },
        variation_value2: {
          header: "Size",
          variation_option_id: 2757,
          value: "M",
          send_images: true
        },
        variation_value3: null
      },
      {
        id: 15455,
        banner: null,
        product_type: 1,
        fulfillment_type: 1,
        sku: "123344",
        name: "Red/S",
        description: null,
        short_description: null,
        stock: 87,
        images: [{
          source: "https://storage.googleapis.com/store-assets-bucket/Asset%203.png",
          sizes: null,
          is_stock: true
        }],
        original_from_price: 10,
        original_price: 10,
        price: 10,
        price_base: 10,
        discount_percentage: 0,
        is_shippable: true,
        is_taxable: true,
        tax_ex_from_price: 10,
        tax_ex_price: 10,
        shipping_charge: null,
        variation_value1: {
          header: "Color",
          variation_option_id: 2762,
          value: "Yellow",
          send_images: false
        },
        variation_value2: {
          header: "Size",
          variation_option_id: 2756,
          value: "S",
          send_images: true
        },
        variation_value3: null
      },
      {
        id: 12422,
        banner: null,
        product_type: 1,
        fulfillment_type: 1,
        sku: "123344",
        name: "Red/S",
        description: null,
        short_description: null,
        stock: 87,
        images: [{
          source: "https://storage.googleapis.com/store-assets-bucket/Asset%203.png",
          sizes: null,
          is_stock: true
        }],
        original_from_price: 10,
        original_price: 10,
        price: 10,
        price_base: 10,
        discount_percentage: 0,
        is_shippable: true,
        is_taxable: true,
        tax_ex_from_price: 10,
        tax_ex_price: 10,
        shipping_charge: null,
        variation_value1: {
          header: "Color",
          variation_option_id: 2760,
          value: "Red",
          send_images: false
        },
        variation_value2: {
          header: "Size",
          variation_option_id: 2757,
          value: "M",
          send_images: true
        },
        variation_value3: null
      },
      {
        id: 13433,
        banner: null,
        product_type: 1,
        fulfillment_type: 1,
        sku: "123344",
        name: "Red/S",
        description: null,
        short_description: null,
        stock: 87,
        images: [{
          source: "https://storage.googleapis.com/store-assets-bucket/Asset%203.png",
          sizes: null,
          is_stock: true
        }],
        original_from_price: 10,
        original_price: 10,
        price: 10,
        price_base: 10,
        discount_percentage: 0,
        is_shippable: true,
        is_taxable: true,
        tax_ex_from_price: 10,
        tax_ex_price: 10,
        shipping_charge: null,
        variation_value1: {
          header: "Color",
          variation_option_id: 2763,
          value: "Black",
          send_images: false
        },
        variation_value2: {
          header: "Size",
          variation_option_id: 2758,
          value: "L",
          send_images: true
        },
        variation_value3: null
      },
      {
        id: 14444,
        banner: null,
        product_type: 1,
        fulfillment_type: 1,
        sku: "123344",
        name: "Red/S",
        description: null,
        short_description: null,
        stock: 87,
        images: [{
          source: "https://storage.googleapis.com/store-assets-bucket/Asset%203.png",
          sizes: null,
          is_stock: true
        }],
        original_from_price: 10,
        original_price: 10,
        price: 10,
        price_base: 10,
        discount_percentage: 0,
        is_shippable: true,
        is_taxable: true,
        tax_ex_from_price: 10,
        tax_ex_price: 10,
        shipping_charge: null,
        variation_value1: {
          header: "Color",
          variation_option_id: 2763,
          value: "black",
          send_images: false
        },
        variation_value2: {
          header: "Size",
          variation_option_id: 2756,
          value: "S",
          send_images: true
        },
        variation_value3: null
      },
      {
        id: 11423,
        banner: null,
        product_type: 1,
        fulfillment_type: 1,
        sku: "2222",
        name: "Yellow/L",
        description: null,
        short_description: null,
        stock: 40,
        images: [{
          source: "https://storage.googleapis.com/store-assets-bucket/Asset%203.png",
          sizes: null,
          is_stock: true
        }],
        original_from_price: 3,
        original_price: 3,
        price: 3,
        price_base: 3,
        discount_percentage: 0,
        is_shippable: true,
        is_taxable: true,
        tax_ex_from_price: 3,
        tax_ex_price: 3,
        shipping_charge: null,
        variation_value1: {
          header: "Color",
          variation_option_id: 2762,
          value: "Yellow",
          send_images: false
        },
        variation_value2: {
          header: "Size",
          variation_option_id: 2758,
          value: "L",
          send_images: true
        },
        variation_value3: null
      }
    ],
    is_subscription_available: false,
    subscription_details: null,
    meta_title: null,
    meta_description: null,
    meta_keywords: null,
    image_tags: null,
    created_date: "2023-01-19T04:41:07.683"
  }


}

// --------------- test start -----------------
const test1 = () => {
  console.log(VARIANTS)
}

alert('search for "PENDING TODO.png" for instructions')

window.addEventListener('load', function (event) {
  VARIANTS.currentProduct = dummyProduct()
  showVariants(dummyProduct())
  
  document.querySelector('.product-btn').onclick = () => {
    showVariants(dummyProduct())
  }
});
// --------------- test end -----------------