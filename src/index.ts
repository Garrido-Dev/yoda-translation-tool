// --- PONTO DE PARTIDA ---
// Usamos querySelector porque ele é moderno e já pega o PRIMEIRO elemento que achar.
// Ele retorna 'Element | null', por isso a checagem lá embaixo é crucial.
const divContainer = document.querySelector(".container");

// --- FUNÇÃO DE RENDERIZAÇÃO ---
// A função que desenha nossos elementos na tela.
// Note o 'divContainer: HTMLElement': isso é um "contrato". A função SÓ ACEITA
// um parâmetro que seja um elemento HTML, garantindo segurança no tipo.
function render(divContainer: HTMLElement) {
  // Criando os blocos de construção da nossa interface
  const label = document.createElement("label");
  const input = document.createElement("input");
  const btn = document.createElement("button");

  // Configurando o label. Lembra do '.htmlFor'? É o '.for' do HTML no mundo JS,
  // pra não dar conflito com a palavra reservada 'for' dos loops.
  label.htmlFor = "pergunta";
  label.textContent = "Traduza aqui: ";
  label.classList = 'paragraph'

  // Configurando o input, nosso campo de texto
  input.type = "text";
  input.placeholder = "Digite aqui...";
  input.id = "pergunta";
  input.name = "pergunta";
  input.classList = 'textInput'

  // Configurando o botão
  btn.textContent = "Traduzir";
  btn.id = "Traduzir";
  btn.classList = 'btn'

  // .append() é show porque permite adicionar vários elementos de uma vez só.
  divContainer.append(label, input, btn);
}

// --- GUARDA-COSTAS DA APLICAÇÃO ---
// Essa é a checagem mais importante do código.
// 'divContainer instanceof HTMLElement' faz duas coisas:
// 1. Garante que 'divContainer' não é 'null' (se não encontrou, o código não roda).
// 2. Garante que o tipo é 'HTMLElement' (e não um 'Element' genérico),
//    satisfazendo o contrato da nossa função render().
// Basicamente, se o container principal não existir, nada mais acontece.
if (divContainer instanceof HTMLElement) {
  // Se passou pelo segurança, a gente renderiza a tela inicial.
  render(divContainer);

  // --- LÓGICA PÓS-RENDERIZAÇÃO ---

  // Agora que os elementos existem, podemos pegá-los.
  const btn = document.getElementById("Traduzir");

  // Função que conversa com a API. 'async' significa que ela vai fazer
  // algo que demora (chamar a internet) e não vai travar o resto do código.
  async function returnAPI(frase: string) {
    // 'encodeURIComponent' é um herói silencioso. Ele formata o texto para a URL,
    // evitando que caracteres especiais como '?' ou '&' quebrem o link.
    const response = await fetch(
      `https://api.funtranslations.com/translate/yoda.json?text=${encodeURIComponent(
        frase
      )}`
    );
    const data = await response.json();
    return data;
  }

  // Criamos o H1 que vai mostrar o resultado, mas ainda não colocamos na tela.
  const h1 = document.createElement("h1");
  h1.classList = 'textTraduzida'

  // --- O CORAÇÃO DA INTERATIVIDADE ---
  // Adicionando um "escutador de eventos" no botão.
  // O '?' (Optional Chaining) é um mini 'if': "Se o botão existir, adicione o listener".
  btn?.addEventListener("click", () => {
    // Limpa o h1 de traduções antigas a cada novo clique
    h1.textContent = "";

    // Pegamos o input e usamos 'as HTMLInputElement' pra dizer pro TypeScript:
    // "Relaxe, eu GARANTO que isso é um input, então pode me deixar usar o '.value'".
    const inputElement = document.getElementById(
      "pergunta"
    ) as HTMLInputElement;

    // Outra checagem de segurança: o input realmente existe?
    if (inputElement) {
      // SÓ DEPOIS do clique é que pegamos o valor. Esse era o segredo!
      const frase = inputElement.value;

      // Chamamos a API e lidamos com a "promessa" que ela retorna.
      returnAPI(frase)
        .then((data) => {
          // .then() roda se tudo deu CERTO.
          // Aqui a gente finalmente tem a tradução!
          h1.textContent = data.contents.translated;
          console.log(data.contents.translated);

          // E agora sim, jogamos o h1 com o resultado na tela.
          divContainer.append(h1);
        })
        .catch((error) => console.error(error)); // .catch() roda se deu RUIM.
    } else {
      console.log("Frase nao encontrada");
    }
  });
}