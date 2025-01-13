document.addEventListener('DOMContentLoaded', function() {
    // Inicializar Typed.js
    new Typed('#typed', {
        strings: ['Calculadora Shopee'],
        typeSpeed: 50,
        backSpeed: 50,
        loop: false
    });

    // Inicializar tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    });

    // Função principal de cálculo
    function calcularValores() {
        const precoVenda = parseFloat(document.getElementById('precoVenda').value) || 0;
        const precoCusto = parseFloat(document.getElementById('precoCusto').value) || 0;
        const custosOp = parseFloat(document.getElementById('custosOp').value) || 0;
        const programaFrete = document.getElementById('programaFrete').value;
        const quantidadeItens = parseInt(document.getElementById('quantidadeItens').value) || 1;
        const taxaPorItem = 4.00;
        const impostoPercent = parseFloat(document.getElementById('impostoPercent').value) || 0;

        // Cálculo da comissão
        let percentualComissao = programaFrete === 'sem_programa' ? 0.14 : 0.20; // 14% ou 14%+6%
        let comissao = precoVenda * percentualComissao;
        
        // Limite máximo de comissão por item (R$100)
        comissao = Math.min(comissao, 100);

        // Cálculo dos resultados
        const totalTaxaItem = taxaPorItem * quantidadeItens;
        const totalTaxas = comissao + totalTaxaItem;
        const valorImposto = precoVenda * (impostoPercent / 100);
        const custoTotal = precoCusto + custosOp;
        const receitaLiquida = precoVenda - totalTaxas - valorImposto;
        const lucro = receitaLiquida - custoTotal;
        const margemLucro = (lucro / precoVenda) * 100;

        // Atualizar resultados na tela
        document.getElementById('valorComissao').textContent = comissao.toFixed(2);
        document.getElementById('valorTaxaItem').textContent = totalTaxaItem.toFixed(2);
        document.getElementById('totalTaxas').textContent = totalTaxas.toFixed(2);
        document.getElementById('valorImposto').textContent = valorImposto.toFixed(2);
        document.getElementById('custoTotal').textContent = custoTotal.toFixed(2);
        document.getElementById('receitaLiquida').textContent = receitaLiquida.toFixed(2);
        document.getElementById('lucro').textContent = lucro.toFixed(2);
        document.getElementById('margemLucro').textContent = margemLucro.toFixed(2);
    }

    // Função para cálculo reverso
    function calcularReverso() {
        const precoCusto = parseFloat(document.getElementById('precoCustoReverso').value) || 0;
        const margemDesejada = parseFloat(document.getElementById('margemDesejada').value) || 0;
        const custosOp = parseFloat(document.getElementById('custosOpReverso').value) || 0;
        const programaFrete = document.getElementById('programaFreteReverso').value;
        const taxaPorItem = 4.00;
        const impostoPercent = parseFloat(document.getElementById('impostoPercentReverso').value) || 0;

        // Percentual de comissão baseado no programa de frete
        const percentualComissao = programaFrete === 'sem_programa' ? 0.14 : 0.20;
        const percentualImposto = impostoPercent / 100;

        // Cálculo do preço de venda necessário
        const custoTotal = precoCusto + custosOp + taxaPorItem;
        const margemDecimal = margemDesejada / 100;
        
        // Fórmula ajustada para incluir imposto
        const precoVenda = custoTotal / (1 - percentualComissao - margemDecimal - percentualImposto);
        
        // Cálculo da comissão (limitada a R$100)
        const comissao = Math.min(precoVenda * percentualComissao, 100);
        
        // Cálculo do imposto e lucro estimado
        const impostoEstimado = precoVenda * percentualImposto;
        const lucroEstimado = precoVenda * margemDecimal;

        // Atualizar resultados na tela
        document.getElementById('precoVendaSugerido').textContent = precoVenda.toFixed(2);
        document.getElementById('comissaoEstimada').textContent = comissao.toFixed(2);
        document.getElementById('impostoEstimado').textContent = impostoEstimado.toFixed(2);
        document.getElementById('lucroEstimado').textContent = lucroEstimado.toFixed(2);
    }

    // Event listeners
    document.getElementById('shopeeCalculator').addEventListener('submit', function(e) {
        e.preventDefault();
        calcularValores();
    });

    document.getElementById('shopeeCalculatorReverso').addEventListener('submit', function(e) {
        e.preventDefault();
        calcularReverso();
    });

    // Adicionar listener para o formulário da calculadora de custo
    document.getElementById('shopeeCustoCalculator')?.addEventListener('submit', function(e) {
        e.preventDefault();
        calcularCustoIdeal();
    });

    function calcularCustoIdeal() {
        // Obter valores do formulário
        const precoVenda = parseFloat(document.getElementById('precoVendaCusto').value);
        const margemDesejada = parseFloat(document.getElementById('margemDesejadaCusto').value) / 100;
        const custosOperacionais = parseFloat(document.getElementById('custosOpCusto').value) || 0;
        const impostoPercent = parseFloat(document.getElementById('impostoPercentCusto').value) || 0;
        const programaFrete = document.getElementById('programaFreteCusto').value;

        // Calcular comissão Shopee
        const taxaComissao = programaFrete === 'com_programa' ? 0.20 : 0.14; // 14% ou 20% (14% + 6%)
        const comissao = precoVenda * taxaComissao;

        // Calcular imposto
        const imposto = (precoVenda * (impostoPercent / 100));

        // Calcular taxa fixa por item
        const taxaItem = 4.00;

        // Calcular receita líquida
        const receitaLiquida = precoVenda - comissao - taxaItem - imposto;

        // Calcular custos totais (custos operacionais)
        const custosTotais = custosOperacionais;

        // Calcular lucro desejado baseado na margem
        const lucroDesejado = precoVenda * margemDesejada;

        // Calcular preço de custo máximo
        // Preço de Custo = Receita Líquida - Lucro Desejado - Custos Operacionais
        const precoCustoMaximo = receitaLiquida - lucroDesejado - custosTotais;

        // Atualizar resultados na interface
        document.getElementById('precoCustoMaximo').textContent = precoCustoMaximo.toFixed(2);
        document.getElementById('comissaoCusto').textContent = comissao.toFixed(2);
        document.getElementById('taxaItemCusto').textContent = taxaItem.toFixed(2);
        document.getElementById('lucroProjetado').textContent = lucroDesejado.toFixed(2);
        document.getElementById('impostoEstimadoCusto').textContent = imposto.toFixed(2);

        // Adicionar classes de estilo baseadas no resultado
        const precoCustoElement = document.getElementById('precoCustoMaximo');
        if (precoCustoMaximo <= 0) {
            precoCustoElement.classList.add('text-danger');
            precoCustoElement.classList.remove('text-success');
        } else {
            precoCustoElement.classList.add('text-success');
            precoCustoElement.classList.remove('text-danger');
        }
    }

    // Adicionar validação para todos os campos numéricos da calculadora de custo
    document.querySelectorAll('#shopeeCustoCalculator input[type="number"]').forEach(input => {
        input.addEventListener('input', function() {
            if (this.value < 0) {
                this.value = 0;
            }
        });
    });

    // Atualizar tooltips para a nova calculadora
    document.addEventListener('DOMContentLoaded', function() {
        // ... existing tooltip initialization ...
        
        // Adicionar tooltips para os novos elementos
        const newTooltips = document.querySelectorAll('#calc-custo [data-bs-toggle="tooltip"]');
        newTooltips.forEach(tooltip => {
            new bootstrap.Tooltip(tooltip);
        });
    });
}); 