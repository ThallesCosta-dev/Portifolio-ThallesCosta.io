function calcularCenario() {
    const linhas = document.querySelectorAll('#simuladorTable tr:not(:first-child)');
    let faturamentoTotal = 0;
    let custoTotalGeral = 0;
    let lucroTotal = 0;
    
    linhas.forEach(linha => {
        const valorVenda = parseFloat(linha.querySelector('.valor-venda').value) || 0;
        const quantidade = parseFloat(linha.querySelector('.quantidade').value) || 0;
        const custoTotal = parseFloat(linha.querySelector('.custo-total').value) || 0;
        
        const faturamento = valorVenda * quantidade;
        const lucro = faturamento - custoTotal;
        
        linha.querySelector('.faturamento').textContent = faturamento.toFixed(2);
        linha.querySelector('.lucro').textContent = lucro.toFixed(2);
        
        faturamentoTotal += faturamento;
        custoTotalGeral += custoTotal;
        lucroTotal += lucro;
    });
    
    document.getElementById('faturamentoTotal').textContent = faturamentoTotal.toFixed(2);
    document.getElementById('custoTotal').textContent = custoTotalGeral.toFixed(2);
    document.getElementById('lucroTotal').textContent = lucroTotal.toFixed(2);
}

function adicionarLinhaCenario() {
    const tabela = document.getElementById('simuladorTable');
    const novaLinha = document.createElement('tr');
    novaLinha.innerHTML = `
        <td><input type="text" class="item"></td>
        <td><input type="number" class="preco-concorrente"></td>
        <td><input type="number" class="valor-venda"></td>
        <td><input type="number" class="quantidade"></td>
        <td><span class="faturamento">0.00</span></td>
        <td><input type="number" class="custo-total"></td>
        <td><span class="lucro">0.00</span></td>
    `;
    tabela.appendChild(novaLinha);
} 