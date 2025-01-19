import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCFDmBwvqpMcPnP6mTm39NqyHRk48GjKW4",
  authDomain: "minha-gest.firebaseapp.com",
  databaseURL: "https://minha-gest-default-rtdb.firebaseio.com",
  projectId: "minha-gest",
  storageBucket: "minha-gest.firebasestorage.app",
  messagingSenderId: "850400110245",
  appId: "1:850400110245:web:55741777e4fbeb38664f4c",
  measurementId: "G-QZ2ZPLZ1NV"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Função para adicionar produto ao Firestore
async function addProduct(name, expirationDate) {
  try {
    const docRef = await addDoc(collection(db, "produtos"), {
      name: name,
      expirationDate: expirationDate
    });
    console.log("Produto adicionado com ID: ", docRef.id);
    loadProducts();  // Atualiza a lista de produtos
  } catch (e) {
    console.error("Erro ao adicionar produto: ", e);
  }
}

// Função para listar produtos do Firestore e verificar validade
async function loadProducts() {
  const querySnapshot = await getDocs(collection(db, "produtos"));
  const productList = document.getElementById("product-list");
  productList.innerHTML = '';  // Limpa a lista antes de adicionar

  // Limpa os alertas
  const alertsDiv = document.getElementById("alerts");
  alertsDiv.innerHTML = ''; 

  let hasAlert = false;

  querySnapshot.forEach((doc) => {
    const product = doc.data();
    const li = document.createElement("tr");

    const productName = document.createElement("td");
    productName.textContent = product.name;

    const expirationDate = document.createElement("td");
    expirationDate.textContent = product.expirationDate;

    // Verifica se o produto está próximo do vencimento
    const today = new Date();
    const expiration = new Date(product.expirationDate);
    const daysUntilExpiration = Math.ceil((expiration - today) / (1000 * 3600 * 24));

    let alertMessage = '';

    if (daysUntilExpiration <= 7 && daysUntilExpiration >= 0) {
      alertMessage = ` (Vencimento em ${daysUntilExpiration} dias!)`;
      alertsDiv.innerHTML += `<div class="alert alert-red">Alerta: Produto ${product.name} vencendo em ${daysUntilExpiration} dias!</div>`;
      hasAlert = true;
    } else if (daysUntilExpiration <= 30 && daysUntilExpiration > 7) {
      alertMessage = ` (Vencimento em ${daysUntilExpiration} dias!)`;
      alertsDiv.innerHTML += `<div class="alert alert-yellow">Alerta: Produto ${product.name} vencendo em ${daysUntilExpiration} dias!</div>`;
      hasAlert = true;
    } else if (daysUntilExpiration <= 60 && daysUntilExpiration > 30) {
      alertMessage = ` (Vencimento em ${daysUntilExpiration} dias!)`;
      alertsDiv.innerHTML += `<div class="alert alert-green">Alerta: Produto ${product.name} vencendo em ${daysUntilExpiration} dias!</div>`;
      hasAlert = true;
    }

    li.appendChild(productName);
    li.appendChild(expirationDate);

    // Adicionando o botão de exclusão
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Excluir";
    deleteButton.classList.add("delete");
    deleteButton.onclick = () => deleteProduct(doc.id);

    // Adicionando botão de edição
    const editButton = document.createElement("button");
    editButton.textContent = "Editar";
    editButton.classList.add("edit");
    editButton.onclick = () => editProduct(doc.id, product.name, product.expirationDate);

    const actions = document.createElement("td");
    actions.appendChild(editButton);
    actions.appendChild(deleteButton);

    li.appendChild(actions);
    productList.appendChild(li);
  }

  if (!hasAlert) {
    alertsDiv.innerHTML += `<div class="alert alert-green">Nenhum produto com validade próxima.</div>`;
  }
}

// Função para deletar um produto do Firestore
async function deleteProduct(productId) {
  try {
    const productRef = doc(db, "produtos", productId);
    await deleteDoc(productRef);
    loadProducts();  // Atualiza a lista após exclusão
  } catch (e) {
    console.error("Erro ao excluir produto: ", e);
  }
}

// Função para editar um produto
function editProduct(productId, currentName, currentExpirationDate) {
  document.getElementById("product-name").value = currentName;
  document.getElementById("expiration-date").value = currentExpirationDate;

  // Remove o produto existente antes de salvar a edição
  document.getElementById("product-form").onsubmit = async (e) => {
    e.preventDefault();
    const newName = document.getElementById("product-name").value;
    const newExpirationDate = document.getElementById("expiration-date").value;

    const productRef = doc(db, "produtos", productId);
    try {
      await updateDoc(productRef, {
        name: newName,
        expirationDate: newExpirationDate
      });
      console.log("Produto editado com sucesso!");
      loadProducts();  // Atualiza a lista após a edição
    } catch (e) {
      console.error("Erro ao editar produto: ", e);
    }
    document.getElementById("product-form").reset();  // Limpa o formulário
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
