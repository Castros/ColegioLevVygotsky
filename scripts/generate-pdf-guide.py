#!/usr/bin/env python3
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, KeepTogether
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER

OUTPUT = "/home/vmdad/projects/vigotskyreynosa/docs/guia-administrador-contenido.pdf"

# ── Colour palette ──────────────────────────────────────────────────────────
BLUE   = colors.HexColor("#1e3a5f")
ACCENT = colors.HexColor("#4945ff")
GOLD   = colors.HexColor("#f5a623")
LIGHT  = colors.HexColor("#f0f4ff")
GRAY   = colors.HexColor("#555555")
GREEN  = colors.HexColor("#2e7d32")
YELLOW = colors.HexColor("#f57f17")

# ── Styles ───────────────────────────────────────────────────────────────────
base = getSampleStyleSheet()

def style(name, parent="Normal", **kw):
    s = ParagraphStyle(name, parent=base[parent], **kw)
    return s

H1 = style("H1", "Heading1",
    fontSize=22, textColor=BLUE, spaceAfter=6, spaceBefore=14,
    fontName="Helvetica-Bold")
H2 = style("H2", "Heading2",
    fontSize=15, textColor=ACCENT, spaceAfter=4, spaceBefore=10,
    fontName="Helvetica-Bold")
H3 = style("H3", "Heading3",
    fontSize=12, textColor=BLUE, spaceAfter=3, spaceBefore=6,
    fontName="Helvetica-Bold")
BODY = style("Body", fontSize=10, textColor=GRAY, spaceAfter=4,
    leading=14, fontName="Helvetica")
BULLET = style("Bullet", fontSize=10, textColor=GRAY, spaceAfter=3,
    leading=14, leftIndent=18, bulletIndent=6, fontName="Helvetica")
CODE = style("Code", fontSize=9, textColor=colors.HexColor("#333333"),
    backColor=colors.HexColor("#f5f5f5"), leading=13,
    leftIndent=12, rightIndent=12, spaceBefore=4, spaceAfter=4,
    fontName="Courier")
NOTE = style("Note", fontSize=9, textColor=colors.HexColor("#4a4a00"),
    backColor=colors.HexColor("#fffde7"), leading=13,
    leftIndent=10, rightIndent=10, spaceBefore=4, spaceAfter=6,
    fontName="Helvetica-Oblique")
WARN = style("Warn", fontSize=9, textColor=colors.HexColor("#7b1f1f"),
    backColor=colors.HexColor("#fff0f0"), leading=13,
    leftIndent=10, rightIndent=10, spaceBefore=4, spaceAfter=6,
    fontName="Helvetica-Oblique")
FOOTER = style("Footer", fontSize=8, textColor=colors.HexColor("#999999"),
    alignment=TA_CENTER, fontName="Helvetica-Oblique")
TITLE_MAIN = style("TitleMain", fontSize=28, textColor=colors.white,
    alignment=TA_CENTER, fontName="Helvetica-Bold", leading=34)
TITLE_SUB  = style("TitleSub",  fontSize=14, textColor=colors.HexColor("#cce0ff"),
    alignment=TA_CENTER, fontName="Helvetica", spaceAfter=4)
TITLE_URL  = style("TitleUrl",  fontSize=10, textColor=GOLD,
    alignment=TA_CENTER, fontName="Helvetica-Bold")

# ── Helpers ──────────────────────────────────────────────────────────────────
def hr(color=ACCENT, thickness=0.5):
    return HRFlowable(width="100%", thickness=thickness, color=color,
                      spaceAfter=6, spaceBefore=4)

def section_number(n, title):
    return Paragraph(f"<b>{n}. {title}</b>", H2)

def bullet(text):
    return Paragraph(f"• {text}", BULLET)

def note(text):
    return Paragraph(f"<b>Nota:</b> {text}", NOTE)

def warn(text):
    return Paragraph(f"<b>⚠ Importante:</b> {text}", WARN)

def code_block(lines):
    paras = []
    for line in lines:
        paras.append(Paragraph(line.replace(" ", "&nbsp;"), CODE))
    return paras

# ── Table helpers ────────────────────────────────────────────────────────────
def simple_table(headers, rows, col_widths=None):
    TS = style("TH", fontSize=9, textColor=colors.white,
               fontName="Helvetica-Bold", alignment=TA_CENTER)
    TB = style("TD", fontSize=9, textColor=GRAY, fontName="Helvetica", leading=12)
    data = [[Paragraph(h, TS) for h in headers]]
    for row in rows:
        data.append([Paragraph(str(c), TB) for c in row])
    t = Table(data, colWidths=col_widths, repeatRows=1)
    t.setStyle(TableStyle([
        ("BACKGROUND",  (0,0), (-1,0), BLUE),
        ("ROWBACKGROUNDS",(0,1),(-1,-1),[colors.white, LIGHT]),
        ("GRID",        (0,0), (-1,-1), 0.4, colors.HexColor("#cccccc")),
        ("TOPPADDING",  (0,0), (-1,-1), 5),
        ("BOTTOMPADDING",(0,0),(-1,-1), 5),
        ("LEFTPADDING", (0,0), (-1,-1), 8),
        ("RIGHTPADDING",(0,0),(-1,-1), 8),
        ("VALIGN",      (0,0), (-1,-1), "MIDDLE"),
    ]))
    return t

# ── Cover page ───────────────────────────────────────────────────────────────
def cover_page():
    cover_data = [[
        Paragraph("Guía de Administración<br/>de Contenido", TITLE_MAIN),
    ]]
    cover = Table(cover_data, colWidths=[6.5*inch])
    cover.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,-1), BLUE),
        ("TOPPADDING",  (0,0), (-1,-1), 60),
        ("BOTTOMPADDING",(0,0),(-1,-1), 60),
        ("LEFTPADDING", (0,0), (-1,-1), 30),
        ("RIGHTPADDING",(0,0),(-1,-1), 30),
        ("ROUNDEDCORNERS", (0,0), (-1,-1), 8),
    ]))
    return [
        Spacer(1, 0.6*inch),
        cover,
        Spacer(1, 0.25*inch),
        Paragraph("Colegio Lev Vygotsky", TITLE_SUB),
        Paragraph("Sistema de Gestión de Contenido", TITLE_SUB),
        Spacer(1, 0.15*inch),
        Paragraph("https://cms.vigotskyreynosa.edu.mx/admin", TITLE_URL),
        Spacer(1, 0.4*inch),
        hr(GOLD, 1.5),
        Spacer(1, 0.15*inch),
        Paragraph("Soporte técnico: castrostech@gmail.com", FOOTER),
        Spacer(1, 1.2*inch),
    ]

# ── Page template ─────────────────────────────────────────────────────────────
def on_page(canvas, doc):
    canvas.saveState()
    # Header bar
    canvas.setFillColor(BLUE)
    canvas.rect(0, letter[1]-36, letter[0], 36, fill=1, stroke=0)
    canvas.setFillColor(colors.white)
    canvas.setFont("Helvetica-Bold", 9)
    canvas.drawString(0.5*inch, letter[1]-22, "Colegio Lev Vygotsky — Guía de Administración de Contenido")
    # Footer
    canvas.setFillColor(GRAY)
    canvas.setFont("Helvetica", 8)
    canvas.drawCentredString(letter[0]/2, 0.4*inch, f"Página {doc.page}")
    canvas.setFillColor(ACCENT)
    canvas.rect(0, 0.25*inch, letter[0], 1.5, fill=1, stroke=0)
    canvas.restoreState()

# ── Document content ─────────────────────────────────────────────────────────
def build_story():
    s = []

    # Cover
    s += cover_page()

    # Intro box
    intro_rows = [[Paragraph(
        "Con este sistema puedes actualizar el contenido del sitio web del colegio "
        "<b>sin necesidad de conocimientos técnicos</b>. Los cambios que realices "
        "aparecerán en el sitio web en aproximadamente <b>3 a 4 minutos</b> después de publicar.",
        BODY)]]
    intro_t = Table(intro_rows, colWidths=[6.5*inch])
    intro_t.setStyle(TableStyle([
        ("BACKGROUND",    (0,0),(-1,-1), LIGHT),
        ("TOPPADDING",    (0,0),(-1,-1), 12),
        ("BOTTOMPADDING", (0,0),(-1,-1), 12),
        ("LEFTPADDING",   (0,0),(-1,-1), 14),
        ("RIGHTPADDING",  (0,0),(-1,-1), 14),
    ]))
    s += [intro_t, Spacer(1, 0.1*inch)]

    s += [Paragraph("Puedes:", BODY)]
    for item in [
        "Cambiar textos e imágenes de las secciones principales",
        "Crear y publicar artículos en el blog",
        "Actualizar información de los niveles educativos",
        "Actualizar datos de contacto y horarios",
        "Administrar testimonios y servicios",
    ]:
        s.append(bullet(item))
    s.append(hr())

    # Section 1
    s += [section_number(1, "Cómo iniciar sesión"), Spacer(1,4)]
    for step in [
        "Abre tu navegador y ve a: <b>https://cms.vigotskyreynosa.edu.mx/admin</b>",
        "Ingresa tu correo electrónico y contraseña",
        'Haz clic en <b>"Iniciar sesión"</b>',
    ]:
        s.append(bullet(step))
    s.append(note(
        '¿Olvidaste tu contraseña? Haz clic en "¿Olvidaste tu contraseña?" en la pantalla '
        "de inicio de sesión. Recibirás un correo electrónico con un enlace para crear una nueva contraseña."
    ))
    s.append(hr())

    # Section 2
    s += [section_number(2, "El panel principal"), Spacer(1,4),
          Paragraph("Una vez que inicies sesión, verás el panel principal. En el lado izquierdo hay un menú:", BODY)]
    s += [
        Paragraph("<b>Gestor de contenido</b> — Aquí están todos los contenidos del sitio web organizados por tipo.", BULLET),
        Paragraph("<b>Configuración</b> — Para ajustes del sistema (no es necesario entrar aquí normalmente).", BULLET),
    ]
    s.append(hr())

    # Section 3
    s += [section_number(3, "Cómo editar contenido existente"), Spacer(1,4),
          Paragraph("Estos son los <b>Tipos únicos</b> — hay uno solo de cada uno.", BODY)]
    for step in [
        'En el menú izquierdo, busca <b>"Gestor de contenido"</b>',
        "Haz clic en el nombre de la sección que quieres editar",
        "Haz clic en el contenido para abrirlo",
        "Edita los campos que necesitas cambiar",
        'Cuando termines, haz clic en <b>"Guardar"</b> y luego en <b>"Publicar"</b>',
    ]:
        s.append(bullet(step))

    s.append(Spacer(1, 6))
    s.append(simple_table(
        ["Sección", "Descripción"],
        [
            ["Homepage",      "Texto principal de la página de inicio"],
            ["About Section", 'Sección "Acerca de" en la página de inicio'],
            ["Cta Section",   "Botón de llamada a la acción"],
            ["Contact Page",  "Información de contacto y horarios"],
            ["Services Page", "Página de servicios"],
            ["About Page",    'Página completa "Acerca de nosotros"'],
        ],
        col_widths=[2.5*inch, 4*inch],
    ))
    s.append(hr())

    # Section 4 — Save & Publish (key section)
    s += [section_number(4, "Guardar y Publicar — Lo más importante"), Spacer(1,4)]

    steps_data = [
        [Paragraph("PASO 1", style("SN", fontSize=13, textColor=colors.white,
                                    fontName="Helvetica-Bold", alignment=TA_CENTER)),
         Paragraph('Haz clic en <b>"GUARDAR"</b><br/>'
                   'Guarda tus cambios pero <b>NO</b> los publica todavía', BODY)],
        [Paragraph("PASO 2", style("SN2", fontSize=13, textColor=colors.white,
                                    fontName="Helvetica-Bold", alignment=TA_CENTER)),
         Paragraph('Haz clic en <b>"PUBLICAR"</b><br/>'
                   'Envía los cambios al sitio web', BODY)],
        [Paragraph("⏱", style("SN3", fontSize=16, textColor=GOLD,
                               fontName="Helvetica-Bold", alignment=TA_CENTER)),
         Paragraph("El sitio se actualiza en <b>3–4 minutos</b>", BODY)],
    ]
    steps_t = Table(steps_data, colWidths=[1.3*inch, 5.2*inch])
    steps_t.setStyle(TableStyle([
        ("BACKGROUND",    (0,0), (0,0), GREEN),
        ("BACKGROUND",    (0,1), (0,1), ACCENT),
        ("BACKGROUND",    (0,2), (0,2), YELLOW),
        ("ROWBACKGROUNDS",(1,0), (1,-1), [colors.white]),
        ("VALIGN",        (0,0), (-1,-1), "MIDDLE"),
        ("TOPPADDING",    (0,0), (-1,-1), 10),
        ("BOTTOMPADDING", (0,0), (-1,-1), 10),
        ("LEFTPADDING",   (0,0), (-1,-1), 10),
        ("RIGHTPADDING",  (0,0), (-1,-1), 10),
        ("GRID",          (0,0), (-1,-1), 0.5, colors.HexColor("#cccccc")),
        ("ROUNDEDCORNERS",(0,0), (-1,-1), 4),
    ]))
    s.append(steps_t)
    s.append(Spacer(1, 8))
    s.append(warn(
        "Si solo guardas pero no publicas, los cambios NO aparecerán en el sitio web. "
        "Siempre debes hacer los dos pasos."
    ))

    s += [Paragraph("¿Cómo sé si está publicado?", H3)]
    s.append(simple_table(
        ["Estado", "Significado"],
        [
            ["Publicado (verde)",  "Visible en el sitio web"],
            ["Borrador (amarillo)","Guardado pero NO visible en el sitio"],
            ["Modificado (azul)",  "Hay cambios sin publicar"],
        ],
        col_widths=[2.5*inch, 4*inch],
    ))
    s.append(hr())

    # Section 5 — Blog
    s += [section_number(5, "Cómo crear una nueva entrada de blog"), Spacer(1,4)]
    for step in [
        'En el menú izquierdo, haz clic en <b>"Blog Posts"</b>',
        'Haz clic en el botón <b>"+ Crear nueva entrada"</b> (esquina superior derecha)',
        "Completa los campos (ver tabla)",
        'Haz clic en <b>"Guardar"</b>',
        'Haz clic en <b>"Publicar"</b>',
    ]:
        s.append(bullet(step))
    s.append(Spacer(1, 6))
    s.append(simple_table(
        ["Campo", "Descripción"],
        [
            ["Title",          "Título del artículo"],
            ["Slug",           "Dirección web del artículo (se genera solo, no cambies)"],
            ["Content",        "Cuerpo del artículo"],
            ["Published Date", "Fecha de publicación"],
            ["Cover Image",    "Imagen principal del artículo"],
            ["Category",       "Categoría del artículo"],
            ["Excerpt",        "Resumen corto (aparece en la lista del blog)"],
        ],
        col_widths=[2*inch, 4.5*inch],
    ))
    s.append(note("El artículo aparecerá en el sitio web en 3–4 minutos."))
    s.append(hr())

    # Section 6 — Images
    s += [section_number(6, "Cómo subir imágenes"), Spacer(1,4)]
    for step in [
        'Haz clic en el área de imagen o en el botón <b>"Agregar un activo"</b>',
        "Se abre la biblioteca de medios",
        'Para usar una imagen existente: haz clic en la imagen y selecciona <b>"Finalizar selección"</b>',
        'Para subir una nueva: haz clic en <b>"Agregar nuevos activos"</b> y selecciona el archivo',
    ]:
        s.append(bullet(step))
    s.append(Spacer(1, 6))
    s.append(Paragraph("<b>Recomendaciones para imágenes:</b>", BODY))
    for rec in [
        "Formato: JPG o PNG",
        "Tamaño máximo recomendado: 2 MB",
        "Para fotos: usa imágenes horizontales (paisaje)",
        "Asegúrate de que la imagen tenga buena iluminación y resolución",
    ]:
        s.append(bullet(rec))
    s.append(hr())

    # Section 7 — Collections
    s += [section_number(7, "Editar Servicios, Testimonios y Niveles Educativos"), Spacer(1,4),
          Paragraph("Estos son <b>Tipos de colección</b> — pueden tener varios elementos.", BODY)]
    s.append(simple_table(
        ["Colección", "Contenido"],
        [
            ["Services",          "Servicios del colegio"],
            ["Testimonials",      "Testimonios de padres de familia"],
            ["Education Levels",  "Niveles educativos (Kínder, Primaria, etc.)"],
            ["Value Propositions","Propuestas de valor en la página de inicio"],
        ],
        col_widths=[2.5*inch, 4*inch],
    ))
    for step in [
        "En el menú izquierdo, haz clic en el tipo que quieres editar",
        "Verás una lista de todos los elementos existentes",
        "Haz clic en el elemento que quieres editar, realiza los cambios",
        'Haz clic en <b>"Guardar"</b> y luego <b>"Publicar"</b>',
    ]:
        s.append(bullet(step))
    s.append(hr())

    # Section 8 — Language
    s += [section_number(8, "Cambiar el idioma del panel a Español"), Spacer(1,4),
          Paragraph("Si el panel aparece en inglés:", BODY)]
    for step in [
        "Haz clic en tu nombre en la esquina superior derecha",
        'Selecciona <b>"Perfil"</b>',
        'Busca <b>"Idioma de la interfaz"</b>',
        'Selecciona <b>"Español"</b>',
        'Haz clic en <b>"Guardar"</b>',
    ]:
        s.append(bullet(step))
    s.append(hr())

    # Section 9 — FAQ
    s += [section_number(9, "Preguntas frecuentes"), Spacer(1,4)]
    faqs = [
        ("¿Cuánto tiempo tarda en actualizarse el sitio?",
         "Entre 3 y 4 minutos después de publicar. Si pasaron más de 10 minutos y no ves los cambios, "
         "refresca el sitio presionando Ctrl+F5 (Windows) o Cmd+Shift+R (Mac)."),
        ("¿Puedo deshacer un cambio?",
         "Una vez publicado, no hay botón de deshacer. Si necesitas revertir un cambio, "
         "edita el contenido nuevamente con los valores anteriores y vuelve a publicar."),
        ("¿Qué pasa si cierro el navegador sin guardar?",
         'Los cambios que no guardaste se perderán. Siempre haz clic en "Guardar" antes de cerrar.'),
        ("¿Puedo editar desde mi celular?",
         "Sí, el panel funciona en celular aunque es más cómodo usarlo en computadora."),
        ("¿Qué hago si veo un error?",
         "Toma una captura de pantalla y envíala al soporte técnico: castrostech@gmail.com"),
    ]
    QS = style("QS", fontSize=10, textColor=BLUE, fontName="Helvetica-Bold", spaceAfter=2)
    for q, a in faqs:
        s.append(KeepTogether([
            Paragraph(q, QS),
            Paragraph(a, BODY),
            Spacer(1, 4),
        ]))
    s.append(hr())

    # Section 10 — Workflow
    s += [section_number(10, "Flujo de trabajo recomendado"), Spacer(1,8)]
    flow_steps = [
        ("1", "Inicia sesión en el panel"),
        ("2", "Ve al contenido que quieres cambiar"),
        ("3", "Realiza los cambios"),
        ("4", 'Haz clic en <b>GUARDAR</b>'),
        ("5", "Revisa que todo se vea bien"),
        ("6", 'Haz clic en <b>PUBLICAR</b>'),
        ("7", "Espera 3–4 minutos"),
        ("8", "Visita el sitio web para confirmar los cambios"),
    ]
    NS = style("NS", fontSize=13, textColor=colors.white, fontName="Helvetica-Bold",
               alignment=TA_CENTER)
    FS = style("FS", fontSize=10, textColor=GRAY, fontName="Helvetica", leading=13)
    flow_data = []
    for num, text in flow_steps:
        bg = ACCENT if int(num) % 2 == 0 else BLUE
        flow_data.append([
            Paragraph(num, NS),
            Paragraph(text, FS),
        ])
    flow_t = Table(flow_data, colWidths=[0.5*inch, 6*inch])
    row_colors = []
    for i, (num, _) in enumerate(flow_steps):
        c = ACCENT if int(num) % 2 == 0 else BLUE
        row_colors.append(("BACKGROUND", (0,i), (0,i), c))
    flow_t.setStyle(TableStyle([
        ("VALIGN",        (0,0), (-1,-1), "MIDDLE"),
        ("TOPPADDING",    (0,0), (-1,-1), 8),
        ("BOTTOMPADDING", (0,0), (-1,-1), 8),
        ("LEFTPADDING",   (0,0), (-1,-1), 8),
        ("RIGHTPADDING",  (0,0), (-1,-1), 8),
        ("ROWBACKGROUNDS",(1,0), (1,-1), [LIGHT, colors.white]),
        ("GRID",          (0,0), (-1,-1), 0.4, colors.HexColor("#cccccc")),
    ] + row_colors))
    s.append(flow_t)

    s += [
        Spacer(1, 0.3*inch),
        hr(GOLD, 1),
        Paragraph("Guía preparada por FranSolution&nbsp;&nbsp;|&nbsp;&nbsp;soporte: castrostech@gmail.com", FOOTER),
    ]
    return s

# ── Build ─────────────────────────────────────────────────────────────────────
doc = SimpleDocTemplate(
    OUTPUT,
    pagesize=letter,
    rightMargin=0.75*inch,
    leftMargin=0.75*inch,
    topMargin=0.75*inch,
    bottomMargin=0.65*inch,
    title="Guía de Administración de Contenido — Colegio Lev Vygotsky",
    author="FranSolution",
)
doc.build(build_story(), onFirstPage=on_page, onLaterPages=on_page)
print(f"PDF generated: {OUTPUT}")
