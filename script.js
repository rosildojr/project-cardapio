// Estado do carrinho
let cart = [];

// Elementos DOM
const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
const cartModal = document.getElementById('cart-modal');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.getElementById('cart-count');
const cartBtn = document.getElementById('cart-btn');
const closeModalBtn = document.getElementById('close-modal');
const checkoutBtn = document.getElementById('checkout-btn');

// Adicionar ao carrinho
addToCartBtns.forEach(btn => {
  btn.addEventListener('click', function() {
    const name = this.getAttribute('data-name');
    const price = parseFloat(this.getAttribute('data-price'));
    
    // Adicionar ao array
    addToCart(name, price);
    
    // Feedback visual
    this.innerHTML = '<i class="fas fa-check"></i> Adicionado!';
    setTimeout(() => {
      this.innerHTML = '<i class="fas fa-cart-plus"></i> Adicionar';
    }, 1000);
  });
});

// Função adicionar ao carrinho
function addToCart(name, price) {
  const existingItem = cart.find(item => item.name === name);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name: name,
      price: price,
      quantity: 1
    });
  }
  
  updateCart();
}

// Atualizar carrinho (COM BOTÕES +/-)
function updateCart() {
  cartItemsContainer.innerHTML = '';
  
  let total = 0;
  
  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    
    const cartItem = document.createElement('div');
    cartItem.className = 'flex justify-between items-center bg-gray-50 p-3 rounded-lg';
    cartItem.innerHTML = `
      <div class="flex-1">
        <p class="font-bold">${item.name}</p>
        <p class="text-sm text-gray-600">R$ ${item.price.toFixed(2)} cada</p>
      </div>
      
      <div class="flex items-center gap-3">
        <!-- BOTÕES +/- -->
        <div class="flex items-center gap-2 bg-white rounded-lg px-2 py-1">
          <button onclick="decreaseQuantity(${index})" class="text-red-600 hover:text-red-800 font-bold text-xl w-6 h-6 flex items-center justify-center">
            −
          </button>
          <span class="font-bold w-8 text-center">${item.quantity}</span>
          <button onclick="increaseQuantity(${index})" class="text-green-600 hover:text-green-800 font-bold text-xl w-6 h-6 flex items-center justify-center">
            +
          </button>
        </div>
        
        <!-- PREÇO TOTAL DO ITEM -->
        <p class="font-bold w-20 text-right">R$ ${itemTotal.toFixed(2)}</p>
        
        <!-- BOTÃO REMOVER -->
        <button onclick="removeFromCart(${index})" class="text-red-600 hover:text-red-800" title="Remover item">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;
    
    cartItemsContainer.appendChild(cartItem);
  });
  
  // Atualizar total
  cartTotal.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
  
  // Atualizar contador
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;
  
  if (totalItems > 0) {
    cartCount.classList.remove('hidden');
  } else {
    cartCount.classList.add('hidden');
  }
}

// Remover do carrinho
function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

// Abrir modal
cartBtn.addEventListener('click', () => {
  cartModal.classList.remove('hidden');
});

// Fechar modal
closeModalBtn.addEventListener('click', () => {
  cartModal.classList.add('hidden');
});

// Fechar ao clicar fora
cartModal.addEventListener('click', (e) => {
  if (e.target === cartModal) {
    cartModal.classList.add('hidden');
  }
});

// Finalizar pedido via WhatsApp
checkoutBtn.addEventListener('click', () => {
  if (cart.length === 0) {
    alert('Seu carrinho está vazio!');
    return;
  }
  
  let message = '*Pedido Rosildo\'s Burguer* \n\n';
  let total = 0;
  
  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    message += `• ${item.quantity}x ${item.name} - R$ ${itemTotal.toFixed(2)}\n`;
  });
  
  message += `\n*Total: R$ ${total.toFixed(2)}*`;
  message += `\n\nEndereço de entrega: _[Digite seu endereço]_`;
  
  const whatsappNumber = '5583986375458'; // MUDE AQUI PRO SEU NÚMERO
  const encodedMessage = encodeURIComponent(message);
  const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
  
  window.open(whatsappURL, '_blank');
});

// Indicador de horário (aberto/fechado)
function checkOpenStatus() {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay(); // 0 = Domingo, 6 = Sábado
  
  const dateSpan = document.getElementById('date-span');
  
  // Seg-Sex (1-5), 18h-23h
  if (day >= 1 && day <= 5 && hour >= 18 && hour < 23) {
    dateSpan.classList.remove('bg-red-600');
    dateSpan.classList.add('bg-green-600');
    dateSpan.querySelector('span').innerHTML = '<i class="fas fa-check-circle"></i> Aberto agora - Seg à Sex 18:00-23:00';
  } else {
    dateSpan.classList.remove('bg-green-600');
    dateSpan.classList.add('bg-red-600');
    dateSpan.querySelector('span').innerHTML = '<i class="fas fa-times-circle"></i> Fechado - Abrimos Seg às 18:00';
  }
}

// Executar ao carregar
checkOpenStatus();

// Aumentar quantidade
function increaseQuantity(index) {
  cart[index].quantity += 1;
  updateCart();
}

// Diminuir quantidade
function decreaseQuantity(index) {
  if (cart[index].quantity > 1) {
    cart[index].quantity -= 1;
  } else {
    // Se quantidade for 1, remove do carrinho
    removeFromCart(index);
  }
  updateCart();
}
// Limpar carrinho inteiro
const clearCartBtn = document.getElementById('clear-cart');

clearCartBtn.addEventListener('click', () => {
  if (cart.length === 0) {
    alert('O carrinho já está vazio!');
    return;
  }
  
  if (confirm('Deseja remover TODOS os itens do carrinho?')) {
    cart = [];
    updateCart();
  }
});