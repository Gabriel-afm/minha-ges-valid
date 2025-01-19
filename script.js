import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getDatabase, ref, set, push, get, child, remove } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-database.js";

// Configuração do Firebase
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

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Função para adicionar um produto no Firebase
async function addProduct(name, expirationDate) {
    const newProductKey = push(ref(db, 'acompanhamento/produtos')).key;
    try {
        await set(ref(db, 'acompanhamento/produtos/' + newProductKey), {
            name: name,
            expirationDate: expirationDate
        });
        showAlert("Produto salvo com sucesso!", "green");
        loadProducts();  // Atualiza a lista de produtos
    } catch (error) {
        showAlert("Erro ao salvar produto!", "red");
    }
}

// Função para exibir alertas
function showAlert(message, type) {
    const alertDiv = document.createElement("div");
    alertDiv.classList.add("alert", `alert-${type}`);
    alertDiv.textContent = message;
    document.getElementById("alerts").appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

// Função para carregar produtos e exibir na tabela
async function loadProducts() {
    const productList = document.getElementById("product-list").getElementsByTagName("tbody")[0];
    productList.innerHTML = '';  // Limpa a tabela antes de atualizar

    const dbRef = ref(db, 'acompanhamento/produtos');
    const snapshot = await get(dbRef);
    
    if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
            const product = childSnapshot.val();
            const productName = product.name;
            const productExpirationDate = product.expirationDate;

            const row = document.createElement("tr");

            const nameCell = document.createElement("td");
            nameCell.textContent = productName;
            row.appendChild(nameCell);

            const dateCell = document.createElement("td");
            dateCell.textContent = productExpirationDate;
            row.appendChild(dateCell);

            productList.appendChild(row);
        });
    } else {
        showAlert("Nenhum produto encontrado.", "green");
    }
}

// Adiciona um produto quando o formulário é enviado
document.getElementById("product-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("product-name").value;
    const expirationDate = document.getElementById("expiration-date").value;
    addProduct(name, expirationDate);
    document.getElementById("product-form").reset(); // Limpa o formulário
});

// Carrega os produtos ao inicializar a página
loadProducts();
