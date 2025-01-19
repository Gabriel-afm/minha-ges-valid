/* Configuração do tema Black */
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #121212; /* Fundo Preto */
  color: #fff;
}

.container {
  text-align: center;
  background-color: #1E1E1E;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  padding: 30px;
  width: 600px;
}

h1 {
  margin-bottom: 20px;
  color: #4CAF50; /* Verde para o título */
}

#alerts {
  margin-bottom: 20px;
}

#alerts .alert {
  padding: 10px;
  margin: 5px 0;
  border-radius: 5px;
}

.alert-red {
  background-color: red;
  color: white;
}

.alert-yellow {
  background-color: yellow;
  color: black;
}

.alert-green {
  background-color: #4CAF50; /* Verde */
  color: white;
}

/* Estilo do formulário */
#product-form input {
  padding: 10px;
  margin: 10px;
  width: 80%;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #333;
  color: #fff;
}

button {
  padding: 10px 20px;
  border: none;
  background-color: #2196F3; /* Azul */
  color: white;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #1976D2; /* Azul mais escuro */
}

/* Estilo da tabela */
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  padding: 10px;
  border: 1px solid #444;
  text-align: left;
}

th {
  background-color: #2196F3; /* Azul */
}

tr:nth-child(even) {
  background-color: #333;
}

tr:nth-child(odd) {
  background-color: #222;
}

button.edit {
  background-color: #FF9800; /* Laranja */
}

button.edit:hover {
  background-color: #F57C00;
}

button.delete {
  background-color: #f44336; /* Vermelho */
}

button.delete:hover {
  background-color: #e53935;
}

button:hover {
  opacity: 0.8;
}
