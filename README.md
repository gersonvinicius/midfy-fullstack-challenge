# **Midfy Fullstack Challenge**

Este é um **Sistema de Gerenciamento de Clientes**, desenvolvido como um desafio Fullstack. O sistema permite gerenciar informações de clientes, como dados gerais e suas associações com outros elementos (potencialmente pedidos, contatos ou segmentos). Ele utiliza tecnologias modernas tanto no frontend quanto no backend, com suporte a containerização via Docker.

## **Funcionalidades**

- **Listagem de Clientes**:
  - Exibe os clientes cadastrados com suas informações principais.
  - Oferece uma interface clara e amigável para visualização.

- **Edição de Clientes**:
  - Permite editar informações dos clientes diretamente na interface.
  - Atualização automática da lista após salvar as alterações.

- **Pesquisa Dinâmica**:
  - Campo de busca permite filtrar clientes por critérios como nome ou outros atributos relacionados.

- **Integração com Backend**:
  - O sistema consome uma API para manipulação e persistência dos dados.
 
## **Tecnologias Utilizadas**

### **Frontend**
- **React**: Biblioteca para construção de interfaces de usuário.
- **TypeScript**: Superset do JavaScript que adiciona tipagem estática.
- **Material-UI (MUI)**: Biblioteca de componentes estilizados.
- **Axios**: Cliente HTTP para comunicação com a API.

### **Backend**
- **Node.js**: Ambiente de execução para JavaScript no servidor.
- **Express**: Framework para criação da API.
- **PostgreSQL**: Banco de dados relacional utilizado no backend.
- **Supabase**: Alternativa ao Firebase para gerenciamento de autenticação e banco de dados.

### **Containerização**
- **Docker**: Usado para empacotar o sistema e suas dependências em containers.

## **Pré-Requisitos**

Certifique-se de ter as seguintes ferramentas instaladas:

- **Node.js** (v16 ou superior)
- **npm** ou **yarn**
- **Docker** (opcional, para execução via container)

## **Instalação**

### **1. Clone o Repositório**
```bash
git clone https://github.com/gersonvinicius/midfy-fullstack-challenge.git
cd midfy-fullstack-challenge
```

## **Configuração do Backend**

1. Certifique-se de que o backend está configurado corretamente e com as tabelas necessárias.
2. Configure as variáveis de ambiente no arquivo `.env` (caso necessário):

REACT_APP_SUPABASE_URL=https://samagfhthhmpsofvidlh.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhbWFnZmh0aGhtcHNvZnZpZGxoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0MDE5NTAsImV4cCI6MjA2NDk3Nzk1MH0.5Wa5sRkQKuzp9hF8mr0xVue15gFVrdpwr6KLFPo0Mb0

## **Configuração do Frontend**

1. Navegue para o diretório do frontend:

cd frontend

2. Instale as dependências do projeto:

npm install ou yarn install

3. Inicie o servidor do frontend:

npm start ou yarn start

Após a execução, o sistema estará disponível em **http://localhost:3000**.

## **Usando Docker**

1. Certifique-se de que o Docker e o Docker Compose estão instalados na sua máquina.
2. Na raiz do projeto, execute o comando abaixo para construir e iniciar os containers:

docker-compose up --build

3. O sistema será iniciado automaticamente e estará acessível em **http://localhost:3000**.

## **Como Usar**

1. Acesse o sistema no navegador em **http://localhost:3000**.
2. Visualize a lista de clientes cadastrados na tela inicial.
3. Utilize o campo de busca para filtrar os clientes dinamicamente com base em nome, CNPJ ou segmento.
4. Para editar um cliente, clique no botão de edição (ícone de lápis) ao lado do cliente desejado.
5. Atualize as informações no modal de edição e clique em "Salvar".
6. A lista será atualizada automaticamente após salvar as alterações.

## **Explicação da Lógica na Tela**

1. **Listagem de Clientes**:
   - A tela principal exibe uma tabela com as informações dos clientes cadastrados.
   - Cada linha contém dados como nome do cliente, CNPJs e segmento.

2. **Modal de Edição**:
   - Um modal é exibido ao clicar no botão de edição (ícone de lápis).
   - O modal permite alterar informações como nome, logo, CNPJs e segmentos do cliente.
   - Após salvar, a lista de clientes é atualizada automaticamente.

3. **Campo de Busca Dinâmica**:
   - Um campo de texto no topo da página permite realizar buscas em tempo real.
   - É possível filtrar os clientes por nome, CNPJ ou segmento.
  
## **Licença**

Este projeto está licenciado sob a [MIT License](LICENSE).

