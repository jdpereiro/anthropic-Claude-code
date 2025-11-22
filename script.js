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
