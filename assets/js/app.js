window.dataLayer = window.dataLayer || [];
var LOGO_W = "./assets/img/logo_w.png", LOGO_D = "./assets/img/logo_d.png";

document.getElementById('ano').textContent = new Date().getFullYear();

/* header + botao flutuante */
var hdr = document.getElementById('hdr'), logo = document.getElementById('logo'), flo = document.getElementById('float');
var scrolled75 = false;
function onScroll(){
  var y = window.scrollY;
  var sc = y > window.innerHeight * 0.82;
  hdr.classList.toggle('scrolled', sc);
  logo.src = sc ? LOGO_D : LOGO_W;
  flo.classList.toggle('on', y > window.innerHeight * 0.6);
  var perc = y / (document.body.scrollHeight - window.innerHeight);
  if(!scrolled75 && perc > 0.75){ scrolled75 = true; dataLayer.push({event:'scroll_75'}); }
}
window.addEventListener('scroll', onScroll, {passive:true}); onScroll();

/* reveal */
var io = new IntersectionObserver(function(es){
  es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
},{threshold:.12, rootMargin:'0px 0px -8% 0px'});
document.querySelectorAll('.rv').forEach(function(el,i){ el.style.transitionDelay = (i%4)*70 + 'ms'; io.observe(el); });

/* acordeoes: fases e faq */
function accordion(sel, headSel){
  document.querySelectorAll(sel).forEach(function(item){
    var btn = item.querySelector(headSel);
    btn.setAttribute('aria-expanded','false');
    btn.addEventListener('click', function(){
      var open = item.getAttribute('aria-expanded') === 'true';
      item.parentNode.querySelectorAll(sel).forEach(function(o){
        o.setAttribute('aria-expanded','false');
        o.querySelector(headSel).setAttribute('aria-expanded','false');
      });
      if(!open){ item.setAttribute('aria-expanded','true'); btn.setAttribute('aria-expanded','true'); }
    });
  });
}
accordion('.fase', '.fase-head');
accordion('.q', 'button');

/* eventos de conversao */
document.querySelectorAll('[data-ev]').forEach(function(a){
  a.addEventListener('click', function(){ dataLayer.push({event:a.dataset.ev}); });
});


/* CTAs ancoram no formulario: scroll suave, pre-selecao da fase e destaque */
(function(){
  var alvo = document.getElementById('contato');
  var caixa = document.getElementById('form-contato');
  var selFase = document.getElementById('fa');
  if(!alvo || !caixa) return;

  document.querySelectorAll('a[href="#contato"]').forEach(function(a){
    a.addEventListener('click', function(e){
      e.preventDefault();
      var fase = a.dataset.fase;
      if(fase && selFase){
        Array.prototype.forEach.call(selFase.options, function(o){
          if(o.value === fase || o.textContent.trim() === fase) selFase.value = o.value;
        });
        selFase.dispatchEvent(new Event('change'));
      }
      alvo.scrollIntoView({behavior:'smooth', block:'start'});
      caixa.classList.add('destaque');
      setTimeout(function(){ caixa.classList.remove('destaque'); }, 1600);
      setTimeout(function(){
        var n = document.getElementById('n');
        if(n && !n.value) n.focus({preventScroll:true});
      }, 700);
    });
  });
})();

/* lightbox */
var lb = document.getElementById('lb'), lbi = document.getElementById('lbi');
document.querySelectorAll('#galeria figure').forEach(function(f){
  f.addEventListener('click', function(){
    var im = f.querySelector('img');
    lbi.src = im.src; lbi.alt = im.alt; lb.classList.add('on');
    document.body.style.overflow = 'hidden';
  });
});
function fechar(){ lb.classList.remove('on'); document.body.style.overflow = ''; }
document.getElementById('lbx').addEventListener('click', fechar);
lb.addEventListener('click', function(e){ if(e.target === lb) fechar(); });
document.addEventListener('keydown', function(e){ if(e.key === 'Escape') fechar(); });

/* formulario: valida, grava na planilha (Apps Script) e leva pro WhatsApp */
var ENDPOINT = "https://script.google.com/macros/s/AKfycbwdh-wZbDX0jhMmuiknarcwmDpJD_wxItYQ-1TdLvRaHNZEEh9AvvULK7bt1yRBerdMRQ/exec";
var btn = document.getElementById('enviar'), nota = document.getElementById('nota');
var campos = ['n','w','c','fa','am'].map(function(id){ return document.getElementById(id); });
var obrigatorios = ['n','w','c'];

function soDigitos(s){ return (s.match(/\d/g) || []).length; }
function valido(){
  var nome = document.getElementById('n').value.trim();
  var zap  = document.getElementById('w').value;
  var cid  = document.getElementById('c').value.trim();
  return nome.length >= 3 && nome.indexOf(' ') > 0 && soDigitos(zap) >= 10 && cid.length >= 3;
}
function checar(){
  var ok = valido();
  btn.disabled = !ok;
  btn.textContent = ok ? 'Enviar e continuar no WhatsApp' : 'Preencha os campos acima';
  nota.textContent = ok ? 'Ao enviar, você é levado direto para a conversa no WhatsApp com essas informações.'
                        : 'Preencha nome completo, WhatsApp com DDD e cidade para liberar o envio.';
}
campos.forEach(function(el){ el.addEventListener('input', checar); el.addEventListener('change', checar); });

/* mascara simples de telefone */
var zapEl = document.getElementById('w');
zapEl.addEventListener('input', function(){
  var d = (zapEl.value.match(/\d/g) || []).join('').slice(0,11);
  var out = d;
  if(d.length > 2) out = '(' + d.slice(0,2) + ') ' + d.slice(2);
  if(d.length > 7) out = '(' + d.slice(0,2) + ') ' + d.slice(2,3) + ' ' + d.slice(3,7) + '-' + d.slice(7);
  else if(d.length > 6) out = '(' + d.slice(0,2) + ') ' + d.slice(2,6) + '-' + d.slice(6);
  zapEl.value = out;
});
checar();

btn.addEventListener('click', function(){
  if(!valido()){ checar(); return; }
  var v = function(id){ return document.getElementById(id).value.trim(); };
  var dados = {nome:v('n'), whatsapp:v('w'), cidade:v('c'), fase:v('fa'), ambiente:v('am'), origem:location.href, data:new Date().toISOString()};
  dataLayer.push({event:'submit_formulario', fase:dados.fase, ambiente:dados.ambiente});
  btn.disabled = true; btn.textContent = 'Enviando...';
  var msg = 'Olá, vim do google e acabei de preencher o formulario no site.\n\nNome: ' + dados.nome + '\nCidade: ' + dados.cidade + '\nFase da obra: ' + dados.fase + '\nAmbiente: ' + dados.ambiente;
  var ir = function(){ window.location.href = 'https://wa.me/5527999100504?text=' + encodeURIComponent(msg); };
  if(ENDPOINT){
    fetch(ENDPOINT, {method:'POST', mode:'no-cors', headers:{'Content-Type':'text/plain;charset=utf-8'}, body:JSON.stringify(dados)})
      .then(ir).catch(ir);
    setTimeout(ir, 2500);
  } else { ir(); }
});
