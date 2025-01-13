document.addEventListener('DOMContentLoaded', function() {
    // Inicialização do Typed.js
    new Typed('#typed', {
        strings: ['Calculadora SHEIN'],
        typeSpeed: 50,
        backSpeed: 50,
        loop: false
    });

    // Inicialização dos tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    });

    // Função principal de cálculo
    function calcularResultados() {
        const precoVenda = parseFloat(document.getElementById('precoVenda').value) || 0;
        const precoCusto = parseFloat(document.getElementById('precoCusto').value) || 0;
        const custosOp = parseFloat(document.getElementById('custosOp').value) || 0;
        const impostoPercent = parseFloat(document.getElementById('impostoPercent').value) || 0;
        const periodo = document.getElementById('periodo').value;

        // Taxa de comissão baseada no período
        const taxaComissao = periodo === 'novo' ? 0 : 0.16;

        // Cálculos
        const valorComissao = precoVenda * taxaComissao;
        const valorImposto = precoVenda * (impostoPercent / 100);
        const custoTotal = precoCusto + custosOp;
        const receitaLiquida = precoVenda - valorComissao - valorImposto;
        const lucro = receitaLiquida - custoTotal;
        const margemLucro = (lucro / precoVenda) * 100;

        // Atualização dos resultados
        document.getElementById('valorComissao').textContent = valorComissao.toFixed(2);
        document.getElementById('custoTotal').textContent = custoTotal.toFixed(2);
        document.getElementById('valorImposto').textContent = valorImposto.toFixed(2);
        document.getElementById('receitaLiquida').textContent = receitaLiquida.toFixed(2);
        document.getElementById('lucro').textContent = lucro.toFixed(2);
        document.getElementById('margemLucro').textContent = margemLucro.toFixed(2);
    }

    // Event Listeners
    document.getElementById('sheinCalculator').addEventListener('submit', function(e) {
        e.preventDefault();
        calcularResultados();
    });

    // Atualizar cálculos quando qualquer input mudar
    const inputs = document.querySelectorAll('#sheinCalculator input, #sheinCalculator select');
    inputs.forEach(input => {
        input.addEventListener('change', calcularResultados);
    });
}); 