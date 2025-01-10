// Inicializar tooltips
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
});

// Typed.js
var typed = new Typed('#typed', {
    strings: ['Calculadora Mercado Livre'],
    typeSpeed: 100,
    backSpeed: 50,
    loop: false,
    showCursor: true,
    cursorChar: '|',
    autoInsertCss: true,
    onComplete: (self) => {
        setTimeout(() => {
            self.cursor.style.display = 'none';
        }, 1500);
    }
});

// Tabela de preços de frete atualizada
const tabelaFrete = {
    'sul_sudeste': {
        '300g': 39.90,
        '500g': 40.90,
        '1kg': 42.90,
        '2kg': 45.90,
        '3kg': 47.90,
        '4kg': 49.90,
        '5kg': 51.90,
        '9kg': 83.90,
        '13kg': 131.90,
        '17kg': 146.90,
        '23kg': 171.90,
        '30kg': 197.90
    },
    'outros': {
        '300g': 62.90,
        '500g': 64.90,
        '1kg': 68.90,
        '2kg': 83.90,
        '3kg': 106.40,
        '4kg': 109.60,
        '5kg': 112.70,
        '9kg': 130.50,
        '13kg': 189.80,
        '17kg': 250.10,
        '23kg': 281.10,
        '30kg': 293.40
    }
};

// Mostrar/ocultar campo de comissão personalizada
document.getElementById('tipoPlano').addEventListener('change', function() {
    const comissaoDiv = document.getElementById('comissaoPersonalizada');
    const comissaoInput = document.getElementById('comissaoML');
    
    if (this.value === 'personalizado') {
        comissaoDiv.style.display = 'block';
    } else {
        comissaoDiv.style.display = 'none';
        switch(this.value) {
            case 'classico':
                comissaoInput.value = 13;
                break;
            case 'premium':
                comissaoInput.value = 16;
                break;
            case 'full':
                comissaoInput.value = 20;
                break;
        }
    }
});

// Atualizar opções de envio quando pagador do frete mudar
document.getElementById('pagadorFrete').addEventListener('change', function() {
    const opcoesEnvio = document.getElementById('opcoesEnvio');
    const alertaFrete = document.getElementById('alertaFrete');
    
    if (this.value === 'vendedor') {
        opcoesEnvio.style.display = 'block';
        const precoVenda = parseFloat(document.getElementById('precoVenda').value) || 0;
        alertaFrete.style.display = precoVenda < 79 ? 'block' : 'none';
    } else {
        opcoesEnvio.style.display = 'none';
        alertaFrete.style.display = 'none';
    }
});

// Cálculos
document.getElementById('mlCalculator').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const precoVenda = parseFloat(document.getElementById('precoVenda').value) || 0;
    const precoCusto = parseFloat(document.getElementById('precoCusto').value) || 0;
    const custosOp = parseFloat(document.getElementById('custosOp').value) || 0;
    const comissaoML = parseFloat(document.getElementById('comissaoML').value) || 13;
    const impostoPercent = parseFloat(document.getElementById('impostoPercent').value) || 0;
    const regiaoEnvio = document.getElementById('regiaoEnvio').value;
    const pesoProduto = document.getElementById('pesoProduto').value;
    const reputacao = document.getElementById('reputacao').value;
    const tipoEnvio = document.getElementById('tipoEnvio').value;
    const pagadorFrete = document.getElementById('pagadorFrete').value;

    // Validar preço mínimo
    if (precoVenda < 8) {
        alert("O preço mínimo de venda deve ser R$ 8,00");
        return;
    }

    // Calcular custo fixo baseado no preço
    let custoFixo = 0;
    if (precoVenda < 79) {
        if (precoVenda <= 29) custoFixo = 6.25;
        else if (precoVenda <= 50) custoFixo = 6.50;
        else custoFixo = 6.75;
    }

    // Calcular comissão ML
    const valorComissao = (precoVenda * comissaoML) / 100;

    // Calcular custo de envio
    let custoEnvio = 0;
    if (pagadorFrete === 'vendedor') {
        // Pegar valor base do frete
        const valorBaseFrete = tabelaFrete[regiaoEnvio][pesoProduto];

        // Aplicar desconto baseado na reputação
        let descontoReputacao = 0;
        if (precoVenda >= 79) {
            switch(reputacao) {
                case 'verde':
                    descontoReputacao = 0.50; // 50% desconto
                    break;
                case 'amarela':
                    descontoReputacao = 0.40; // 40% desconto
                    break;
                case 'vermelha':
                    descontoReputacao = 0; // sem desconto
                    break;
            }
        }

        custoEnvio = valorBaseFrete * (1 - descontoReputacao);

        // Se preço < R$79, vendedor paga 50% do frete
        if (precoVenda < 79) {
            custoEnvio = custoEnvio * 0.5;
        }

        // Ajuste para Full
        if (tipoEnvio === 'full') {
            custoEnvio = custoEnvio * 0.8; // 20% mais barato no Full
        }
    }

    // Calcular imposto
    const valorImposto = (precoVenda * impostoPercent) / 100;

    // Calcular custos totais (incluindo imposto)
    const custoTotal = valorComissao + custoFixo + precoCusto + custosOp + custoEnvio + valorImposto;

    // Calcular resultados
    const receitaLiquida = precoVenda - valorComissao - custoFixo - custoEnvio - valorImposto;
    const lucro = receitaLiquida - precoCusto - custosOp;
    const margemLucro = (lucro / precoVenda) * 100;

    // Atualizar resultados
    document.getElementById('valorComissao').textContent = valorComissao.toFixed(2);
    document.getElementById('custoFixo').textContent = custoFixo.toFixed(2);
    document.getElementById('custoEnvio').textContent = custoEnvio.toFixed(2);
    document.getElementById('valorImposto').textContent = valorImposto.toFixed(2);
    document.getElementById('custoTotal').textContent = custoTotal.toFixed(2);
    document.getElementById('receitaLiquida').textContent = receitaLiquida.toFixed(2);
    document.getElementById('lucro').textContent = lucro.toFixed(2);
    document.getElementById('margemLucro').textContent = margemLucro.toFixed(2);

    // Debug
    console.log({
        valorBaseFrete: tabelaFrete[regiaoEnvio][pesoProduto],
        descontoReputacao,
        custoEnvio,
        precoVenda,
        custoTotal
    });
});

// Atualizar alerta de frete quando preço de venda mudar
document.getElementById('precoVenda').addEventListener('input', function() {
    const pagadorFrete = document.getElementById('pagadorFrete').value;
    const alertaFrete = document.getElementById('alertaFrete');
    
    if (pagadorFrete === 'vendedor') {
        const precoVenda = parseFloat(this.value) || 0;
        alertaFrete.style.display = precoVenda < 79 ? 'block' : 'none';
    }
});

// Eventos para campos da calculadora reversa
document.getElementById('tipoPlanoReverso').addEventListener('change', function() {
    const comissaoDiv = document.getElementById('comissaoPersonalizadaReverso');
    const comissaoInput = document.getElementById('comissaoMLReverso');
    
    if (this.value === 'personalizado') {
        comissaoDiv.style.display = 'block';
    } else {
        comissaoDiv.style.display = 'none';
        switch(this.value) {
            case 'classico':
                comissaoInput.value = 13;
                break;
            case 'premium':
                comissaoInput.value = 16;
                break;
            case 'full':
                comissaoInput.value = 20;
                break;
        }
    }
});

document.getElementById('pagadorFreteReverso').addEventListener('change', function() {
    const opcoesEnvio = document.getElementById('opcoesEnvioReverso');
    if (this.value === 'vendedor') {
        opcoesEnvio.style.display = 'block';
    } else {
        opcoesEnvio.style.display = 'none';
    }
});

// Função para calcular custo fixo
function calcularCustoFixo(precoVenda) {
    if (precoVenda < 79) {
        if (precoVenda <= 29) return 6.25;
        if (precoVenda <= 50) return 6.50;
        return 6.75;
    }
    return 0;
}

// Atualizar função de cálculo reverso
function calcularPrecoVendaReverso(dados) {
    const {
        precoCusto,
        margemDesejada,
        custosOp,
        comissaoML,
        impostoPercent,
        pagadorFrete,
        regiaoEnvio,
        pesoProduto,
        reputacao,
        tipoEnvio
    } = dados;

    // Calcular custo de envio
    let custoEnvio = calcularCustoEnvio(dados);

    // Função para calcular todos os custos e lucro para um dado preço de venda
    function calcularCustosELucro(precoVenda) {
        const custoFixo = calcularCustoFixo(precoVenda);
        const comissao = (precoVenda * comissaoML) / 100;
        const imposto = (precoVenda * impostoPercent) / 100;
        const custoTotal = precoCusto + custosOp + comissao + custoEnvio + imposto + custoFixo;
        const lucro = precoVenda - custoTotal;
        const margemAtual = (lucro / precoVenda) * 100;
        
        return {
            custoFixo,
            comissao,
            imposto,
            custoTotal,
            lucro,
            margemAtual
        };
    }

    // Calcular preço de venda inicial
    const custoBase = precoCusto + custosOp;
    let precoVenda = (custoBase + custoEnvio) / (1 - ((comissaoML + margemDesejada + impostoPercent)/100));
    
    // Ajuste iterativo para considerar o custo fixo
    let iteracoes = 0;
    let resultados = calcularCustosELucro(precoVenda);
    
    while (Math.abs(resultados.margemAtual - margemDesejada) > 0.1 && iteracoes < 10) {
        // Ajustar preço de venda baseado na diferença de margem
        const ajuste = (margemDesejada - resultados.margemAtual) / 100;
        precoVenda = precoVenda * (1 + ajuste);
        resultados = calcularCustosELucro(precoVenda);
        iteracoes++;
    }

    // Garantir preço mínimo
    precoVenda = Math.max(precoVenda, 8);
    resultados = calcularCustosELucro(precoVenda);

    return {
        precoVenda: precoVenda,
        comissao: resultados.comissao,
        custoFixo: resultados.custoFixo,
        custoEnvio: custoEnvio,
        imposto: resultados.imposto,
        custoTotal: resultados.custoTotal,
        lucro: resultados.lucro,
        margemFinal: resultados.margemAtual
    };
}

// Atualizar o event listener do form reverso
document.getElementById('mlCalculatorReverso').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const dados = {
        precoCusto: parseFloat(document.getElementById('precoCustoReverso').value) || 0,
        margemDesejada: parseFloat(document.getElementById('margemLucroDesejada').value) || 0,
        custosOp: parseFloat(document.getElementById('custosOpReverso').value) || 0,
        comissaoML: parseFloat(document.getElementById('comissaoMLReverso').value) || 13,
        impostoPercent: parseFloat(document.getElementById('impostoPercentReverso').value) || 0,
        pagadorFrete: document.getElementById('pagadorFreteReverso').value,
        regiaoEnvio: document.getElementById('regiaoEnvioReverso').value,
        pesoProduto: document.getElementById('pesoProdutoReverso').value,
        reputacao: document.getElementById('reputacaoReverso').value,
        tipoEnvio: document.getElementById('tipoEnvioReverso').value
    };
    
    const resultado = calcularPrecoVendaReverso(dados);
    
    // Atualizar resultados na tela
    document.getElementById('precoVendaSugerido').textContent = resultado.precoVenda.toFixed(2);
    document.getElementById('valorComissaoReverso').textContent = resultado.comissao.toFixed(2);
    document.getElementById('custoFixoReverso').textContent = resultado.custoFixo.toFixed(2);
    document.getElementById('custoEnvioReverso').textContent = resultado.custoEnvio.toFixed(2);
    document.getElementById('valorImpostoReverso').textContent = resultado.imposto.toFixed(2);
    document.getElementById('custoTotalReverso').textContent = resultado.custoTotal.toFixed(2);
    document.getElementById('lucroEstimado').textContent = resultado.lucro.toFixed(2);
    document.getElementById('margemFinalReverso').textContent = resultado.margemFinal.toFixed(2);
});
