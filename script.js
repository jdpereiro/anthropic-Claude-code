// Porcentajes de cotización a la Seguridad Social (2024-2025)
const COTIZACIONES = {
    trabajador: {
        contingenciasComunes: 4.70,  // Para pensiones, IT, etc.
        desempleoIndefinido: 1.55,   // Contrato indefinido
        desempleoTemporal: 1.60,     // Contrato temporal
        formacion: 0.10              // Formación profesional
    },
    empresa: {
        contingenciasComunes: 23.60, // La empresa paga mucho más
        desempleoIndefinido: 5.50,   // Contrato indefinido
        desempleoTemporal: 6.70,     // Contrato temporal (mayor que indefinido)
        fogasa: 0.20,                // Fondo de Garantía Salarial
        formacion: 0.60              // Formación profesional
    }
};

// Función para formatear números como moneda
function formatCurrency(amount) {
    return new Intl.NumberFormat('es-ES', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount) + ' €';
}

// Función para formatear porcentajes
function formatPercentage(percent) {
    return new Intl.NumberFormat('es-ES', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(percent) + '%';
}

// Función principal de cálculo
function calcularNomina() {
    // Obtener valores de entrada
    const salarioBruto = parseFloat(document.getElementById('salarioBruto').value) || 0;
    const irpfPct = parseFloat(document.getElementById('irpf').value) || 0;
    const pagas = parseInt(document.getElementById('pagas').value);
    const esTemporal = document.getElementById('contratoTemporal').checked;

    // Seleccionar porcentajes según tipo de contrato
    const desempleoTrabajador = esTemporal ?
        COTIZACIONES.trabajador.desempleoTemporal :
        COTIZACIONES.trabajador.desempleoIndefinido;
    const desempleoEmpresa = esTemporal ?
        COTIZACIONES.empresa.desempleoTemporal :
        COTIZACIONES.empresa.desempleoIndefinido;

    // Actualizar porcentajes mostrados en la UI
    document.getElementById('desempleoTrabajadorPct').textContent = desempleoTrabajador.toFixed(2);
    document.getElementById('desempleoEmpresaPct').textContent = desempleoEmpresa.toFixed(2);

    // ============ CÁLCULOS DEL TRABAJADOR ============

    // Cotizaciones a la Seguridad Social del trabajador
    const ccTrabajador = salarioBruto * COTIZACIONES.trabajador.contingenciasComunes / 100;
    const desempleoTrabajadorImporte = salarioBruto * desempleoTrabajador / 100;
    const fpTrabajador = salarioBruto * COTIZACIONES.trabajador.formacion / 100;
    const totalSSTrabajador = ccTrabajador + desempleoTrabajadorImporte + fpTrabajador;

    // Retención IRPF
    const retencionIRPF = salarioBruto * irpfPct / 100;

    // Total descuentos y salario neto
    const totalDescuentos = totalSSTrabajador + retencionIRPF;
    const salarioNeto = salarioBruto - totalDescuentos;

    // ============ CÁLCULOS DE LA EMPRESA ============

    // Cotizaciones a la Seguridad Social de la empresa
    const ccEmpresa = salarioBruto * COTIZACIONES.empresa.contingenciasComunes / 100;
    const desempleoEmpresaImporte = salarioBruto * desempleoEmpresa / 100;
    const fogasa = salarioBruto * COTIZACIONES.empresa.fogasa / 100;
    const fpEmpresa = salarioBruto * COTIZACIONES.empresa.formacion / 100;
    const totalSSEmpresa = ccEmpresa + desempleoEmpresaImporte + fogasa + fpEmpresa;

    // Coste total para la empresa
    const costeTotal = salarioBruto + totalSSEmpresa;

    // ============ ACTUALIZAR INTERFAZ ============

    // Resumen visual
    document.getElementById('costeEmpresa').textContent = formatCurrency(costeTotal);
    document.getElementById('salarioBrutoDisplay').textContent = formatCurrency(salarioBruto);
    document.getElementById('salarioNeto').textContent = formatCurrency(salarioNeto);
    document.getElementById('diferenciaCosteBruto').textContent = formatCurrency(totalSSEmpresa);
    document.getElementById('totalDescuentos').textContent = formatCurrency(totalDescuentos);

    // Desglose del trabajador
    document.getElementById('ccTrabajador').textContent = formatCurrency(ccTrabajador);
    document.getElementById('desempleoTrabajador').textContent = formatCurrency(desempleoTrabajadorImporte);
    document.getElementById('fpTrabajador').textContent = formatCurrency(fpTrabajador);
    document.getElementById('totalSSTrabajador').textContent = formatCurrency(totalSSTrabajador);
    document.getElementById('retencionIRPF').textContent = formatCurrency(retencionIRPF);
    document.getElementById('totalDescuentosTrabajador').textContent = formatCurrency(totalDescuentos);

    // Desglose de la empresa
    document.getElementById('ccEmpresa').textContent = formatCurrency(ccEmpresa);
    document.getElementById('desempleoEmpresa').textContent = formatCurrency(desempleoEmpresaImporte);
    document.getElementById('fogasa').textContent = formatCurrency(fogasa);
    document.getElementById('fpEmpresa').textContent = formatCurrency(fpEmpresa);
    document.getElementById('totalSSEmpresa').textContent = formatCurrency(totalSSEmpresa);

    // ============ SECCIÓN EDUCATIVA ============

    // Calcular porcentajes sobre el coste total
    const pctSSEmpresa = (totalSSEmpresa / costeTotal) * 100;
    const pctSSTrabajador = (totalSSTrabajador / costeTotal) * 100;
    const pctIRPF = (retencionIRPF / costeTotal) * 100;
    const pctNeto = (salarioNeto / costeTotal) * 100;

    // Actualizar la barra visual
    document.getElementById('barEmpresaExtra').style.width = pctSSEmpresa + '%';
    document.getElementById('barTrabajadorSS').style.width = pctSSTrabajador + '%';
    document.getElementById('barIRPF').style.width = pctIRPF + '%';
    document.getElementById('barNeto').style.width = pctNeto + '%';

    // Actualizar textos de porcentajes
    document.getElementById('pctSSEmpresa').textContent = formatPercentage(pctSSEmpresa);
    document.getElementById('pctSSTrabajador').textContent = formatPercentage(pctSSTrabajador);
    document.getElementById('pctIRPF').textContent = formatPercentage(pctIRPF);
    document.getElementById('pctNeto').textContent = formatPercentage(pctNeto);

    // ============ DATOS CLAVE ============

    // Ratio: Por cada euro que recibes, la empresa paga...
    const ratioCosteNeto = salarioNeto > 0 ? costeTotal / salarioNeto : 0;
    document.getElementById('ratioCosteNeto').textContent = ratioCosteNeto.toFixed(2) + '€';

    // Porcentaje que recibes del coste total
    const pctRecibes = pctNeto;
    document.getElementById('pctRecibes').textContent = formatPercentage(pctRecibes);

    // Total que va a Seguridad Social (empresa + trabajador)
    const totalSS = totalSSEmpresa + totalSSTrabajador;
    document.getElementById('dineroSS').textContent = formatCurrency(totalSS);

    // ============ OCULTAR LABELS EN BARRAS PEQUEÑAS ============
    // Si un segmento es muy pequeño, ocultar su label
    const labels = document.querySelectorAll('.bar-label');
    const segments = document.querySelectorAll('.bar-segment');

    segments.forEach((segment, index) => {
        const width = parseFloat(segment.style.width);
        const label = segment.querySelector('.bar-label');
        if (label) {
            // Ocultar label si el segmento es menor al 8%
            if (width < 8) {
                label.style.display = 'none';
            } else {
                label.style.display = 'flex';
            }
        }
    });
}

// ============ EVENT LISTENERS ============

// Calcular al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    calcularNomina();
});

// Recalcular cuando cambie cualquier input
document.getElementById('salarioBruto').addEventListener('input', calcularNomina);
document.getElementById('irpf').addEventListener('input', calcularNomina);
document.getElementById('pagas').addEventListener('change', calcularNomina);
document.getElementById('contratoTemporal').addEventListener('change', calcularNomina);

// ============ VALIDACIONES ============

// Validar que el salario no sea negativo
document.getElementById('salarioBruto').addEventListener('blur', function() {
    if (this.value < 0) {
        this.value = 0;
        calcularNomina();
    }
});

// Validar que el IRPF esté entre 0 y 47%
document.getElementById('irpf').addEventListener('blur', function() {
    if (this.value < 0) {
        this.value = 0;
    } else if (this.value > 47) {
        this.value = 47;
    }
    calcularNomina();
});

// ============ INFORMACIÓN ADICIONAL ============

// Mostrar información sobre pagas extraordinarias
document.getElementById('pagas').addEventListener('change', function() {
    const pagas = parseInt(this.value);

    if (pagas === 14) {
        console.log('Modo 14 pagas: Recibirás dos pagas extras al año (verano y Navidad)');
    } else {
        console.log('Modo 12 pagas: Las pagas extras están prorrateadas en tu salario mensual');
    }
});

// ============ HELPER PARA DEBUG ============

// Función para mostrar todos los cálculos en consola (útil para debugging)
function mostrarCalculosDetallados() {
    const salarioBruto = parseFloat(document.getElementById('salarioBruto').value) || 0;
    const irpfPct = parseFloat(document.getElementById('irpf').value) || 0;
    const esTemporal = document.getElementById('contratoTemporal').checked;

    console.group('📊 Cálculos Detallados de Nómina');
    console.log('Salario Bruto:', formatCurrency(salarioBruto));
    console.log('Tipo de contrato:', esTemporal ? 'Temporal' : 'Indefinido');
    console.log('IRPF:', irpfPct + '%');
    console.groupEnd();
}

// Hacer la función disponible globalmente para debugging
window.mostrarCalculosDetallados = mostrarCalculosDetallados;

// ============ MEJORAS DE ACCESIBILIDAD ============

// Anunciar cambios importantes a lectores de pantalla
function anunciarCambio(mensaje) {
    const anuncio = document.createElement('div');
    anuncio.setAttribute('role', 'status');
    anuncio.setAttribute('aria-live', 'polite');
    anuncio.className = 'sr-only';
    anuncio.textContent = mensaje;
    document.body.appendChild(anuncio);

    setTimeout(() => {
        document.body.removeChild(anuncio);
    }, 1000);
}

// Anunciar cuando se completa un cálculo
let calcularTimeout;
document.getElementById('salarioBruto').addEventListener('input', function() {
    clearTimeout(calcularTimeout);
    calcularTimeout = setTimeout(() => {
        const salarioNeto = document.getElementById('salarioNeto').textContent;
        anunciarCambio(`Salario neto actualizado: ${salarioNeto}`);
    }, 1000);
});

// ============ CÁLCULOS ANUALES ============

// Variables globales para datos mensuales
let datosNominaMensual = {};

// Función para calcular datos anuales
function calcularAnual() {
    const pagas = parseInt(document.getElementById('pagas').value);

    // Calcular importes anuales
    const costeEmpresaAnual = datosNominaMensual.costeTotal * pagas;
    const salarioBrutoAnual = datosNominaMensual.salarioBruto * pagas;
    const salarioNetoAnual = datosNominaMensual.salarioNeto * pagas;
    const totalSSTrabajadorAnual = datosNominaMensual.totalSSTrabajador * pagas;
    const totalSSEmpresaAnual = datosNominaMensual.totalSSEmpresa * pagas;
    const retencionIRPFAnual = datosNominaMensual.retencionIRPF * pagas;
    const totalDescuentosAnual = datosNominaMensual.totalDescuentos * pagas;
    const totalSSAnual = totalSSTrabajadorAnual + totalSSEmpresaAnual;

    // Actualizar elementos del DOM
    document.getElementById('numPagas').textContent = pagas;
    document.getElementById('costeEmpresaAnual').textContent = formatCurrency(costeEmpresaAnual);
    document.getElementById('salarioBrutoAnual').textContent = formatCurrency(salarioBrutoAnual);
    document.getElementById('salarioNetoAnual').textContent = formatCurrency(salarioNetoAnual);

    document.getElementById('ssTrabajadorAnual').textContent = formatCurrency(totalSSTrabajadorAnual);
    document.getElementById('irpfAnual').textContent = formatCurrency(retencionIRPFAnual);
    document.getElementById('totalDescuentosAnual').textContent = formatCurrency(totalDescuentosAnual);

    document.getElementById('ssEmpresaAnual').textContent = formatCurrency(totalSSEmpresaAnual);
    document.getElementById('salariosPagadosAnual').textContent = formatCurrency(salarioBrutoAnual);
    document.getElementById('costeTotalAnual').textContent = formatCurrency(costeEmpresaAnual);

    document.getElementById('totalSSAnual').textContent = formatCurrency(totalSSAnual);
    document.getElementById('diferenciaAnual').textContent = formatCurrency(costeEmpresaAnual - salarioNetoAnual);
    document.getElementById('salarioMedioMensual').textContent = formatCurrency(salarioNetoAnual / 12);

    // Actualizar texto de información según el número de pagas
    if (pagas === 14) {
        document.getElementById('pagasExtraInfo').textContent =
            'Con 14 pagas, recibes dos pagas extras al año (normalmente en junio/julio y diciembre). Estas pagas también tienen retenciones de Seguridad Social e IRPF.';
    } else {
        document.getElementById('pagasExtraInfo').textContent =
            'Con 12 pagas, las pagas extraordinarias están prorrateadas en tu salario mensual. No recibes pagas extras separadas, pero tu salario mensual es más alto.';
    }
}

// ============ CAMBIO DE VISTA (MENSUAL/ANUAL) ============

let vistaMensual = true;

function cambiarVista(esMensual) {
    vistaMensual = esMensual;

    // Actualizar botones
    document.getElementById('btnMensual').classList.toggle('active', esMensual);
    document.getElementById('btnAnual').classList.toggle('active', !esMensual);

    // Actualizar indicador de período
    document.getElementById('periodText').textContent = esMensual ? 'Cálculo Mensual' : 'Cálculo Anual';

    // Mostrar/ocultar sección anual
    const anualSection = document.getElementById('anualSection');
    if (esMensual) {
        anualSection.style.display = 'none';
    } else {
        anualSection.style.display = 'block';
        calcularAnual();
        // Scroll suave a la sección anual
        anualSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Event listeners para botones de vista
document.getElementById('btnMensual').addEventListener('click', () => cambiarVista(true));
document.getElementById('btnAnual').addEventListener('click', () => cambiarVista(false));

// ============ EXPORTACIÓN A PDF ============

function exportarAPDF() {
    const btnExport = document.getElementById('btnExportPDF');
    const textoOriginal = btnExport.textContent;

    // Mostrar feedback al usuario
    btnExport.textContent = '⏳ Generando PDF...';
    btnExport.disabled = true;

    // Verificar que html2pdf esté cargado
    if (typeof html2pdf === 'undefined') {
        alert('Error: La librería de exportación a PDF no está disponible. Por favor, verifica tu conexión a internet.');
        btnExport.textContent = textoOriginal;
        btnExport.disabled = false;
        return;
    }

    // Crear un elemento temporal con todo el contenido a exportar
    const contenido = document.createElement('div');
    contenido.style.padding = '20px';
    contenido.style.backgroundColor = 'white';

    // Obtener datos actuales
    const salarioBruto = document.getElementById('salarioBruto').value;
    const irpf = document.getElementById('irpf').value;
    const pagas = document.getElementById('pagas').value;
    const esTemporal = document.getElementById('contratoTemporal').checked;
    const fecha = new Date().toLocaleDateString('es-ES');

    // Crear el contenido del PDF
    contenido.innerHTML = `
        <div style="font-family: Arial, sans-serif; color: #1e293b;">
            <h1 style="color: #2563eb; border-bottom: 3px solid #2563eb; padding-bottom: 10px;">
                📊 Calculadora de Nómina Española
            </h1>
            <p style="color: #64748b; margin-bottom: 30px;">
                Generado el ${fecha}
            </p>

            <h2 style="color: #1e293b; margin-top: 30px;">📝 Datos del Trabajador</h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                <tr style="background: #f8fafc;">
                    <td style="padding: 10px; border: 1px solid #e2e8f0;"><strong>Salario Bruto Mensual:</strong></td>
                    <td style="padding: 10px; border: 1px solid #e2e8f0;">${salarioBruto} €</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #e2e8f0;"><strong>Retención IRPF:</strong></td>
                    <td style="padding: 10px; border: 1px solid #e2e8f0;">${irpf}%</td>
                </tr>
                <tr style="background: #f8fafc;">
                    <td style="padding: 10px; border: 1px solid #e2e8f0;"><strong>Pagas Anuales:</strong></td>
                    <td style="padding: 10px; border: 1px solid #e2e8f0;">${pagas === '14' ? '14 pagas (con extras)' : '12 pagas (prorrateadas)'}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #e2e8f0;"><strong>Tipo de Contrato:</strong></td>
                    <td style="padding: 10px; border: 1px solid #e2e8f0;">${esTemporal ? 'Temporal' : 'Indefinido'}</td>
                </tr>
            </table>

            <h2 style="color: #1e293b; margin-top: 30px;">💰 Resumen Mensual</h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                <tr style="background: #fee2e2;">
                    <td style="padding: 15px; border: 2px solid #ef4444;"><strong>🏢 Coste Total Empresa:</strong></td>
                    <td style="padding: 15px; border: 2px solid #ef4444; font-size: 18px;"><strong>${document.getElementById('costeEmpresa').textContent}</strong></td>
                </tr>
                <tr style="background: #dbeafe;">
                    <td style="padding: 15px; border: 2px solid #3b82f6;"><strong>📄 Salario Bruto:</strong></td>
                    <td style="padding: 15px; border: 2px solid #3b82f6; font-size: 18px;"><strong>${document.getElementById('salarioBrutoDisplay').textContent}</strong></td>
                </tr>
                <tr style="background: #d1fae5;">
                    <td style="padding: 15px; border: 2px solid #10b981;"><strong>💳 Salario Neto:</strong></td>
                    <td style="padding: 15px; border: 2px solid #10b981; font-size: 18px;"><strong>${document.getElementById('salarioNeto').textContent}</strong></td>
                </tr>
            </table>

            <h2 style="color: #1e293b; margin-top: 30px;">📊 Desglose Mensual Detallado</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
                <div>
                    <h3 style="color: #3b82f6; background: #dbeafe; padding: 10px; border-radius: 5px;">👤 Descuentos del Trabajador</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px; border: 1px solid #e2e8f0;">Contingencias Comunes (4,70%)</td>
                            <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: right;">${document.getElementById('ccTrabajador').textContent}</td>
                        </tr>
                        <tr style="background: #f8fafc;">
                            <td style="padding: 8px; border: 1px solid #e2e8f0;">Desempleo (${document.getElementById('desempleoTrabajadorPct').textContent}%)</td>
                            <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: right;">${document.getElementById('desempleoTrabajador').textContent}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border: 1px solid #e2e8f0;">Formación Profesional (0,10%)</td>
                            <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: right;">${document.getElementById('fpTrabajador').textContent}</td>
                        </tr>
                        <tr style="background: #dbeafe;">
                            <td style="padding: 10px; border: 2px solid #3b82f6;"><strong>Total Seg. Social Trabajador</strong></td>
                            <td style="padding: 10px; border: 2px solid #3b82f6; text-align: right;"><strong>${document.getElementById('totalSSTrabajador').textContent}</strong></td>
                        </tr>
                        <tr style="background: #e9d5ff;">
                            <td style="padding: 10px; border: 1px solid #8b5cf6;"><strong>Retención IRPF</strong></td>
                            <td style="padding: 10px; border: 1px solid #8b5cf6; text-align: right;"><strong>${document.getElementById('retencionIRPF').textContent}</strong></td>
                        </tr>
                        <tr style="background: #3b82f6; color: white;">
                            <td style="padding: 12px; border: 2px solid #3b82f6;"><strong>TOTAL DESCUENTOS</strong></td>
                            <td style="padding: 12px; border: 2px solid #3b82f6; text-align: right;"><strong>${document.getElementById('totalDescuentosTrabajador').textContent}</strong></td>
                        </tr>
                    </table>
                </div>
                <div>
                    <h3 style="color: #ef4444; background: #fee2e2; padding: 10px; border-radius: 5px;">🏢 Costes Adicionales Empresa</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px; border: 1px solid #e2e8f0;">Contingencias Comunes (23,60%)</td>
                            <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: right;">${document.getElementById('ccEmpresa').textContent}</td>
                        </tr>
                        <tr style="background: #f8fafc;">
                            <td style="padding: 8px; border: 1px solid #e2e8f0;">Desempleo (${document.getElementById('desempleoEmpresaPct').textContent}%)</td>
                            <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: right;">${document.getElementById('desempleoEmpresa').textContent}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border: 1px solid #e2e8f0;">FOGASA (0,20%)</td>
                            <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: right;">${document.getElementById('fogasa').textContent}</td>
                        </tr>
                        <tr style="background: #f8fafc;">
                            <td style="padding: 8px; border: 1px solid #e2e8f0;">Formación Profesional (0,60%)</td>
                            <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: right;">${document.getElementById('fpEmpresa').textContent}</td>
                        </tr>
                        <tr style="background: #fee2e2;">
                            <td style="padding: 10px; border: 2px solid #ef4444;"><strong>Total Seg. Social Empresa</strong></td>
                            <td style="padding: 10px; border: 2px solid #ef4444; text-align: right;"><strong>${document.getElementById('totalSSEmpresa').textContent}</strong></td>
                        </tr>
                    </table>
                </div>
            </div>

            <h2 style="color: #1e293b; margin-top: 30px;">📅 Proyección Anual (${pagas} pagas)</h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <tr style="background: #fee2e2;">
                    <td style="padding: 12px; border: 2px solid #ef4444;"><strong>Coste Total Empresa Anual:</strong></td>
                    <td style="padding: 12px; border: 2px solid #ef4444; text-align: right; font-size: 16px;"><strong>${formatCurrency(datosNominaMensual.costeTotal * pagas)}</strong></td>
                </tr>
                <tr style="background: #dbeafe;">
                    <td style="padding: 12px; border: 2px solid #3b82f6;"><strong>Salario Bruto Anual:</strong></td>
                    <td style="padding: 12px; border: 2px solid #3b82f6; text-align: right; font-size: 16px;"><strong>${formatCurrency(datosNominaMensual.salarioBruto * pagas)}</strong></td>
                </tr>
                <tr style="background: #d1fae5;">
                    <td style="padding: 12px; border: 2px solid #10b981;"><strong>Salario Neto Anual:</strong></td>
                    <td style="padding: 12px; border: 2px solid #10b981; text-align: right; font-size: 16px;"><strong>${formatCurrency(datosNominaMensual.salarioNeto * pagas)}</strong></td>
                </tr>
                <tr style="background: #fef3c7;">
                    <td style="padding: 12px; border: 1px solid #d97706;"><strong>Total Seguridad Social Anual:</strong></td>
                    <td style="padding: 12px; border: 1px solid #d97706; text-align: right;"><strong>${formatCurrency((datosNominaMensual.totalSSEmpresa + datosNominaMensual.totalSSTrabajador) * pagas)}</strong></td>
                </tr>
                <tr style="background: #e9d5ff;">
                    <td style="padding: 12px; border: 1px solid #8b5cf6;"><strong>Total IRPF Anual:</strong></td>
                    <td style="padding: 12px; border: 1px solid #8b5cf6; text-align: right;"><strong>${formatCurrency(datosNominaMensual.retencionIRPF * pagas)}</strong></td>
                </tr>
            </table>

            <div style="background: #fef3c7; padding: 15px; border-left: 4px solid #d97706; margin-top: 30px;">
                <p style="margin: 0; color: #1e293b;"><strong>💡 Dato clave:</strong> Por cada 1€ que recibes de salario neto, la empresa paga ${document.getElementById('ratioCosteNeto').textContent} en total.</p>
            </div>

            <div style="background: #f8fafc; padding: 15px; margin-top: 20px; border: 1px solid #e2e8f0; border-radius: 5px;">
                <p style="font-size: 12px; color: #64748b; margin: 0;">
                    ⚠️ Esta calculadora tiene carácter orientativo y educativo. Los cálculos pueden variar según convenio, categoría profesional, bases de cotización, y otros factores. Consulta tu nómina oficial para datos exactos.
                </p>
                <p style="font-size: 12px; color: #64748b; margin: 5px 0 0 0;">
                    Datos actualizados para 2024-2025 | Régimen General de la Seguridad Social
                </p>
            </div>
        </div>
    `;

    // Configuración de html2pdf
    const opciones = {
        margin: 10,
        filename: `nomina-calculadora-${salarioBruto}EUR-${fecha.replace(/\//g, '-')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Generar el PDF
    html2pdf().set(opciones).from(contenido).save().then(() => {
        // Restaurar botón
        btnExport.textContent = textoOriginal;
        btnExport.disabled = false;

        // Mostrar mensaje de éxito
        alert('✅ PDF generado correctamente y descargado!');
    }).catch((error) => {
        console.error('Error al generar PDF:', error);
        alert('❌ Error al generar el PDF. Por favor, inténtalo de nuevo.');
        btnExport.textContent = textoOriginal;
        btnExport.disabled = false;
    });
}

// Event listener para el botón de exportar
document.getElementById('btnExportPDF').addEventListener('click', exportarAPDF);

// ============ MODIFICAR FUNCIÓN CALCULAR NÓMINA ============
// Necesitamos guardar los datos para usarlos en cálculos anuales y PDF

// Guardar la función original
const calcularNominaOriginal = calcularNomina;

// Redefinir calcularNomina para guardar los datos
function calcularNomina() {
    // Obtener valores de entrada
    const salarioBruto = parseFloat(document.getElementById('salarioBruto').value) || 0;
    const irpfPct = parseFloat(document.getElementById('irpf').value) || 0;
    const pagas = parseInt(document.getElementById('pagas').value);
    const esTemporal = document.getElementById('contratoTemporal').checked;

    // Seleccionar porcentajes según tipo de contrato
    const desempleoTrabajador = esTemporal ?
        COTIZACIONES.trabajador.desempleoTemporal :
        COTIZACIONES.trabajador.desempleoIndefinido;
    const desempleoEmpresa = esTemporal ?
        COTIZACIONES.empresa.desempleoTemporal :
        COTIZACIONES.empresa.desempleoIndefinido;

    // Actualizar porcentajes mostrados en la UI
    document.getElementById('desempleoTrabajadorPct').textContent = desempleoTrabajador.toFixed(2);
    document.getElementById('desempleoEmpresaPct').textContent = desempleoEmpresa.toFixed(2);

    // ============ CÁLCULOS DEL TRABAJADOR ============

    // Cotizaciones a la Seguridad Social del trabajador
    const ccTrabajador = salarioBruto * COTIZACIONES.trabajador.contingenciasComunes / 100;
    const desempleoTrabajadorImporte = salarioBruto * desempleoTrabajador / 100;
    const fpTrabajador = salarioBruto * COTIZACIONES.trabajador.formacion / 100;
    const totalSSTrabajador = ccTrabajador + desempleoTrabajadorImporte + fpTrabajador;

    // Retención IRPF
    const retencionIRPF = salarioBruto * irpfPct / 100;

    // Total descuentos y salario neto
    const totalDescuentos = totalSSTrabajador + retencionIRPF;
    const salarioNeto = salarioBruto - totalDescuentos;

    // ============ CÁLCULOS DE LA EMPRESA ============

    // Cotizaciones a la Seguridad Social de la empresa
    const ccEmpresa = salarioBruto * COTIZACIONES.empresa.contingenciasComunes / 100;
    const desempleoEmpresaImporte = salarioBruto * desempleoEmpresa / 100;
    const fogasa = salarioBruto * COTIZACIONES.empresa.fogasa / 100;
    const fpEmpresa = salarioBruto * COTIZACIONES.empresa.formacion / 100;
    const totalSSEmpresa = ccEmpresa + desempleoEmpresaImporte + fogasa + fpEmpresa;

    // Coste total para la empresa
    const costeTotal = salarioBruto + totalSSEmpresa;

    // GUARDAR DATOS PARA USAR EN CÁLCULOS ANUALES Y PDF
    datosNominaMensual = {
        salarioBruto,
        salarioNeto,
        totalSSTrabajador,
        totalSSEmpresa,
        retencionIRPF,
        totalDescuentos,
        costeTotal
    };

    // ============ ACTUALIZAR INTERFAZ ============

    // Resumen visual
    document.getElementById('costeEmpresa').textContent = formatCurrency(costeTotal);
    document.getElementById('salarioBrutoDisplay').textContent = formatCurrency(salarioBruto);
    document.getElementById('salarioNeto').textContent = formatCurrency(salarioNeto);
    document.getElementById('diferenciaCosteBruto').textContent = formatCurrency(totalSSEmpresa);
    document.getElementById('totalDescuentos').textContent = formatCurrency(totalDescuentos);

    // Desglose del trabajador
    document.getElementById('ccTrabajador').textContent = formatCurrency(ccTrabajador);
    document.getElementById('desempleoTrabajador').textContent = formatCurrency(desempleoTrabajadorImporte);
    document.getElementById('fpTrabajador').textContent = formatCurrency(fpTrabajador);
    document.getElementById('totalSSTrabajador').textContent = formatCurrency(totalSSTrabajador);
    document.getElementById('retencionIRPF').textContent = formatCurrency(retencionIRPF);
    document.getElementById('totalDescuentosTrabajador').textContent = formatCurrency(totalDescuentos);

    // Desglose de la empresa
    document.getElementById('ccEmpresa').textContent = formatCurrency(ccEmpresa);
    document.getElementById('desempleoEmpresa').textContent = formatCurrency(desempleoEmpresaImporte);
    document.getElementById('fogasa').textContent = formatCurrency(fogasa);
    document.getElementById('fpEmpresa').textContent = formatCurrency(fpEmpresa);
    document.getElementById('totalSSEmpresa').textContent = formatCurrency(totalSSEmpresa);

    // ============ SECCIÓN EDUCATIVA ============

    // Calcular porcentajes sobre el coste total
    const pctSSEmpresa = (totalSSEmpresa / costeTotal) * 100;
    const pctSSTrabajador = (totalSSTrabajador / costeTotal) * 100;
    const pctIRPF = (retencionIRPF / costeTotal) * 100;
    const pctNeto = (salarioNeto / costeTotal) * 100;

    // Actualizar la barra visual
    document.getElementById('barEmpresaExtra').style.width = pctSSEmpresa + '%';
    document.getElementById('barTrabajadorSS').style.width = pctSSTrabajador + '%';
    document.getElementById('barIRPF').style.width = pctIRPF + '%';
    document.getElementById('barNeto').style.width = pctNeto + '%';

    // Actualizar textos de porcentajes
    document.getElementById('pctSSEmpresa').textContent = formatPercentage(pctSSEmpresa);
    document.getElementById('pctSSTrabajador').textContent = formatPercentage(pctSSTrabajador);
    document.getElementById('pctIRPF').textContent = formatPercentage(pctIRPF);
    document.getElementById('pctNeto').textContent = formatPercentage(pctNeto);

    // ============ DATOS CLAVE ============

    // Ratio: Por cada euro que recibes, la empresa paga...
    const ratioCosteNeto = salarioNeto > 0 ? costeTotal / salarioNeto : 0;
    document.getElementById('ratioCosteNeto').textContent = ratioCosteNeto.toFixed(2) + '€';

    // Porcentaje que recibes del coste total
    const pctRecibes = pctNeto;
    document.getElementById('pctRecibes').textContent = formatPercentage(pctRecibes);

    // Total que va a Seguridad Social (empresa + trabajador)
    const totalSS = totalSSEmpresa + totalSSTrabajador;
    document.getElementById('dineroSS').textContent = formatCurrency(totalSS);

    // ============ OCULTAR LABELS EN BARRAS PEQUEÑAS ============
    // Si un segmento es muy pequeño, ocultar su label
    const labels = document.querySelectorAll('.bar-label');
    const segments = document.querySelectorAll('.bar-segment');

    segments.forEach((segment, index) => {
        const width = parseFloat(segment.style.width);
        const label = segment.querySelector('.bar-label');
        if (label) {
            // Ocultar label si el segmento es menor al 8%
            if (width < 8) {
                label.style.display = 'none';
            } else {
                label.style.display = 'flex';
            }
        }
    });

    // Si estamos en vista anual, actualizar también esos datos
    if (!vistaMensual) {
        calcularAnual();
    }
}
