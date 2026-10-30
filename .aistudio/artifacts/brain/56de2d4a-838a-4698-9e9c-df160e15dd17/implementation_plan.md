# Plan de Implementación: Sistema de Listas de Precios y Cuotas de Planes de Ahorro

Aplicación web empresarial de alto rendimiento diseñada para concesionarios y agencias de planes de ahorro. Transforma la información de la circular oficial (actualización Citroën Octubre 2026 y futuras circulares) en un listado unificado, interactivo y exportable para **Supervisores** y **Gerencia**, con control de acceso por PIN, edición de suscripción comercial, cálculo normativo de sellados de Provincia de Buenos Aires y generadores de cotizaciones para WhatsApp, Excel y PDF.

## Decisiones Críticas y Confirmaciones del Usuario

> [!IMPORTANT]
> A partir de las respuestas confirmadas en la etapa de clarificación:
> 1. **Datos Precargados**: Se digitaliza y precarga íntegramente la circular oficial de Citroën (Octubre 2026: modelos C3, Basalt, Aircross, Berlingo Van) con todos sus desgloses financieros y sellados de ARBA (Provincia de Buenos Aires).
> 2. **Control de Perfil Gerencial**: Selector de perfil con modal de PIN seguro (PIN por defecto `1234` editable) que habilita la visibilidad de la Cuota 1 y permite modificar el Valor de Suscripción para los equipos comerciales.
> 3. **Herramientas de Exportación**: Exportación directa a planilla Excel formateada, generación de PDF comercial imprimible y generador de fichas listas para copiar y enviar por WhatsApp.

---

## 1. Visión General y Concepto

La herramienta resuelve la dispersión de información que sufren los supervisores y asesores de ventas al consultar circulares en PDF de múltiples páginas (oferta, detalle de cuotas y sellados provinciales por separado). 

Consolida en una única tabla de alta densidad:
- Todos los vehículos activos de la oferta oficial.
- El cálculo exacto de la **Cuota Pura** `(Valor Básico × % Financiado) / Total de Cuotas`.
- La segmentación exacta de tramos de cuotas solicitados: **Cuota 2 a 12**, **Cuota 13 a 20**, **Cuota 21 a 84**, y **Cuota 84 a 120** (incorporando la incidencia del sellado de la Provincia de Buenos Aires según el prorrateo de cada modelo).
- La gestión comercial del **Valor de Suscripción** modificado por Gerencia, garantizando que el equipo comercial trabaje siempre con los precios oficiales aprobados.

---

## 2. Experiencia de Usuario y Diseño Visual

Siguiendo las pautas de diseño para **SaaS & Dashboards de Alta Densidad**:
- **Paleta de Colores**: Neutro pizarra corporativo (`slate-900`/`slate-50`), detalles en azul cobalto automotriz (`blue-600`) y acentos en verde esmeralda para entregas pactadas y condiciones promocionales.
- **Tipografía y Legibilidad**: Fuente de titulares y navegación contemporánea y limpia (`Plus Jakarta Sans`), con estricto uso de números tabulares monospaciados (`tabular-nums font-mono`) para todas las cifras monetarias, porcentajes y cuotas.
- **Vistas Especializadas**:
  1. **Vista Supervisor / Asesores**: Listado de modelos con búsqueda en tiempo real, filtros por tipo de plan (70/30, 80/20, 100%) y cantidad de cuotas (84 o 120), mostrando el valor de suscripción fijado por Gerencia, valores de cuotas por tramo y entregas pactadas. Oculta de forma estricta la Cuota 1 confidencial.
  2. **Vista Gerencia (Desbloqueada con PIN)**: Revela la columna confidencial de Cuota 1, activa campos de edición en línea (o modal rápido) para el Valor de Suscripción de cada modelo, permite guardar ajustes en memoria local persistente y restablecer valores originales del PDF cuando se requiera.
  3. **Panel de Desglose por Modelo**: Al hacer clic en un modelo, se despliega una ficha técnica completa con el detalle de alícuota, derecho de inscripción, sellado de Buenos Aires, seguro de vida, diferimiento comercial, recupero y licitaciones pactadas.
  4. **Barra de Acciones Rápidas**: Botón de exportación a Excel, botón para descargar PDF de lista de precios y botón "Compartir en WhatsApp" con texto formateado listo para enviar a prospectos.

---

## 3. Modelo de Datos y Cálculos Financieros

### Modelos y Datos Precargados (Circular Oficial Octubre 2026)

| Modelo | Tipo Plan | Cuotas | Valor Básico | Cuota Pura | Cuota 1 (Gerencia) | Suscripción Base | Sellado Prov. Bs. As. (Física) | Prorrateo Sellado | Entregas Pactadas |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **C3 1.3 FEEL MY27 (Plan Look)** | 70/30 | 120 | $33.180.000 | $193.549 | $140.679 | $140.679 | $468.867,22 (1,17%) | Cuotas 2 a 13 (12 ctas) | CTA 12 (Lic. Mín: CTA 12 + 20%) |
| **C3 1.3 FEEL MY27 (Plan Feel)** | 80/20 | 84 | $33.180.000 | $315.874 | $293.276 | $293.276 | $454.775,35 (1,17%) | Cuotas 2 a 13 (12 ctas) | CTA 4, 6, 9 y 12 (AE) |
| **BASALT 1.3 LIVE PK (80/20)** | 80/20 | 84 | $38.260.000 | $364.235 | $338.178 | $338.178 | $459.472,64 (1,17%) | Cuotas 2 a 13 (12 ctas) | CTA 4, 6, 9 y 12 (AE) |
| **BASALT 1.3 FEEL MY27 (100%)** | 100% | 84 | $40.480.000 | $481.712 | $495.812 | $495.812 | $571.584,40 (1,17%) | Cuotas 2 a 13 (12 ctas) | CTA 2 (Lic. Mín: CTA 2 + 10%) |
| **AIRCROSS 1.3 FEEL PK (80/20)** | 80/20 | 84 | $43.980.000 | $418.690 | $388.737 | $388.737 | $609.029,74 (1,17%) | Cuotas 2 a 13 (12 ctas) | CTA 4, 6, 9 y 12 (AE) |
| **BERLINGO VAN L2 HDI 92** | 70/30 | 120 | $44.810.000 | $261.391 | $295.392 | $295.392 | $613.693,48 (1,17%) | Cuotas 2 a 13 (12 ctas) | CTA 4, 6 y 9 (Lic. Mín: 30%) |

### Metodología de Cálculo de Cuotas:
- **Cuota Pura**: `(Precio Lista × % Financiado) / Total Cuotas`.
- **Sellado Provincia de Buenos Aires**: Se toma la tasa del 1,17% para personas físicas con el monto exacto de ARBA indicado en la circular y se prorratea en las cuotas establecidas (generalmente Cuotas 2 a 13, es decir 12 cuotas).
- **Tramos de Cuotas**:
  - **Cuota 2 a 12**: Incluye alícuota mensual, arancel administrativo, derecho de inscripción prorrateado, seguro de vida, sellado provincial mensual de Buenos Aires y bonificaciones/diferimientos comerciales del período.
  - **Cuota 13 a 20**: Finalización del diferimiento comercial e inscripción, absorción de recupero si aplica.
  - **Cuota 21 a 84**: Régimen estable post-inscripción con recupero de diferimiento.
  - **Cuota 84 a 120**: Para planes de 120 cuotas (C3 Look y Berlingo), cuota regular final sin diferimientos.

---

## 4. Arquitectura Técnica de la Aplicación

```
┌────────────────────────────────────────────────────────────────────────┐
│                        BARRA SUPERIOR (HEADER)                         │
│  [Logo Citroën Plan] ── [Buscador & Filtros] ── [Exportar / WhatsApp]  │
│                                              ── [Modo: Supervisor/Gerencia]│
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
           ┌─────────────────────────┴─────────────────────────┐
           ▼                                                   ▼
┌──────────────────────────────────────┐  ┌──────────────────────────────────────┐
│       MODO SUPERVISOR (PÚBLICO)      │  │        MODO GERENCIA (CON PIN)       │
│  - Listado de modelos                │  │  - Todo lo de Supervisor             │
│  - Valor Básico & Cuota Pura         │  │  - Visualización Cuota 1 confidencial│
│  - Suscripción fijada por Gerencia   │  │  - Edición en línea de Suscripciones │
│  - Tramos de Cuotas (2-12, 13-20...) │  │  - Guardado en LocalStorage          │
│  - Entregas Pactadas y Licitaciones  │  │  - Configuración de PIN y Reset      │
└──────────────────────────────────────┘  └──────────────────────────────────────┘
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   TABLA PRINCIPAL DE PRECIOS & CUOTAS                  │
│  - Grilla interactiva con ordenamiento de columnas                     │
│  - Valores formateados en ARS ($) con cifras tabulares                 │
│  - Botón "Ficha Comercial" para ver desglose completo del modelo       │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
           ┌─────────────────────────┼─────────────────────────┐
           ▼                         ▼                         ▼
┌───────────────────────┐ ┌───────────────────────┐ ┌───────────────────────┐
│     EXPORTAR EXCEL    │ │      EXPORTAR PDF     │ │    COPIAR WHATSAPP    │
│  - Planilla .xlsx     │ │  - Formato membretado │ │  - Texto formateado   │
│    con fórmulas       │ │    para imprimir      │ │    con emojis de venta│
└───────────────────────┘ └───────────────────────┘ └───────────────────────┘
```

---

## 5. Fases de Ejecución

1. **Estructura y Tipado TypeScript**: Definición del modelo de datos de vehículos, tramos de cuotas, sellados, licitaciones y configuración gerencial.
2. **Dataset Oficial Precargado**: Incorporación exacta de los datos extraídos de la circular Citroën de Octubre 2026.
3. **Módulo de Autenticación y PIN de Gerencia**: Modal interactivo para ingreso de PIN, cambio de PIN y modo supervisor seguro con almacenamiento local (`localStorage`).
4. **Tabla Principal y Buscador de Modelos**: Componente de tabla responsiva con filtrado rápido por marca, modelo, tipo de plan y cantidad de cuotas.
5. **Panel de Desglose y Modal de Ficha**: Modal con información técnica detallada de cada vehículo (aranceles, sellados de Bs. As., diferimientos, fechas de adjudicación pactada).
6. **Módulos de Exportación**:
   - Generación de archivo Excel (.csv/.xlsx estructurado).
   - Impresión limpia en PDF optimizada para hojas A4.
   - Generador y copiador al portapapeles de cotización para WhatsApp.
7. **Verificación y Compilación**: Pruebas con `compile_applet` para garantizar cero errores de tipos y renderizado impecable.
