import { useState, useEffect } from 'react'

const SHEET_ID = ""; // <-- pega aquí el ID de tu Google Sheet cuando lo tengas listo

const defaultDistinciones = [
  { es: "Doctorado Honoris Causa, otorgado por unanimidad del Consejo Universitario de la UPEL (6 de julio de 2024)", en: "Doctorate Honoris Causa, awarded unanimously by UPEL's University Council (July 6, 2024)" },
  { es: "Reconocido por instituciones internacionales como el único con casi 300 sesiones de educación continua sobre prevención de una vida libre de drogas y alcohol", en: "Recognized by international institutions as the only one with nearly 300 continuing-education sessions on preventing drug and alcohol addiction" },
  { es: "Premio \"Buen Ciudadano\" — Concejo del Municipio Bolivariano Libertador", en: "\"Good Citizen\" Award — Municipal Council of Bolivarian Libertador" },
  { es: "Distinción Académica en Participación Ciudadana — Evento CLIAD N° 233", en: "Academic Distinction in Civic Participation — CLIAD Event No. 233" },
  { es: "Reconocimiento del Concejo Municipal de Baruta — Charla N° 200", en: "Recognition from the Baruta Municipal Council — 200th talk" },
];

const defaultBiblioteca = [
  {
    badgeClass: "live", badge_es: "Mencionado en prensa", badge_en: "Covered in the press",
    titulo_es: "Proyección a 20 años del consumo de alcohol en Venezuela",
    titulo_en: "A 20-year projection of alcohol use in Venezuela",
    texto_es: "Hallazgo atribuido al Prof. Hernán Matute (Cátedra Libre Antidrogas, UPEL-IPC), reportado por el boletín \"Sin Adicción\" de Seguros Venezuela (2017): de mantenerse las tendencias de consumo juvenil, el 60% de la población venezolana tendrá hábitos alcohólicos acentuados en 20 años.",
    texto_en: "Finding attributed to Prof. Hernán Matute (Cátedra Libre Antidrogas, UPEL-IPC), as reported by Seguros Venezuela's \"Sin Adicción\" bulletin (2017): if youth consumption trends continue, 60% of Venezuela's population will have pronounced alcohol habits within 20 years."
  },
  {
    badgeClass: "soon", badge_es: "Próximamente", badge_en: "Coming soon",
    titulo_es: "Fundamentos de la Cátedra", titulo_en: "Foundations of the Chair",
    texto_es: "Una introducción al trabajo académico de CLIAD sobre prevención y vida libre de sustancias.",
    texto_en: "An introduction to CLIAD's academic work on prevention and substance-free living."
  },
  {
    badgeClass: "soon", badge_es: "Próximamente", badge_en: "Coming soon",
    titulo_es: "Prevención en la adolescencia", titulo_en: "Prevention in adolescence",
    texto_es: "Investigación aplicada a entornos escolares y familiares en Latinoamérica.",
    texto_en: "Research applied to school and family settings across Latin America."
  },
  {
    badgeClass: "soon", badge_es: "Próximamente", badge_en: "Coming soon",
    titulo_es: "Recuperación y comunidad", titulo_en: "Recovery and community",
    texto_es: "El rol del entorno cercano en los procesos de recuperación sostenida.",
    texto_en: "The role of one's close environment in sustained recovery."
  },
  {
    badgeClass: "live", badge_es: "Mencionado en prensa", badge_en: "Covered in the press",
    titulo_es: "Un llamado a duplicar la inversión en prevención",
    titulo_en: "A call to double prevention funding",
    texto_es: "En declaraciones a la prensa (2013), el Prof. Matute Brouzés propuso duplicar el financiamiento de los programas de prevención de drogas en Venezuela, señalando que la labor de CLIAD-UPEL-IPC en esta línea llevaba ya más de una década, y pidiendo extender la atención al sector laboral juvenil, comunal y de padres y representantes.",
    texto_en: "In press statements (2013), Prof. Matute Brouzés proposed doubling the funding for drug-prevention programs in Venezuela, noting that CLIAD-UPEL-IPC's work on this front was already over a decade old, and calling for expanded outreach to young workers, communities, and parents."
  },
  {
    badgeClass: "live", badge_es: "Mencionado en prensa", badge_en: "Covered in the press",
    titulo_es: "Entrevista en Globovisión: adicciones y ansiedad tras el terremoto",
    titulo_en: "Globovisión interview: addiction and anxiety after the earthquake",
    texto_es: "El Prof. Matute Brouzés fue entrevistado por Globovisión, canal nacional de Venezuela, para hablar sobre cómo enfrentar el riesgo de consumo de drogas y alcohol derivado de la ansiedad tras el terremoto que afectó al país.",
    texto_en: "Prof. Matute Brouzés was interviewed by Globovisión, Venezuela's national television channel, about addressing the risk of drug and alcohol use stemming from the anxiety caused by the earthquake that struck the country."
  },
];

function sheetURL(tab) {
  return "https://opensheet.elk.sh/" + SHEET_ID + "/" + encodeURIComponent(tab);
}
function isYes(v) {
  return String(v || "").trim().toLowerCase().indexOf("s") === 0 || String(v || "").trim().toLowerCase() === "yes";
}
function sortRows(rows) {
  return rows.slice().sort((a, b) => (parseFloat(a.orden) || 0) - (parseFloat(b.orden) || 0));
}

export default function App() {
  const [lang, setLang] = useState('es');
  const [subscribed, setSubscribed] = useState(false);
  const [distinciones, setDistinciones] = useState(defaultDistinciones);
  const [biblioteca, setBiblioteca] = useState(defaultBiblioteca);

  useEffect(() => {
    let saved = null;
    try { saved = localStorage.getItem('vmi-lang'); } catch (e) {}
    if (saved === 'en') setLang('en');
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('lang-en', lang === 'en');
    document.documentElement.setAttribute('lang', lang);
    try { localStorage.setItem('vmi-lang', lang); } catch (e) {}
  }, [lang]);

  useEffect(() => {
    if (!SHEET_ID) return;
    fetch(sheetURL("Distinciones"))
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(rows => {
        rows = sortRows(rows.filter(r => isYes(r.visible)));
        if (rows.length) setDistinciones(rows);
      })
      .catch(() => console.warn("No se pudo cargar Distinciones desde Sheets, se muestra el contenido por defecto."));

    fetch(sheetURL("Biblioteca"))
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(rows => {
        rows = sortRows(rows.filter(r => isYes(r.visible)));
        if (rows.length) {
          setBiblioteca(rows.map(r => ({
            ...r,
            badgeClass: /public|live|disponible/i.test(r.badge_es || "") ? "live" : "soon"
          })));
        }
      })
      .catch(() => console.warn("No se pudo cargar Biblioteca desde Sheets, se muestra el contenido por defecto."));
  }, []);

  function handleSubscribe(e) {
    e.preventDefault();
    setSubscribed(true);
    e.target.reset();
  }

  return (
    <>

<div className="lang-switch">
  <button id="btn-es" className={lang==='es' ? "active" : ""} onClick={() => setLang('es')}>ES</button>
  <button id="btn-en" className={lang==='en' ? "active" : ""} onClick={() => setLang('en')}>EN</button>
</div>

<header className="top">
  <div className="navbar">
    <div className="brand">
      <svg className="brand-mark" viewBox="0 0 24 24" fill="none"><path d="M12 2C12 2 8 8 8 13a4 4 0 0 0 8 0c0-5-4-11-4-11Z" fill="#F0A93B"/></svg>
      <span className="brand-name">Vela Matute Institute</span>
    </div>
    <nav className="links">
      <a href="#biblioteca" data-es>Biblioteca</a><a href="#biblioteca" data-en>Library</a>
      <a href="#modulos" data-es>Módulos</a><a href="#modulos" data-en>Modules</a>
      <a href="#recursos" data-es>Recursos</a><a href="#recursos" data-en>Resources</a>
      <a href="#alcance" data-es>Nuestro Alcance</a><a href="#alcance" data-en>Our Reach</a>
      <a href="#catedra" data-es>La Cátedra</a><a href="#catedra" data-en>The Chair</a>
    </nav>
  </div>
</header>

<section className="hero">
  <div className="wrap hero-grid">
    <div>
      <p className="eyebrow" data-es>Investigación · Educación · Comunidad</p>
      <p className="eyebrow" data-en>Research · Education · Community</p>
      <h1 data-es>Una vida libre de drogas y alcohol, <em>al alcance de todos.</em></h1>
      <h1 data-en>A life free from drugs and alcohol, <em>within everyone's reach.</em></h1>
      <p className="lede" data-es>Décadas de investigación académica del Profesor Hernán Matute, ahora abiertas al mundo: gratuitas, bilingües, y hechas para llegar a las familias que más lo necesitan.</p>
      <p className="lede" data-en>Decades of academic research from Professor Hernán Matute, now open to the world: free, bilingual, and built to reach the families who need it most.</p>
      <div className="hero-ctas">
        <a href="#suscribirse" className="btn btn-primary"><span data-es>Recibir novedades</span><span data-en>Get updates</span></a>
        <a href="#biblioteca" className="btn btn-ghost"><span data-es>Explorar la biblioteca</span><span data-en>Explore the library</span></a>
      </div>
    </div>
    <div className="candle-stage">
      <div className="candle-base-glow"></div>
      <div className="candle">
        <div className="wick"></div>
        <div className="flame">
          <svg viewBox="0 0 26 44" fill="none">
            <path d="M13 0C13 0 24 15 24 26a11 11 0 1 1-22 0C2 15 13 0 13 0Z" fill="#F0A93B"/>
            <path d="M13 12C13 12 18 21 18 27a5 5 0 1 1-10 0c0-6 5-15 5-15Z" fill="#FBDFA3"/>
          </svg>
        </div>
      </div>
    </div>
  </div>
</section>

<div className="light-trail"></div>

<div className="stats">
  <div className="wrap stats-row">
    <div>
      <div className="stat-num">~300 <span data-es>sesiones</span><span data-en>sessions</span></div>
      <div className="stat-label" data-es>de educación continua dictadas por el Prof. Matute</div>
      <div className="stat-label" data-en>continuing-education sessions delivered by Prof. Matute</div>
    </div>
    <div>
      <div className="stat-num">23 <span data-es>años</span><span data-en>years</span></div>
      <div className="stat-label" data-es>CLIAD-UPEL-IPC, fundada el 25 de octubre de 2003</div>
      <div className="stat-label" data-en>CLIAD-UPEL-IPC, founded October 25, 2003</div>
    </div>
    <div>
      <div className="stat-num">100% <span data-es>gratis</span><span data-en>free</span></div>
      <div className="stat-label" data-es>acceso sin costo, para siempre</div>
      <div className="stat-label" data-en>no-cost access, always</div>
    </div>
    <div>
      <div className="stat-num">ES / EN</div>
      <div className="stat-label" data-es>contenido bilingüe desde el día uno</div>
      <div className="stat-label" data-en>bilingual content from day one</div>
    </div>
  </div>
</div>

<section id="que-es">
  <div className="wrap">
    <div className="section-head">
      <p className="eyebrow" data-es>Qué encontrarás aquí</p>
      <p className="eyebrow" data-en>What you'll find here</p>
      <h2 data-es>Cuatro formas de acercarte a la misma luz</h2>
      <h2 data-en>Four ways to reach the same light</h2>
      <p data-es>El Instituto reúne la investigación académica de la Cátedra en un solo lugar, organizada para que cualquier persona —estudiante, profesional de salud, o familia— encuentre lo que necesita.</p>
      <p data-en>The Institute brings the Chair's academic research together in one place, organized so that anyone — student, health professional, or family — can find what they need.</p>
    </div>
    <div className="pillars">
      <div className="pillar">
        <svg className="pillar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 4h9a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3V4Z"/><path d="M20 4h-4v16h4"/></svg>
        <h3 data-es>Biblioteca de investigación</h3>
        <h3 data-en>Research library</h3>
        <p data-es>Los estudios y publicaciones de la Cátedra, resumidos en lenguaje claro y disponibles en español e inglés.</p>
        <p data-en>The Chair's studies and publications, summarized in plain language and available in Spanish and English.</p>
        <span className="tag" data-es>En construcción</span><span className="tag" data-en>In progress</span>
      </div>
      <div className="pillar">
        <svg className="pillar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 4 3 8l9 4 9-4-9-4Z"/><path d="M3 8v8l9 4 9-4V8"/></svg>
        <h3 data-es>Módulos educativos</h3>
        <h3 data-en>Educational modules</h3>
        <p data-es>Rutas cortas y prácticas: cómo hablar con un ser querido en riesgo, prevención en jóvenes, entendiendo la adicción.</p>
        <p data-en>Short, practical paths: how to talk to a loved one at risk, prevention for young people, understanding addiction.</p>
        <span className="tag" data-es>En construcción</span><span className="tag" data-en>In progress</span>
      </div>
      <div className="pillar">
        <svg className="pillar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 21s-7-5.2-9.5-9.6C.6 7.8 2.6 4 6.3 4c2 0 3.6 1.2 4.7 2.7C12.1 5.2 13.7 4 15.7 4c3.7 0 5.7 3.8 3.8 7.4C19 15.8 12 21 12 21Z"/></svg>
        <h3 data-es>Directorio de recursos</h3>
        <h3 data-en>Resource directory</h3>
        <p data-es>Líneas de ayuda y centros de apoyo en Estados Unidos y Latinoamérica, listos para cuando más se necesitan.</p>
        <p data-en>Helplines and support centers across the U.S. and Latin America, ready for when they're needed most.</p>
        <span className="tag" data-es>Disponible</span><span className="tag" data-en>Available</span>
      </div>
      <div className="pillar">
        <svg className="pillar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4.5 5-6 8-6s6.5 1.5 8 6"/></svg>
        <h3 data-es>La Cátedra</h3>
        <h3 data-en>The Chair</h3>
        <p data-es>La trayectoria del Profesor Hernán Matute y la misión que da origen a este instituto.</p>
        <p data-en>Professor Hernán Matute's career and the mission behind this institute.</p>
        <span className="tag" data-es>Disponible</span><span className="tag" data-en>Available</span>
      </div>
    </div>
  </div>
</section>

<section id="biblioteca" style={{background: 'var(--ink-deep)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)'}}>
  <div className="wrap">
    <div className="section-head">
      <p className="eyebrow" data-es>Biblioteca de investigación</p>
      <p className="eyebrow" data-en>Research library</p>
      <h2 data-es>Investigación que se puede leer, no solo citar</h2>
      <h2 data-en>Research you can read, not just cite</h2>
      <p data-es>Iremos sumando aquí los estudios y materiales de la Cátedra Libre Antidrogas (CLIAD), según el Profesor Matute los comparta. Cada uno tendrá versión resumida y versión completa.</p>
      <p data-en>We'll add the Cátedra Libre Antidrogas (CLIAD)'s studies and materials here as Professor Matute shares them. Each will include a summary version and a full version.</p>
    </div>
    <div className="lib-grid" id="lib-grid-content">
      {biblioteca.map((item, i) => (
        <div className="card" key={i}>
          <span className={`badge ${item.badgeClass}`} data-es>{item.badge_es}</span>
          <span className={`badge ${item.badgeClass}`} data-en>{item.badge_en || item.badge_es}</span>
          <h3 data-es>{item.titulo_es}</h3>
          <h3 data-en>{item.titulo_en || item.titulo_es}</h3>
          <p data-es>{item.texto_es}</p>
          <p data-en>{item.texto_en || item.texto_es}</p>
        </div>
      ))}
    </div>
  </div>
</section>

<section id="modulos">
  <div className="wrap">
    <div className="section-head">
      <p className="eyebrow" data-es>Módulos educativos</p>
      <p className="eyebrow" data-en>Educational modules</p>
      <h2 data-es>Aprender en pasos claros y cortos</h2>
      <h2 data-en>Learning in clear, short steps</h2>
    </div>
    <div className="modules">
      <div className="module-row">
        <div className="m-left">
          <span className="m-index">01</span>
          <div>
            <h3 data-es>Entendiendo la adicción</h3>
            <h3 data-en>Understanding addiction</h3>
            <p data-es>Qué ocurre en el cerebro y por qué no es una cuestión de "fuerza de voluntad".</p>
            <p data-en>What happens in the brain, and why it isn't a matter of "willpower".</p>
          </div>
        </div>
        <span className="status" data-es>Próximamente</span><span className="status" data-en>Coming soon</span>
      </div>
      <div className="module-row">
        <div className="m-left">
          <span className="m-index">02</span>
          <div>
            <h3 data-es>Hablar con un ser querido en riesgo</h3>
            <h3 data-en>Talking to a loved one at risk</h3>
            <p data-es>Guía práctica para familias, sin juicio ni confrontación.</p>
            <p data-en>A practical guide for families, without judgment or confrontation.</p>
          </div>
        </div>
        <span className="status" data-es>Próximamente</span><span className="status" data-en>Coming soon</span>
      </div>
      <div className="module-row">
        <div className="m-left">
          <span className="m-index">03</span>
          <div>
            <h3 data-es>Prevención en jóvenes</h3>
            <h3 data-en>Prevention for young people</h3>
            <p data-es>Herramientas para escuelas, comunidades e iglesias.</p>
            <p data-en>Tools for schools, communities, and congregations.</p>
          </div>
        </div>
        <span className="status" data-es>Próximamente</span><span className="status" data-en>Coming soon</span>
      </div>
    </div>
  </div>
</section>

<section id="recursos" style={{background: 'var(--ink-deep)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)'}}>
  <div className="wrap">
    <div className="section-head">
      <p className="eyebrow" data-es>Ayuda inmediata</p>
      <p className="eyebrow" data-en>Immediate help</p>
      <h2 data-es>Si tú o alguien que conoces necesita ayuda ahora</h2>
      <h2 data-en>If you or someone you know needs help now</h2>
    </div>
    <div className="resources">
      <div className="res-card">
        <h3 data-es>SAMHSA National Helpline (EE.UU.)</h3>
        <h3 data-en>SAMHSA National Helpline (U.S.)</h3>
        <div className="phone">1-800-662-4357</div>
        <p data-es>Línea gratuita, confidencial, disponible 24/7, en español e inglés, para personas y familias enfrentando trastornos por consumo de sustancias.</p>
        <p data-en>Free, confidential helpline, available 24/7, in English and Spanish, for individuals and families facing substance use disorders.</p>
      </div>
      <div className="res-card">
        <h3 data-es>988 Línea de Crisis y Suicidio</h3>
        <h3 data-en>988 Suicide & Crisis Lifeline</h3>
        <div className="phone">988</div>
        <p data-es>Apoyo inmediato en momentos de crisis emocional, disponible en todo Estados Unidos, con opción en español.</p>
        <p data-en>Immediate support during an emotional crisis, available across the U.S., with a Spanish-language option.</p>
      </div>
    </div>
  </div>
</section>

<section id="catedra">
  <div className="wrap founder">
    <div className="founder-card">
      <div className="founder-name" data-es>Prof. Dr. h.c. Hernán Oswaldo Matute Brouzés</div>
      <div className="founder-name" data-en>Prof. Dr. h.c. Hernán Oswaldo Matute Brouzés</div>
      <div className="founder-role" data-es>Profesor Emérito · Doctor Honoris Causa (UPEL) · Fundador y Coordinador General, CLIAD</div>
      <div className="founder-role" data-en>Professor Emeritus · Doctor Honoris Causa (UPEL) · Founder & General Coordinator, CLIAD</div>

      <ul className="distinctions" id="distinctions-content">
        {distinciones.map((item, i) => (
          <li key={i}>
            <span data-es>{item.es}</span>
            <span data-en>{item.en || item.es}</span>
          </li>
        ))}
      </ul>

      <div className="founder-bio">
        <p data-es>Profesor Emérito de la Universidad Pedagógica Experimental Libertador, Instituto Pedagógico de Caracas (UPEL-IPC), donde funda y coordina la Cátedra Libre Antidrogas (CLIAD) desde su creación el 25 de octubre de 2003, y la Actividad de Extensión Acreditable "Las drogas y su prevención desde el ámbito educativo". Reconocido internacionalmente por su trabajo sostenido en la enseñanza de una vida libre de drogas y alcohol.</p>
        <p data-en>Professor Emeritus at the Universidad Pedagógica Experimental Libertador, Instituto Pedagógico de Caracas (UPEL-IPC), where he founded and has coordinated the Cátedra Libre Antidrogas (CLIAD) since its creation on October 25, 2003, along with the accredited extension course "Drugs and Their Prevention in Education." Internationally recognized for his sustained work teaching a life free from drugs and alcohol.</p>
      </div>

      <div style={{height: '1px', background: 'var(--line)', margin: '26px 0'}}></div>

      <div className="founder-name" data-es>Dra. Giulliana Matute</div>
      <div className="founder-name" data-en>Dr. Giulliana Matute</div>
      <div className="founder-role" data-es>Directora Internacional de la Cátedra</div>
      <div className="founder-role" data-en>International Director of the Chair</div>
      <div className="founder-bio">
        <p data-es>Médico y fundadora de Vela Salud. Lidera la proyección internacional de la Cátedra, llevando su misión académica a comunidades hispanohablantes en Estados Unidos.</p>
        <p data-en>Physician and founder of Vela Salud. Leads the Chair's international outreach, bringing its academic mission to Spanish-speaking communities in the United States.</p>
      </div>

      <div style={{marginTop: '26px', border: '1px dashed var(--line)', borderRadius: '10px', padding: '18px', textAlign: 'center'}}>
        <p style={{fontFamily: '\'IBM Plex Mono\', monospace', fontSize: '0.7rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--sage)', margin: '0 0 6px'}} data-es>Galería de trayectoria</p>
        <p style={{fontFamily: '\'IBM Plex Mono\', monospace', fontSize: '0.7rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--sage)', margin: '0 0 6px'}} data-en>Photo gallery</p>
        <p style={{fontSize: '0.82rem', color: 'var(--parchment-dim)', margin: '0'}} data-es>Próximamente: fotos, reconocimientos y momentos del trabajo de la Cátedra a lo largo de los años.</p>
        <p style={{fontSize: '0.82rem', color: 'var(--parchment-dim)', margin: '0'}} data-en>Coming soon: photos, awards, and moments from the Chair's work over the years.</p>
      </div>
    </div>
    <div>
      <p className="eyebrow" data-es>La misión</p>
      <p className="eyebrow" data-en>The mission</p>
      <h2 style={{marginTop: '12px', fontSize: 'clamp(1.6rem,2.6vw,2.1rem)'}} data-es>De un salón de clases a millones de hogares</h2>
      <h2 style={{marginTop: '12px', fontSize: 'clamp(1.6rem,2.6vw,2.1rem)'}} data-en>From a classroom to millions of homes</h2>
      <p style={{color: 'var(--parchment-dim)', marginTop: '20px', fontSize: '0.98rem'}} data-es>
        Durante décadas, el Profesor Matute formó a generaciones de estudiantes en Venezuela desde las aulas. Ahora, junto a la Dra. Giulliana Matute como Directora Internacional de la Cátedra, ese mismo conocimiento llega —gratis, bilingüe, y accesible desde cualquier lugar— a las comunidades de Estados Unidos donde el consumo de drogas y alcohol afecta a tantas familias, muchas de ellas hispanohablantes que no encuentran recursos en su propio idioma.
      </p>
      <p style={{color: 'var(--parchment-dim)', marginTop: '20px', fontSize: '0.98rem'}} data-en>
        For decades, Professor Matute trained generations of students across Venezuela from the classroom. Now, alongside Dr. Giulliana Matute as International Director of the Chair, that same knowledge reaches — free, bilingual, and accessible from anywhere — communities across the United States where drug and alcohol use affects so many families, many of them Spanish-speaking and without resources in their own language.
      </p>
      <div className="founder-quote" style={{marginTop: '32px'}}>
        <span data-es>"¡Sigamos trabajando en un mundo libre de drogas, desde el ámbito educativo!"</span>
        <span data-en>"Let's keep working toward a world free of drugs, from the field of education!"</span>
        <cite data-es>Prof. Hernán Matute — Concejo Municipal de Baruta, charla N.º 200</cite><cite data-en>Prof. Hernán Matute — Baruta Municipal Council, 200th talk</cite>
      </div>
    </div>
  </div>
</section>

<section id="alcance" style={{background: 'var(--ink-deep)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)'}}>
  <div className="wrap">
    <div className="section-head">
      <p className="eyebrow" data-es>Nuestro enfoque</p>
      <p className="eyebrow" data-en>Our focus</p>
      <h2 data-es>De Caracas a las comunidades de Estados Unidos</h2>
      <h2 data-en>From Caracas to communities across the United States</h2>
      <p data-es>La Cátedra Libre Antidrogas (CLIAD) nació en la Universidad Pedagógica Experimental Libertador, Instituto Pedagógico de Caracas (UPEL-IPC), y hoy dirige su misión educativa a las comunidades hispanohablantes de Estados Unidos.</p>
      <p data-en>The Cátedra Libre Antidrogas (CLIAD) was founded at the Universidad Pedagógica Experimental Libertador, Instituto Pedagógico de Caracas (UPEL-IPC), and today it directs its educational mission to Spanish-speaking communities across the United States.</p>
    </div>
    <div className="resources">
      <div className="res-card">
        <h3 data-es>CLIAD — Sede fundadora</h3>
        <h3 data-en>CLIAD — Founding home</h3>
        <p data-es>Universidad Pedagógica Experimental Libertador, Instituto Pedagógico de Caracas (UPEL-IPC). Sede de la Actividad de Extensión Acreditable "Las drogas y su prevención desde el ámbito educativo", coordinada por el Prof. Hernán Matute Brouzés.</p>
        <p data-en>Universidad Pedagógica Experimental Libertador, Instituto Pedagógico de Caracas (UPEL-IPC). Home of the accredited extension course "Drugs and Their Prevention in Education," coordinated by Prof. Hernán Matute Brouzés.</p>
      </div>
      <div className="res-card">
        <h3 data-es>Vela Matute Institute — Puente a Estados Unidos</h3>
        <h3 data-en>Vela Matute Institute — A bridge to the United States</h3>
        <p data-es>Bajo la dirección internacional de la Dra. Giulliana Matute, el Instituto lleva el trabajo académico de CLIAD a familias hispanohablantes en Estados Unidos, en un formato gratuito y bilingüe.</p>
        <p data-en>Under the international direction of Dr. Giulliana Matute, the Institute brings CLIAD's academic work to Spanish-speaking families in the United States, in a free, bilingual format.</p>
      </div>
    </div>
  </div>
</section>

<section id="suscribirse" className="cta-band">
  <div className="wrap">
    <h2 data-es>Sé parte del lanzamiento</h2>
    <h2 data-en>Be part of the launch</h2>
    <p data-es>Déjanos tu correo y serás de los primeros en acceder a la biblioteca y los módulos apenas estén listos.</p>
    <p data-en>Leave us your email and you'll be among the first to access the library and modules as soon as they're ready.</p>
    <form className="cta-form" onSubmit={handleSubscribe}>
      <label htmlFor="email-input" style={{position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0,0,0,0)'}} data-es>Correo electrónico</label>
      <label htmlFor="email-input" style={{position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0,0,0,0)'}} data-en>Email address</label>
      <input id="email-input" type="email" required placeholder={lang==='en' ? 'you@email.com' : 'tu@correo.com'} />
      <button type="submit" className="btn btn-primary"><span data-es>Unirme</span><span data-en>Join</span></button>
    </form>
    {subscribed && (
      <p className="form-ok show" data-es>Gracias — te avisaremos apenas lancemos.</p>
    )}
    {subscribed && (
      <p className="form-ok show" data-en>Thanks — we'll let you know as soon as we launch.</p>
    )}
    <p className="cta-note" data-es>Sin spam. Un correo cuando haya novedades reales.</p>
    <p className="cta-note" data-en>No spam. One email when there's real news.</p>
  </div>
</section>

<footer>
  <div className="wrap footer-row">
    <p data-es>&copy; 2026 Vela Matute Institute — Un proyecto de Vela Salud, junto al Profesor Hernán Matute y la Dra. Giulliana Matute.</p>
    <p data-en>&copy; 2026 Vela Matute Institute — A Vela Salud project, together with Professor Hernán Matute and Dr. Giulliana Matute.</p>
  </div>
</footer>

    </>
  )
}
