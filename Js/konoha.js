document.addEventListener('DOMContentLoaded', () => {const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  const menu = document.getElementById('menuKonoha');
  if (menu && window.bootstrap) {
    const colapso = bootstrap.Collapse.getOrCreateInstance(menu, { toggle: false });
    menu.querySelectorAll('.nav-link').forEach(link =>
      link.addEventListener('click', () => menu.classList.contains('show') && colapso.hide()));
    document.addEventListener('click', e => {
      if (menu.classList.contains('show') && !e.target.closest('.konoha-navbar')) colapso.hide();
    });
  }

  const items = document.querySelectorAll('.content-section, .konoha-card, .konoha-place-card');
  if ('IntersectionObserver' in window && !sinMovimiento) {
    const observador = new IntersectionObserver((entradas, obs) => {
      entradas.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add('visible'); obs.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    items.forEach((el, i) => {
      el.classList.add('reveal');
      el.style.animationDelay = (i % 4) * 80 + 'ms';
      observador.observe(el);
    });
  }

  const boton = document.createElement('button');
  boton.className = 'volver-arriba';
  boton.type = 'button';
  boton.setAttribute('aria-label', 'Volver arriba');
  boton.textContent = '↑';
  boton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: sinMovimiento ? 'auto' : 'smooth' }));
  document.body.appendChild(boton);
  const alternarBoton = () => boton.classList.toggle('mostrar', window.scrollY > 400);
  window.addEventListener('scroll', alternarBoton, { passive: true });
  alternarBoton();

  const tarjetas = document.querySelectorAll('.konoha-place-card');
  if (tarjetas.length && window.bootstrap) {
    document.body.insertAdjacentHTML('beforeend', `
      <div class="modal fade konoha-modal" id="modalLugar" tabindex="-1" aria-labelledby="modalLugarTitulo" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h2 class="modal-title fs-4" id="modalLugarTitulo"></h2>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>
            <div class="modal-body"><img id="modalLugarImg" src="" alt=""><p class="mb-0" id="modalLugarTexto"></p></div>
          </div>
        </div>
      </div>`);
    const modal = new bootstrap.Modal(document.getElementById('modalLugar'));
    const abrir = tarjeta => {
      const img = tarjeta.querySelector('img');
      document.getElementById('modalLugarTitulo').textContent = tarjeta.querySelector('.card-title').textContent;
      document.getElementById('modalLugarTexto').textContent = tarjeta.querySelector('.card-text').textContent;
      document.getElementById('modalLugarImg').src = img.src;
      document.getElementById('modalLugarImg').alt = img.alt;
      modal.show();
    };
    tarjetas.forEach(t => {
      t.setAttribute('tabindex', '0');
      t.setAttribute('role', 'button');
      t.addEventListener('click', () => abrir(t));
      t.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); abrir(t); } });
    });
  }

  const form = document.getElementById('formContacto');
  if (form) {
    const aviso = document.getElementById('avisoEnviado');
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!form.checkValidity()) { form.classList.add('was-validated'); return; }
      const nombre = form.nombre.value.trim();
      form.reset();
      form.classList.remove('was-validated');
      aviso.textContent = `¡Gracias, ${nombre}! Tu mensaje fue registrado y la oficina de turismo te responderá pronto.`;
      aviso.classList.remove('d-none');
      aviso.focus();
    });
  }

  const chunin = document.getElementById('formChunin');
  if (chunin) {
    const aviso = document.getElementById('avisoChunin');
    const errorEsp = document.getElementById('errorEsp');
    const checks = chunin.querySelectorAll('.esp');
    const motivo = document.getElementById('chMotivo');
    const contador = document.getElementById('contadorMotivo');
    motivo.addEventListener('input', () => { contador.textContent = motivo.value.length; });
    checks.forEach(c => c.addEventListener('change', () => {
      if ([...checks].some(x => x.checked)) errorEsp.classList.add('d-none');
    }));
    chunin.addEventListener('submit', e => {
      e.preventDefault();
      const hayEsp = [...checks].some(c => c.checked);
      errorEsp.classList.toggle('d-none', hayEsp);
      chunin.classList.add('was-validated');
      if (!chunin.checkValidity() || !hayEsp) return;
      const nombre = chunin.nombre.value.trim();
      const esp = [...checks].filter(c => c.checked).map(c => c.value).join(', ');
      const numero = 'CH-' + String(Math.floor(1000 + Math.random() * 9000));
      aviso.innerHTML = `<strong>¡Inscripción registrada!</strong><br>
        Postulante: ${nombre.replace(/[<>&]/g, '')} · Aldea: ${chunin.aldea.value}<br>
        Especialidades: ${esp} · N.º de inscripción: <strong>${numero}</strong><br>
        Presentate con tu equipo en la Academia Ninja el día del examen.`;
      aviso.classList.remove('d-none');
      chunin.reset();
      chunin.classList.remove('was-validated');
      contador.textContent = '0';
       aviso.focus();
  });
}

// Botón de modo oscuro personalizado con Byakugan y Sharingan
const btnTema = document.createElement('button');
btnTema.className = 'btn-tema';
btnTema.type = 'button';

const aplicarTema = oscuro => {
  document.body.classList.toggle('modo-oscuro', oscuro);
  btnTema.setAttribute('aria-pressed', oscuro);

  if (oscuro) {
    btnTema.innerHTML = `<img src="IMG/Sharingan.jpg" alt="Sharingan" class="tema-ojo"> Sharingan (Noche)`;
  } else {
    btnTema.innerHTML = `<img src="IMG/Byakugan.jpg" alt="Byakugan" class="tema-ojo"> Byakugan (Día)`;
  }
};

const temaGuardado = localStorage.getItem('konohaTema') === 'oscuro';
aplicarTema(temaGuardado);

btnTema.addEventListener('click', () => {
  const activarOscuro = !document.body.classList.contains('modo-oscuro');
  aplicarTema(activarOscuro);
  localStorage.setItem('konohaTema', activarOscuro ? 'oscuro' : 'claro');
});

document.body.appendChild(btnTema);
});   

