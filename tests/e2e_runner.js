#!/usr/bin/env node
/**
 * ============================================================================
 * ElectronFlow — tests/e2e_runner.js
 * 
 * Ejecutor Maestro de Pruebas E2E en Caja Opaca para ElectronFlow EE 101.
 * Coordina y ejecuta las 4 capas de pruebas (Tiers 1-4) con estadísticas
 * detalladas de aprobación/fallo, desglose por nivel y códigos de salida.
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');

// Importamos las 4 suites de pruebas
const { runTier1Tests } = require('./tier1_feature_coverage');
const { runTier2Tests } = require('./tier2_boundary_corner');
const { runTier3Tests } = require('./tier3_cross_feature');
const { runTier4Tests } = require('./tier4_student_workloads');

// Códigos de escape ANSI para formato en terminal
const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bgGreen: '\x1b[42m',
  bgRed: '\x1b[41m'
};

/**
 * Función principal del ejecutor de pruebas
 */
function main() {
  const args = process.argv.slice(2);
  const isVerbose = args.includes('--verbose') || args.includes('-v');
  const isJson = args.includes('--json');
  const isMarkdown = args.includes('--markdown');
  const bailOnFail = args.includes('--bail');

  // Filtro opcional por nivel específico
  const tierArg = args.find(a => a.startsWith('--tier='));
  const selectedTier = tierArg ? parseInt(tierArg.split('=')[1], 10) : null;

  const startTime = Date.now();

  const allTiers = [
    { id: 1, name: 'Tier 1: Feature Coverage (≥5 tests per feature across 10 features)', runner: runTier1Tests, minExpected: 50 },
    { id: 2, name: 'Tier 2: Boundary & Corner Cases (Numerical limits, extremes, zeros, saturation)', runner: runTier2Tests, minExpected: 50 },
    { id: 3, name: 'Tier 3: Cross-Feature Interactions (Step transitions, live KaTeX, slider sync)', runner: runTier3Tests, minExpected: 10 },
    { id: 4, name: 'Tier 4: Real-World Student Workloads (End-to-end paths Phases 1 through 8)', runner: runTier4Tests, minExpected: 6 }
  ];

  const tiersToRun = selectedTier ? allTiers.filter(t => t.id === selectedTier) : allTiers;

  if (!isJson && !isMarkdown) {
    console.log(`\n${COLORS.cyan}${COLORS.bright}========================================================================${COLORS.reset}`);
    console.log(`${COLORS.cyan}${COLORS.bright}        ⚡ ElectronFlow EE 101 — Master E2E Test Runner ⚡              ${COLORS.reset}`);
    console.log(`${COLORS.cyan}${COLORS.bright}========================================================================${COLORS.reset}\n`);
    console.log(`${COLORS.dim}Modo de ejecución: Caja opaca (Opaque-Box) | Entorno: Standalone DOM Sandbox${COLORS.reset}`);
    console.log(`${COLORS.dim}Fecha y hora: ${new Date().toISOString()} | Node.js: ${process.version}${COLORS.reset}\n`);
  }

  const executionReport = {
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    totalTiers: tiersToRun.length,
    tiers: [],
    summary: {
      totalTests: 0,
      totalPassed: 0,
      totalFailed: 0,
      passRate: '0.0%',
      durationMs: 0,
      success: false
    }
  };

  let hasAnyFailure = false;

  for (const tier of tiersToRun) {
    if (!isJson && !isMarkdown) {
      console.log(`${COLORS.bright}▶ Ejecutando ${tier.name}...${COLORS.reset}`);
    }

    const tierStartTime = Date.now();
    const tierResults = tier.runner();
    const tierDuration = Date.now() - tierStartTime;

    const passedCount = tierResults.filter(r => r.passed).length;
    const failedCount = tierResults.filter(r => !r.passed).length;
    const totalCount = tierResults.length;
    const tierSuccess = failedCount === 0 && totalCount >= tier.minExpected;

    if (failedCount > 0) {
      hasAnyFailure = true;
    }

    const tierData = {
      tierId: tier.id,
      name: tier.name,
      total: totalCount,
      passed: passedCount,
      failed: failedCount,
      minExpected: tier.minExpected,
      durationMs: tierDuration,
      passedThreshold: totalCount >= tier.minExpected,
      success: tierSuccess,
      tests: tierResults
    };

    executionReport.tiers.push(tierData);
    executionReport.summary.totalTests += totalCount;
    executionReport.summary.totalPassed += passedCount;
    executionReport.summary.totalFailed += failedCount;

    if (!isJson && !isMarkdown) {
      // Impresión de resultados individuales si verbose o si hubo fallos
      if (isVerbose || failedCount > 0) {
        tierResults.forEach(r => {
          if (r.passed) {
            if (isVerbose) {
              console.log(`  ${COLORS.green}✓${COLORS.reset} ${r.name} ${COLORS.dim}(${r.duration}ms)${COLORS.reset}`);
            }
          } else {
            console.log(`  ${COLORS.red}✗ ${r.name}${COLORS.reset}`);
            console.log(`    ${COLORS.red}Error: ${r.error}${COLORS.reset}`);
          }
        });
      }

      const statusTag = tierSuccess
        ? `${COLORS.green}[PASÓ: ${passedCount}/${totalCount}]${COLORS.reset}`
        : `${COLORS.red}[FALLÓ: ${passedCount}/${totalCount}]${COLORS.reset}`;

      console.log(`  ${statusTag} Duración: ${tierDuration}ms | Umbral mínimo (>=${tier.minExpected}): ${totalCount >= tier.minExpected ? 'CUMPLIDO' : 'INCUMPLIDO'}\n`);
    }

    if (bailOnFail && failedCount > 0) {
      if (!isJson && !isMarkdown) {
        console.log(`${COLORS.red}⛔ Detención temprana activada por bandera --bail.${COLORS.reset}`);
      }
      break;
    }
  }

  const totalDuration = Date.now() - startTime;
  const passRateNum = executionReport.summary.totalTests > 0
    ? (executionReport.summary.totalPassed / executionReport.summary.totalTests) * 100
    : 0;

  const minRequiredTotal = selectedTier ? tiersToRun.reduce((acc, t) => acc + t.minExpected, 0) : 116;

  executionReport.summary.durationMs = totalDuration;
  executionReport.summary.passRate = `${passRateNum.toFixed(1)}%`;
  executionReport.summary.success = !hasAnyFailure && executionReport.summary.totalTests >= minRequiredTotal;

  // Salida en formato JSON si se solicita
  if (isJson) {
    console.log(JSON.stringify(executionReport, null, 2));
    process.exit(executionReport.summary.success ? 0 : 1);
  }

  // Salida en formato Markdown si se solicita
  if (isMarkdown) {
    console.log(`# Reporte de Ejecución E2E — ElectronFlow EE 101\n`);
    console.log(`- **Fecha**: ${executionReport.timestamp}`);
    console.log(`- **Total Pruebas**: ${executionReport.summary.totalTests}`);
    console.log(`- **Aprobadas**: ${executionReport.summary.totalPassed}`);
    console.log(`- **Fallidas**: ${executionReport.summary.totalFailed}`);
    console.log(`- **Tasa de Éxito**: ${executionReport.summary.passRate}`);
    console.log(`- **Duración**: ${executionReport.summary.durationMs}ms\n`);
    console.log(`| Nivel (Tier) | Total | Aprobadas | Fallidas | Umbral Mínimo | Estado |`);
    console.log(`|---|:---:|:---:|:---:|:---:|:---:|`);
    executionReport.tiers.forEach(t => {
      console.log(`| **Tier ${t.tierId}**: ${t.name.split(':')[1] || t.name} | ${t.total} | ${t.passed} | ${t.failed} | ≥${t.minExpected} | ${t.success ? '✅ PASS' : '❌ FAIL'} |`);
    });
    process.exit(executionReport.summary.success ? 0 : 1);
  }

  // Resumen visual en terminal
  console.log(`${COLORS.cyan}------------------------------------------------------------------------${COLORS.reset}`);
  console.log(`${COLORS.bright}RESUMEN ESTADÍSTICO DE EJECUCIÓN:${COLORS.reset}`);
  console.log(`${COLORS.cyan}------------------------------------------------------------------------${COLORS.reset}`);

  executionReport.tiers.forEach(t => {
    const tierSymbol = t.success ? `${COLORS.green}✔${COLORS.reset}` : `${COLORS.red}✖${COLORS.reset}`;
    console.log(` ${tierSymbol} ${COLORS.bright}Tier ${t.tierId}${COLORS.reset}: ${t.passed}/${t.total} pruebas aprobadas (mínimo exigido: ≥${t.minExpected}) — ${t.durationMs}ms`);
  });

  console.log(`${COLORS.cyan}------------------------------------------------------------------------${COLORS.reset}`);
  console.log(` Total de Pruebas Ejecutadas: ${COLORS.bright}${executionReport.summary.totalTests}${COLORS.reset} (Requisito mínimo: ≥${minRequiredTotal})`);
  console.log(` Pruebas Aprobadas:          ${COLORS.green}${COLORS.bright}${executionReport.summary.totalPassed}${COLORS.reset}`);
  console.log(` Pruebas Fallidas:           ${executionReport.summary.totalFailed > 0 ? COLORS.red : COLORS.green}${COLORS.bright}${executionReport.summary.totalFailed}${COLORS.reset}`);
  console.log(` Tasa de Éxito:              ${executionReport.summary.success ? COLORS.green : COLORS.red}${COLORS.bright}${executionReport.summary.passRate}${COLORS.reset}`);
  console.log(` Tiempo Total de Ejecución:  ${COLORS.cyan}${executionReport.summary.durationMs} ms${COLORS.reset}`);
  console.log(`${COLORS.cyan}------------------------------------------------------------------------${COLORS.reset}`);

  if (executionReport.summary.success) {
    console.log(`\n${COLORS.bgGreen}${COLORS.white}${COLORS.bright}  ✨ TODAS LAS PRUEBAS E2E (TIERS 1-4) FUERON APROBADAS EXITOSAMENTE (100.0%) ✨  ${COLORS.reset}\n`);
    process.exit(0);
  } else {
    console.log(`\n${COLORS.bgRed}${COLORS.white}${COLORS.bright}  ❌ SE DETECTARON FALLOS EN LA SUITE DE PRUEBAS E2E. REVISAR DETALLES ARRIBA.  ${COLORS.reset}\n`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };
