function calcularPrecos() {
    const linhas = document.querySelectorAll('#precoVendaTable tr:not(:first-child)');
    
    linhas.forEach(linha => {
        const custo = parseFloat(linha.querySelector('.custo').value) || 0;
        const custosOp = parseFloat(linha.querySelector('.custos-op').value) || 0;
        const margemPerc = parseFloat(linha.querySelector('.margem-perc').value) || 0;
        
        const margemValor = (custo + custosOp) * (margemPerc / 100);
        const precoFinal = custo + custosOp + margemValor;
        
        linha.querySelector('.margem-valor').textContent = margemValor.toFixed(2);
        linha.querySelector('.preco-final').textContent = precoFinal.toFixed(2);
    });
}

function adicionarLinha() {
    const tabela = document.getElementById('precoVendaTable');
    const novaLinha = document.createElement('tr');
    novaLinha.innerHTML = `
        <td><input type="text" class="nome"></td>
        <td><input type="number" class="custo"></td>
        <td><input type="number" class="custos-op"></td>
        <td><input type="number" class="margem-perc"></td>
        <td><span class="margem-valor">0.00</span></td>
        <td><span class="preco-final">0.00</span></td>
    `;
    tabela.appendChild(novaLinha);
} 