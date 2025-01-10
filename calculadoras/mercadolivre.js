// Tabela de preços de envio por região e peso
const tabelaFretes = {
    sul_sudeste: {
        '300g': 19.90,
        '500g': 21.90,
        '1kg': 24.90,
        '2kg': 29.90,
        '3kg': 34.90,
        '4kg': 39.90,
        '5kg': 44.90
    },
    outros: {
        '300g': 24.90,
        '500g': 27.90,
        '1kg': 31.90,
        '2kg': 37.90,
        '3kg': 43.90,
        '4kg': 49.90,
        '5kg': 55.90
    }
};

// Descontos por reputação
const descontosReputacao = {
    verde: 0.50,      // 50% de desconto
    amarela: 0.40,    // 40% de desconto
    vermelha: 0       // sem desconto
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

// Adicionar evento para monitorar mudanças no preço de venda
document.getElementById('precoVenda').addEventListener('input', function() {
    const precoVenda = parseFloat(this.value) || 0;
    const opcoesEnvio = document.getElementById('opcoesEnvio');
    const alertaFrete = document.getElementById('alertaFrete');
    
    if (precoVenda >= 79) {
        opcoesEnvio.style.display = 'block';
        alertaFrete.style.display = 'none';
    } else if (precoVenda > 0) {
        opcoesEnvio.style.display = 'none';
        alertaFrete.style.display = 'block';
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

    // Calcular custo de envio
    let custoEnvio = 0;
    let custoFreteExibicao = 0;
    
    if (precoVenda >= 79) {
        const reputacao = document.getElementById('reputacao').value;
        const regiaoEnvio = document.getElementById('regiaoEnvio').value;
        const pesoProduto = document.getElementById('pesoProduto').value;
        const tipoEnvio = document.getElementById('tipoEnvio').value;

        if (tipoEnvio !== 'full') {
            const precoBaseFrete = tabelaFretes[regiaoEnvio][pesoProduto];
            const descontoReputacao = descontosReputacao[reputacao];
            custoFreteExibicao = precoBaseFrete * (1 - descontoReputacao);
        }
    } else if (precoVenda > 0) {
        // Frete básico para produtos abaixo de R$79
        custoFreteExibicao = tabelaFretes.sul_sudeste['300g'];
        // Vendedor sempre paga 50% do frete para produtos abaixo de R$79
        if (pagadorFrete === 'vendedor') {
            custoEnvio = custoFreteExibicao;
        } else {
            custoEnvio = custoFreteExibicao * 0.5; // Vendedor paga 50% mesmo quando cliente paga
        }
    }

    // Se vendedor escolheu pagar o frete (para produtos >= R$79)
    if (pagadorFrete === 'vendedor' && precoVenda >= 79) {
        custoEnvio = custoFreteExibicao;
    }

    // Calcular comissão ML
    const valorComissao = (precoVenda * comissaoML) / 100;

    // Calcular custos totais
    const custoTotal = valorComissao + custoFixo + precoCusto + custosOp + custoEnvio;

    // Calcular resultados
    const receitaLiquida = precoVenda - valorComissao - custoFixo - custoEnvio;
    const lucro = receitaLiquida - precoCusto - custosOp;
    const margemLucro = (lucro / precoVenda) * 100;

    // Atualizar resultados
    document.getElementById('valorComissao').textContent = valorComissao.toFixed(2);
    document.getElementById('custoFixo').textContent = custoFixo.toFixed(2);
    
    // Exibir informação do frete
    const custoEnvioElement = document.getElementById('custoEnvio');
    if (pagadorFrete === 'cliente' && precoVenda >= 79) {
        custoEnvioElement.textContent = `0.00 (Cliente paga R$ ${custoFreteExibicao.toFixed(2)})`;
    } else if (precoVenda < 79) {
        custoEnvioElement.textContent = `${custoEnvio.toFixed(2)} (50% do frete)`;
    } else {
        custoEnvioElement.textContent = custoEnvio.toFixed(2);
    }

    document.getElementById('custoTotal').textContent = custoTotal.toFixed(2);
    document.getElementById('receitaLiquida').textContent = receitaLiquida.toFixed(2);
    document.getElementById('lucro').textContent = lucro.toFixed(2);
    document.getElementById('margemLucro').textContent = margemLucro.toFixed(2);
});

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