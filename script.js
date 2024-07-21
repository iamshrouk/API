
function renderProducts(products) {
    const container = document.getElementById('products-container');
    container.innerHTML = '';
    products.forEach(product => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <img src="${product.thumbnail}" alt="${product.title}">
        <h3>${product.title}</h3>
        <p>${product.description}</p>
        <p>Price: $${product.price}</p>
      `;
      card.addEventListener('click', () => {
        window.location.href = `product.html?id=${product.id}`;
      });
      container.appendChild(card);
    });
  }
  
  
  function populateFilterMenu(categories) {
    const filterMenu = document.getElementById('filter-menu');
    filterMenu.innerHTML = categories.map(category => `
      <li data-value="${category}">
        <img src="path_to_${category}_image.png" alt="${category}">
        ${category.charAt(0).toUpperCase() + category.slice(1)}
      </li>
    `).join('');
  }
  

  if (window.location.pathname.includes('index.html')) {
    const api = "https://dummyjson.com/products";
  
    fetch(api)
      .then(response => response.json())
      .then(data => {
        const { products } = data;
  
        
        const categories = [...new Set(products.map(product => product.category))];
  
        populateFilterMenu(categories);
  
        renderProducts(products);
  
        
        document.getElementById('search').addEventListener('input', event => {
          const searchQuery = event.target.value.toLowerCase();
          const filteredProducts = products.filter(product => product.title.toLowerCase().includes(searchQuery));
          renderProducts(filteredProducts);
        });
  
    
        document.getElementById('sort').addEventListener('change', event => {
          const sortValue = event.target.value;
          const sortedProducts = products.slice().sort((a, b) => {
            return sortValue === 'asc' ? a.price - b.price : b.price - a.price;
          });
          renderProducts(sortedProducts);
        });
      })
      .catch(error => console.error('Error fetching products:', error));
  } else if (window.location.pathname.includes('product.html')) {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const api = `https://dummyjson.com/products/${productId}`;
  
    fetch(api)
      .then(response => response.json())
      .then(product => {
        const container = document.getElementById('product-details');
        container.innerHTML = `
          <img src="${product.thumbnail}" alt="${product.title}">
          <h3>${product.title}</h3>
          <p>${product.description}</p>
          <p>Price: $${product.price}</p>
        `;
  
        document.getElementById('add-to-cart').addEventListener('click', () => {
          addToCart(product);
        });
      })
      .catch(error => console.error('Error fetching product:', error));
  }
  
  
  function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProduct = cart.find(item => item.id === product.id);
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      product.quantity = 1;
      cart.push(product);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Product added to cart!');
  }
  
  
