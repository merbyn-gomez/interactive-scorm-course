# De los datos a las decisiones 🎓

**Curso interactivo sobre indicadores de aprendizaje**

**EdTech · Diseño instruccional · HTML5 · CSS · JavaScript · SCORM 1.2**

Proyecto de portafolio de Merbyn Gómez Rondón: un minicurso en español con **tres lecciones**, tres comprobaciones de aprendizaje, ejemplos numéricos y una **evaluación final de cinco preguntas**. Está diseñado como demostración de desarrollo de contenidos digitales para educación corporativa.

### Probar el curso
- **Vista en navegador:** abre `index.html` directamente en tu navegador o usa GitHub Pages cuando esté habilitado.
- **Posible URL de GitHub Pages:** https://merbyn-gomez.github.io/interactive-scorm-course/ (**requiere activar Pages; no se garantiza que esté publicada todavía**).

### Objetivos de aprendizaje
1. Distinguir finalización, aprobación y actividad educativa.
2. Calcular tasas con numeradores y denominadores definidos.
3. Interpretar señales ficticias de un LMS y proponer acciones basadas en evidencia.

### Secuencia didáctica
| Sección | Experiencia |
| --- | --- |
| Inicio | Objetivos, duración aproximada de 20 minutos |
| Lección 1 | Elegir indicadores adecuados |
| Lección 2 | Calcular tasas: 120 matrículas, 90 finalizadores y 72 aprobados |
| Lección 3 | Interpretar datos y evitar conclusiones causales apresuradas |
| Evaluación final | Cinco preguntas, cuatro correctas para aprobar (**80 %**) |

### Integración SCORM 1.2
El curso está implementado como un único SCO. Intenta conectarse con la API SCORM 1.2 del LMS y almacenar avance, sección, puntuación (0–100) y estado de aprobación. Si no hay plataforma, utiliza `localStorage` en el navegador.

**Importante:** se ha comprobado la sintaxis JavaScript y la estructura XML/ZIP mediante GitHub Actions, pero la comunicación completa todavía debe validarse en un Moodle, Blackboard u otro LMS compatible.

### Descargar el paquete SCORM
Abre [Actions](https://github.com/merbyn-gomez/interactive-scorm-course/actions) → ejecución exitosa **Validate & build SCORM package** → sección **Artifacts** → descarga `scorm-12-package`. El archivo descargado contiene `curso-indicadores-SCORM12.zip`. El manifiesto se encuentra en la raíz del ZIP interior, que es el archivo que debes importar al LMS.

También puedes generar el ZIP en tu equipo desde la raíz del repositorio:

```powershell
Compress-Archive -Path index.html, imsmanifest.xml -DestinationPath curso-indicadores-SCORM12.zip -Force
```

### Estructura
```text
index.html                  # Curso y runtime SCORM en una sola página
imsmanifest.xml             # Manifiesto SCORM 1.2
tests/validate.py           # Validación de sintaxis y paquete
.github/workflows/          # Construcción automática del ZIP
README.md                   # Documentación del portafolio
```

**Datos y transparencia:** todos los casos son ficticios. No hay datos privados de estudiantes ni empresas. No se expide certificación académica oficial.

---

**English:** Interactive Spanish microcourse on learning analytics KPIs, built with vanilla JavaScript and a SCORM 1.2 interface. Features structured lessons, formative feedback, five-question final assessment and local progress persistence. LMS-specific interoperability awaits validation.
