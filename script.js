/* ── 1. TEMA CLARO/ESCURO ──────────────────────────────────────────────────
   Lê a preferência salva no localStorage. Se não houver nada salvo,
   usa a preferência do sistema operacional (prefers-color-scheme).
   Ao clicar no botão, alterna a classe "tema-escuro" no body e salva a escolha. */

const botaoTema = document.getElementById('toggle-tema');
const temaSalvo = localStorage.getItem('tema');
const prefereEscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (temaSalvo === 'escuro' || (temaSalvo === null && prefereEscuro)) {
  document.body.classList.add('tema-escuro');
  botaoTema.textContent = '☀️';
}

botaoTema.addEventListener('click', () => {
  document.body.classList.toggle('tema-escuro');
  const escuro = document.body.classList.contains('tema-escuro');
  botaoTema.textContent = escuro ? '☀️' : '🌙';
  localStorage.setItem('tema', escuro ? 'escuro' : 'claro');
});


/* ── 2. COPIAR E-MAIL ──────────────────────────────────────────────────────
   Usa a Clipboard API para copiar o endereço guardado no atributo data-email.
   Exibe "E-mail copiado!" no span #email-feedback por 2 segundos.
   O try/catch garante que a página não quebre se a permissão for negada. */

const botaoEmail = document.getElementById('copiar-email');
const feedback   = document.getElementById('email-feedback');

botaoEmail.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(botaoEmail.dataset.email);
    feedback.textContent = 'E-mail copiado!';
  } catch {
    feedback.textContent = 'Não foi possível copiar.';
  }
  setTimeout(() => { feedback.textContent = ''; }, 2000);
});


/* ── 3. ANIMAÇÃO DE ENTRADA COM IntersectionObserver ──────────────────────
   Observa todos os elementos com a classe "revelar".
   Quando um deles entra na viewport (threshold 15%), adiciona "visivel",
   que dispara a transição de fade+slide definida no CSS.
   unobserve() evita que a animação rode de novo ao rolar para cima. */

const observadorEntrada = new IntersectionObserver((entradas) => {
  entradas.forEach((entrada) => {
    if (entrada.isIntersecting) {
      entrada.target.classList.add('visivel');
      observadorEntrada.unobserve(entrada.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.revelar').forEach((el) => observadorEntrada.observe(el));


/* ── 4. LINK ATIVO NA NAVEGAÇÃO (interação extra) ─────────────────────────
   Segundo IntersectionObserver que observa as seções.
   Quando uma seção ocupa pelo menos 40% da viewport, o link correspondente
   na sidebar recebe a classe "ativo", destacando visualmente a seção atual.
   Ao entrar uma nova seção, remove "ativo" de todos antes de marcar o novo. */

const secoes   = document.querySelectorAll('section[id]');
const linksNav = document.querySelectorAll('nav a');

const observadorNav = new IntersectionObserver((entradas) => {
  entradas.forEach((entrada) => {
    if (entrada.isIntersecting) {
      linksNav.forEach((link) => link.classList.remove('ativo'));
      const linkAtivo = document.querySelector(`nav a[href="#${entrada.target.id}"]`);
      if (linkAtivo) linkAtivo.classList.add('ativo');
    }
  });
}, { threshold: 0.4 });

secoes.forEach((secao) => observadorNav.observe(secao));
