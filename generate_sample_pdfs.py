import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

BASE_MOCK = os.path.abspath("Catovoluntarios-Frontend/public/docs/mock")
BASE_PLANTILLAS = os.path.abspath("Catovoluntarios-Frontend/public/docs/plantillas")
os.makedirs(BASE_MOCK, exist_ok=True)
os.makedirs(BASE_PLANTILLAS, exist_ok=True)

styles = getSampleStyleSheet()

title_style = ParagraphStyle(
    'DocTitle',
    parent=styles['Heading1'],
    fontName='Helvetica-Bold',
    fontSize=18,
    leading=22,
    textColor=colors.HexColor('#004077'),
    alignment=1
)

subtitle_style = ParagraphStyle(
    'DocSubtitle',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=11,
    leading=14,
    textColor=colors.HexColor('#1A4B7C'),
    alignment=1
)

body_style = ParagraphStyle(
    'DocBody',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=10,
    leading=14,
    textColor=colors.HexColor('#1E293B')
)

bold_style = ParagraphStyle(
    'DocBold',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=10,
    leading=14,
    textColor=colors.HexColor('#004077')
)

def create_poliza_pdf(filename, estudiante, ci, poliza_num, id_pol, cert_num, vig_inicio, vig_fin, estado="APROBADO"):
    filepath = os.path.join(BASE_MOCK, filename)
    doc = SimpleDocTemplate(filepath, pagesize=letter, rightMargin=40, leftMargin=40, topMargin=40, bottomMargin=40)
    story = []

    story.append(Paragraph("UNIVERSIDAD CATÓLICA BOLIVIANA \"SAN PABLO\"", title_style))
    story.append(Paragraph("PASTORAL UNIVERSITARIA · DEPARTAMENTO DE BIENESTAR ESTUDIANTIL", subtitle_style))
    story.append(Spacer(1, 10))
    story.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor('#004077'), spaceBefore=5, spaceAfter=15))

    story.append(Paragraph("CERTIFICADO INDIVIDUAL DE COBERTURA DE SEGURO", ParagraphStyle('H2', fontName='Helvetica-Bold', fontSize=14, leading=16, alignment=1, textColor=colors.HexColor('#004077'))))
    story.append(Paragraph("PÓLIZA DE SEGURO CONTRA ACCIDENTES PERSONALES ESTUDIANTILES (APC-7083)", ParagraphStyle('H3', fontName='Helvetica', fontSize=10, leading=12, alignment=1, textColor=colors.HexColor('#557FA1'))))
    story.append(Spacer(1, 15))

    badge_color = colors.HexColor('#15803D') if estado == "APROBADO" else colors.HexColor('#B91C1C')
    estado_text = "VIGENTE Y HABILITADA PARA CAMPO" if estado == "APROBADO" else "OBSERVADA / EXPIRADA"

    table_data = [
        [Paragraph("<b>ESTADO DE PÓLIZA:</b>", body_style), Paragraph(f"<b><font color='{badge_color}'>{estado_text}</font></b>", body_style)],
        [Paragraph("<b>Asegurado Titular:</b>", body_style), Paragraph(estudiante, bold_style)],
        [Paragraph("<b>Cédula de Identidad (CI):</b>", body_style), Paragraph(ci, bold_style)],
        [Paragraph("<b>N.º de Póliza Maestra:</b>", body_style), Paragraph(poliza_num, body_style)],
        [Paragraph("<b>ID de Registro UCB:</b>", body_style), Paragraph(id_pol, body_style)],
        [Paragraph("<b>N.º Certificado Individual:</b>", body_style), Paragraph(cert_num, body_style)],
        [Paragraph("<b>Periodo de Vigencia:</b>", body_style), Paragraph(f"{vig_inicio} al {vig_fin}", bold_style)],
        [Paragraph("<b>Entidad Aseguradora:</b>", body_style), Paragraph("BISA Seguros y Reaseguros S.A. en convenio con UCB", body_style)],
        [Paragraph("<b>Cobertura Principal:</b>", body_style), Paragraph("Gastos médicos por accidentes, invalidez total/permanente y sepelio durante actividades universitarias y voluntariado social en campo.", body_style)],
    ]

    t = Table(table_data, colWidths=[180, 330])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('PADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t)
    story.append(Spacer(1, 20))

    story.append(Paragraph("<b>Cláusula Pastoral de Cumplimiento Legal:</b> El presente documento certifica que el estudiante cuenta con la cobertura vigente requerida por el reglamento de Pastoral UCB para el inicio de horas presenciales en proyectos receptores.", ParagraphStyle('Note', fontName='Helvetica-Oblique', fontSize=9, leading=12, textColor=colors.HexColor('#64748B'))))
    story.append(Spacer(1, 30))

    firmas = [
        [Paragraph("___________________________________<br/><b>Lic. Andrea Moscoso V.</b><br/>Coordinación Pastoral Universitaria<br/>UCB La Paz", ParagraphStyle('F1', alignment=1, fontSize=9, leading=12)),
         Paragraph("___________________________________<br/><b>Sello y Validación Oficial</b><br/>Departamento de Bienestar Estudiantil<br/>Regional La Paz", ParagraphStyle('F2', alignment=1, fontSize=9, leading=12))]
    ]
    tf = Table(firmas, colWidths=[250, 250])
    story.append(tf)

    doc.build(story)
    print(f"Generado: {filename}")

def create_compromiso_pdf(filename, estudiante, ci, carrera, proyecto):
    filepath = os.path.join(BASE_MOCK, filename)
    doc = SimpleDocTemplate(filepath, pagesize=letter, rightMargin=40, leftMargin=40, topMargin=40, bottomMargin=40)
    story = []

    story.append(Paragraph("PASTORAL UNIVERSITARIA SAN PABLO", title_style))
    story.append(Paragraph("PROGRAMA CATOVOLUNTARIOS · REGIONAL LA PAZ", subtitle_style))
    story.append(Spacer(1, 10))
    story.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor('#004077'), spaceBefore=5, spaceAfter=15))

    story.append(Paragraph("ACTA DE COMPROMISO FORMAL DEL CATOVOLUNTARIO", ParagraphStyle('H2', fontName='Helvetica-Bold', fontSize=14, leading=16, alignment=1, textColor=colors.HexColor('#004077'))))
    story.append(Paragraph("GESTIÓN ACADÉMICA SEMESTRE 2/2026", ParagraphStyle('H3', fontName='Helvetica', fontSize=10, leading=12, alignment=1, textColor=colors.HexColor('#557FA1'))))
    story.append(Spacer(1, 15))

    texto = f"""Yo, <b>{estudiante}</b>, con Cédula de Identidad <b>{ci}</b>, estudiante regular de la carrera de <b>{carrera}</b> de la Universidad Católica Boliviana "San Pablo" Regional La Paz, asignado(a) formalmente al proyecto receptor <b>{proyecto}</b>, manifiesto mi voluntad libre y consciente de incorporarme como Catovoluntario y me comprometo a:<br/><br/>
    <b>1. Asistencia y Puntualidad:</b> Cumplir responsablemente con una carga mínima de cuatro (4) horas semanales de servicio y acompañamiento en los días y horarios acordados con el centro receptor.<br/>
    <b>2. Inducción Previa Obligatoria:</b> Asistir y aprobar el Taller Institucional de Inducción de Pastoral y el recorrido en sitio antes de iniciar actividades en campo.<br/>
    <b>3. Cobertura del Seguro:</b> Mantener al día y vigente mi Póliza de Accidentes Personales Universitaria (APC-7083), asumiendo que sin ella no podré registrar horas presenciales.<br/>
    <b>4. Ética y Salvaguarda:</b> Promover el trato digno, respetuoso y cordial con la población atendida, observando el código de ética y protección a personas en situación de vulnerabilidad.<br/>
    <b>5. Reporte Oportuno:</b> Registrar semanalmente mis horas de voluntariado ante el Catolíder asignado y comunicar con 48 horas de anticipación cualquier imprevisto académico de fuerza mayor."""

    story.append(Paragraph(texto, body_style))
    story.append(Spacer(1, 40))

    firmas = [
        [Paragraph(f"___________________________________<br/><b>{estudiante}</b><br/>Catovoluntario Firmante<br/>CI: {ci}", ParagraphStyle('F1', alignment=1, fontSize=9, leading=12)),
         Paragraph("___________________________________<br/><b>Catolíder Coordinador</b><br/>Pastoral Universitaria UCB<br/>V.º B.º Aprobación", ParagraphStyle('F2', alignment=1, fontSize=9, leading=12))]
    ]
    tf = Table(firmas, colWidths=[250, 250])
    story.append(tf)

    doc.build(story)
    print(f"Generado: {filename}")

def create_ci_pdf(filename, estudiante, ci):
    filepath = os.path.join(BASE_MOCK, filename)
    doc = SimpleDocTemplate(filepath, pagesize=letter, rightMargin=40, leftMargin=40, topMargin=40, bottomMargin=40)
    story = []

    story.append(Paragraph("ESTADO PLURINACIONAL DE BOLIVIA", title_style))
    story.append(Paragraph("DOCUMENTO DE IDENTIDAD DIGITALIZADO · EXPEDIENTE ESTUDIANTIL", subtitle_style))
    story.append(Spacer(1, 10))
    story.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor('#004077'), spaceBefore=5, spaceAfter=15))

    story.append(Paragraph("FOTOCOPIA LEGALIZADA DE CÉDULA DE IDENTIDAD (ANVERSO Y REVERSO)", ParagraphStyle('H2', fontName='Helvetica-Bold', fontSize=13, leading=15, alignment=1, textColor=colors.HexColor('#004077'))))
    story.append(Spacer(1, 20))

    ci_box_data = [
        [Paragraph("<b>ESTUDIANTE / TITULAR:</b>", body_style), Paragraph(f"<b>{estudiante}</b>", bold_style)],
        [Paragraph("<b>NÚMERO DE CARNET (CI):</b>", body_style), Paragraph(f"<font size=13 color='#004077'><b>{ci}</b></font>", body_style)],
        [Paragraph("<b>Nacionalidad:</b>", body_style), Paragraph("Boliviana", body_style)],
        [Paragraph("<b>Estado de Verificación:</b>", body_style), Paragraph("<font color='#15803D'><b>COTEJADO Y VALIDADO EN SISTEMA UCB</b></font>", body_style)],
    ]
    t = Table(ci_box_data, colWidths=[180, 330])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#EFF6FF')),
        ('BOX', (0,0), (-1,-1), 1.5, colors.HexColor('#3B82F6')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#BFDBFE')),
        ('PADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t)
    story.append(Spacer(1, 30))

    # Tarjetas simuladas anverso / reverso
    cards_data = [
        [
            Paragraph("<b>ANVERSO DE C.I.</b><br/><br/>República de Bolivia<br/>Cédula de Identidad<br/>Serie: A-2026<br/><br/><b>Nombre:</b> " + estudiante + "<br/><b>CI:</b> " + ci + "<br/><br/>[FOTOGRAFÍA Y HUELLA COTEJADA]", ParagraphStyle('CardA', alignment=1, fontSize=9, leading=13)),
            Paragraph("<b>REVERSO DE C.I.</b><br/><br/>Profesión/Ocupación: Estudiante Universitario<br/>Domicilio: La Paz, Bolivia<br/>Fecha Emisión: 12/01/2022<br/>Vencimiento: 12/01/2032<br/><br/>[CÓDIGO DE BARRAS SEGIP]", ParagraphStyle('CardR', alignment=1, fontSize=9, leading=13)),
        ]
    ]
    tc = Table(cards_data, colWidths=[240, 240])
    tc.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#94A3B8')),
        ('INNERGRID', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
        ('PADDING', (0,0), (-1,-1), 12),
    ]))
    story.append(tc)
    doc.build(story)
    print(f"Generado: {filename}")

def create_carta_menor_pdf(filename, menor, ci_menor, tutor, ci_tutor):
    filepath = os.path.join(BASE_MOCK, filename)
    doc = SimpleDocTemplate(filepath, pagesize=letter, rightMargin=40, leftMargin=40, topMargin=40, bottomMargin=40)
    story = []

    story.append(Paragraph("PASTORAL UNIVERSITARIA SAN PABLO - UCB", title_style))
    story.append(Paragraph("AUTORIZACIÓN PATERNA / MATERNA PARA VOLUNTARIADO (MENOR DE EDAD)", subtitle_style))
    story.append(Spacer(1, 10))
    story.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor('#004077'), spaceBefore=5, spaceAfter=15))

    texto = f"""Yo, <b>{tutor}</b>, mayor de edad y hábil por derecho, con Cédula de Identidad N.º <b>{ci_tutor}</b>, en pleno ejercicio de mi patria potestad como Padre / Madre / Tutor Legal del/de la estudiante menor de edad:<br/><br/>
    Nombre del Menor: <b>{menor}</b><br/>
    Cédula de Identidad: <b>{ci_menor}</b><br/>
    Edad: <b>17 años</b><br/>
    Carrera Universitaria: <b>Psicología - UCB La Paz</b><br/><br/>
    <b>DECLARO:</b><br/>
    1. Que he sido debidamente informado(a) sobre el Programa Catovoluntarios y las tareas de servicio social que mi hijo(a) llevará a cabo en instituciones aliadas.<br/>
    2. Que AUTORIZO su participación en campo y el cumplimiento de las jornadas formativas, constatando que cuenta con el seguro universitario de accidentes personales APC-7083.<br/>
    3. Que adjunto fotocopia de mi cédula de identidad en constancia de legalidad y conformidad."""

    story.append(Paragraph(texto, body_style))
    story.append(Spacer(1, 40))

    firmas = [
        [Paragraph(f"___________________________________<br/><b>{tutor}</b><br/>Firma Padre / Madre o Tutor Legal<br/>CI: {ci_tutor}", ParagraphStyle('F1', alignment=1, fontSize=9, leading=12)),
         Paragraph(f"___________________________________<br/><b>{menor}</b><br/>Firma del Catovoluntario Menor<br/>CI: {ci_menor}", ParagraphStyle('F2', alignment=1, fontSize=9, leading=12))]
    ]
    tf = Table(firmas, colWidths=[250, 250])
    story.append(tf)

    doc.build(story)
    print(f"Generado: {filename}")

# Generar todos los archivos necesarios
create_poliza_pdf("poliza_maria_rojas.pdf", "María Fernanda Rojas", "9420187 LP", "APC-7083", "POL-2026-0814", "CERT-11408", "01/08/2026", "31/07/2027", "APROBADO")
create_compromiso_pdf("compromiso_maria_rojas.pdf", "María Fernanda Rojas", "9420187 LP", "Psicología", "Hogar San Ramón - Área Memoria")
create_ci_pdf("ci_maria_rojas.pdf", "María Fernanda Rojas", "9420187 LP")
create_ci_pdf("ci_padre_tutor.pdf", "Fernando Rojas Méndez (Padre/Tutor)", "4782910 LP")
create_carta_menor_pdf("carta_padres_diego.pdf", "Diego M. Quispe", "9982473 LP", "Mario Quispe Mamani", "3491029 LP")

create_poliza_pdf("poliza_lucas_vargas.pdf", "Lucas C. Vargas", "8392160 LP", "APC-7083", "POL-2026-0512", "CERT-09941", "01/08/2026", "31/07/2027", "APROBADO")
create_compromiso_pdf("compromiso_lucas.pdf", "Lucas C. Vargas", "8392160 LP", "Ingeniería Comercial", "Hogar San Ramón")
create_ci_pdf("ci_lucas.pdf", "Lucas C. Vargas", "8392160 LP")

# Caso Observado: Póliza vencida de Andrea Pérez
create_poliza_pdf("poliza_andrea_perez.pdf", "Andrea T. Pérez", "7631194 LP", "APC-7083", "POL-2025-0100", "CERT-04123", "01/08/2025", "31/07/2026", "OBSERVADO")
create_compromiso_pdf("compromiso_andrea.pdf", "Andrea T. Pérez", "7631194 LP", "Derecho", "Hogar San Ramón")

create_poliza_pdf("poliza_diego.pdf", "Diego M. Quispe", "9982473 LP", "APC-7083", "POL-2026-1109", "CERT-12001", "01/08/2026", "31/07/2027", "APROBADO")
create_compromiso_pdf("compromiso_diego.pdf", "Diego M. Quispe", "9982473 LP", "Ciencias de la Comunicación", "Comedor Santa Rita")
create_ci_pdf("ci_diego.pdf", "Diego M. Quispe", "9982473 LP")

# Plantillas oficiales
create_compromiso_pdf("../plantillas/Compromiso_Catovoluntario_Pastoral_UCB_2_2026.pdf", "Estudiante Voluntario", "CI: ______________", "Carrera: ______________", "Proyecto Receptor UCB")
create_carta_menor_pdf("../plantillas/Modelo_Oficial_Autorizacion_Padres_Pastoral_UCB.pdf", "Nombre del Estudiante Menor", "CI: ______________", "Nombre del Padre / Madre o Tutor Legal", "CI: ______________")

# Copia .docx de muestra para compatibilidad
with open(os.path.join(BASE_PLANTILLAS, "Modelo_Oficial_Autorizacion_Padres_Pastoral_UCB.docx"), "w", encoding="utf-8") as f:
    f.write("PASTORAL UNIVERSITARIA SAN PABLO - PROGRAMA CATOVOLUNTARIOS\nMODELO OFICIAL DE AUTORIZACIÓN DE PADRES PARA MENORES DE EDAD (2/2026)\n\nYo, _________________________, con CI _____________________, autorizo a mi hijo/a _________________________ a realizar el voluntariado social en campo.\nFirma: _________________________\nFecha: La Paz, 2026.")

print("Todos los PDFs y DOCs generados exitosamente.")
