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

    // Calcular custos totais
    const custoTotal = valorComissao + custoFixo + precoCusto + custosOp + custoEnvio;

    // Calcular resultados
    const receitaLiquida = precoVenda - valorComissao - custoFixo - custoEnvio;
    const lucro = receitaLiquida - precoCusto - custosOp;
    const margemLucro = (lucro / precoVenda) * 100;

    // Atualizar resultados
    document.getElementById('valorComissao').textContent = valorComissao.toFixed(2);
    document.getElementById('custoFixo').textContent = custoFixo.toFixed(2);
    document.getElementById('custoEnvio').textContent = custoEnvio.toFixed(2);
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
