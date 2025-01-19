// Inicialização do Firebase
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, child, update, remove, push } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCFDmBwvqpMcPnP6mTm39NqyHRk48GjKW4",
  authDomain: "minha-gest.firebaseapp.com",
  databaseURL: "https://minha-gest-default-rtdb.firebaseio.com",
  projectId: "minha-gest",
  storageBucket: "minha-gest.appspot.com",
  messagingSenderId: "850400110245",
  appId: "1:850400110245:web:55741777e4fbeb38664f4c",
  measurementId: "G-QZ2ZPLZ1NV"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Função para adicionar produto ao Firebase
async function addProduct(name, expirationDate) {
  // Cria uma nova chave única para o produto
  const newProductKey = push(ref(db, 'acompanhamento/produtos')).key;
  
  // Adiciona os dados no Firebase sob a estrutura: "acompanhamento > produtos"
  await set(ref(db, 'acompanhamento/produtos/' + newProductKey), {
    name: name,
    expirationDate: expirationDate
  });

  loadProducts();  // Atualiza a lista de produtos
}

// Função para listar produtos do Firebase e verificar validade
async function loadProducts() {
  const productList = document.getElementById("product-list");
  const alertsDiv = document.getElementById("alerts");
  
  // Limpa a lista antes de adicionar novos dados
  productList.innerHTML = '';
  alertsDiv.innerHTML = ''; 

  const dbRef = ref(db, 'acompanhamento/produtos');
  const snapshot = await get(dbRef);

  if (snapshot.exists()) {
    let hasAlert = false;

    snapshot.forEach((childSnapshot) => {
      const product = childSnapshot.val();
      const productName = product.name;
      const productExpirationDate = product.expirationDate;

      const li = document.createElement("tr");

      const nameCell = document.createElement("td");
      nameCell.textContent = productName;

      const dateCell = document.createElement("td");
      dateCell.textContent = productExpirationDate;

      // Verifica proximidade do vencimento
      const today = new Date();
      const expirationDate = new Date(productExpirationDate);
      const daysUntilExpiration = Math.ceil((expirationDate - today) / (1000 * 3600 * 24));

      let alertMessage = '';
      let alertClass = '';

      if (daysUntilExpiration <= 7 && daysUntilExpiration >= 0) {
        alertMessage = ` (Vencimento em ${daysUntilExpiration} dias!)`;
        alertClass = 'alert-red';
        hasAlert = true;
      } else if (daysUntilExpiration <= 30 && daysUntilExpiration > 7) {
        alertMessage = ` (Vencimento em ${daysUntilExpiration} dias!)`;
        alertClass = 'alert-yellow';
        hasAlert = true;
      } else if (daysUntilExpiration <= 60 && daysUntilExpiration > 30) {
        alertMessage = ` (Vencimento em ${daysUntilExpiration} dias!)`;
        alertClass = 'alert-green';
        hasAlert = true;
      }

      li.appendChild(nameCell);
      li.appendChild(dateCell);

      const alertDiv = document.createElement("div");
      alertDiv.classList.add('alert', alertClass);
      alertDiv.textContent = `${productName} - ${alertMessage}`;
      alertsDiv.appendChild(alertDiv);

      productList.appendChild(li);
    });

    if (!hasAlert) {
      alertsDiv.innerHTML += `<div class="alert alert-green">Nenhum produto com validade próxima.</div>`;
    }
  } else {
    alertsDiv.innerHTML += `<div class="alert alert-green">Nenhum produto encontrado.</div>`;
  }
}

// Função para excluir produto
async function deleteProduct(productId) {
  await remove(ref(db, 'acompanhamento/produtos/' + productId));
  loadProducts();  // Atualiza a lista de produtos
}

// Função para editar produto
function editProduct(productId, currentName, currentExpirationDate) {
  document.getElementById("product-name").value = currentName;
  document.getElementById("expiration-date").value = currentExpirationDate;

  // Modifica o produto quando o formulário é enviado
  document.getElementById("product-form").onsubmit = async (e) => {
    e.preventDefault();
    const newName = document.getElementById("product-name").value;
    const newExpirationDate = document.getElementById("expiration-date").value;

    await update(ref(db, 'acompanhamento/produtos/' + productId), {
      name: newName,
      expirationDate: newExpirationDate
    });

    loadProducts();  // Atualiza a lista após edição
    document.getElementById("product-form").reset(); // Limpa o formulário
  };
}

// Carrega os produtos ao inicializar a página
loadProducts();

// Adiciona um produto quando o formulário é enviado
document.getElementById("product-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("product-name").value;
  const expirationDate = document.getElementById("expiration-date").value;
  addProduct(name, expirationDate);
  document.getElementById("product-form").reset(); // Limpa o formulário
});
