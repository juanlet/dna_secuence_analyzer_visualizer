document.addEventListener('DOMContentLoaded', () => {
    const sequenceInput = document.getElementById('sequence-input');
    const fileInput = document.getElementById('file-input');
    const analyzeBtn = document.getElementById('analyze-btn');
    const reverseComplementBtn = document.getElementById('reverse-complement-btn');
    const exportFastaBtn = document.getElementById('export-fasta-btn');
    const dnaSequenceCode = document.getElementById('dna-sequence');
    const proteinSequenceCode = document.getElementById('protein-sequence');
    const gcChartCanvas = document.getElementById('gc-chart');
    const codonTableDiv = document.getElementById('codon-table');

    let gcChart = null;

    const codonTable = {
        'TTT': 'F', 'TTC': 'F', 'TTA': 'L', 'TTG': 'L',
        'TCT': 'S', 'TCC': 'S', 'TCA': 'S', 'TCG': 'S',
        'TAT': 'Y', 'TAC': 'Y', 'TAA': '*', 'TAG': '*',
        'TGT': 'C', 'TGC': 'C', 'TGA': '*', 'TGG': 'W',
        'CTT': 'L', 'CTC': 'L', 'CTA': 'L', 'CTG': 'L',
        'CCT': 'P', 'CCC': 'P', 'CCA': 'P', 'CCG': 'P',
        'CAT': 'H', 'CAC': 'H', 'CAA': 'Q', 'CAG': 'Q',
        'CGT': 'R', 'CGC': 'R', 'CGA': 'R', 'CGG': 'R',
        'ATT': 'I', 'ATC': 'I', 'ATA': 'I', 'ATG': 'M',
        'ACT': 'T', 'ACC': 'T', 'ACA': 'T', 'ACG': 'T',
        'AAT': 'N', 'AAC': 'N', 'AAA': 'K', 'AAG': 'K',
        'AGT': 'S', 'AGC': 'S', 'AGA': 'R', 'AGG': 'R',
        'GTT': 'V', 'GTC': 'V', 'GTA': 'V', 'GTG': 'V',
        'GCT': 'A', 'GCC': 'A', 'GCA': 'A', 'GCG': 'A',
        'GAT': 'D', 'GAC': 'D', 'GAA': 'E', 'GAG': 'E',
        'GGT': 'G', 'GGC': 'G', 'GGA': 'G', 'GGG': 'G',
    };

    // Tweakpane setup
    const pane = new Tweakpane.Pane({
        container: document.getElementById('tweakpane-container'),
        title: 'Settings',
    });

    const PARAMS = {
        windowSize: 50,
        motif: 'TATAAT',
        enzyme: 'GAATTC',
    };

    pane.addInput(PARAMS, 'windowSize', { min: 1, max: 200, step: 1, label: 'GC Window Size' });
    pane.addInput(PARAMS, 'motif', { label: 'Motif Search' });
    pane.addInput(PARAMS, 'enzyme', {
        label: 'Restriction Enzyme',
        options: {
            EcoRI: 'GAATTC',
            HindIII: 'AAGCTT',
            BamHI: 'GGATCC',
        },
    });

    // Event Listeners
    analyzeBtn.addEventListener('click', analyze);
    fileInput.addEventListener('change', handleFileSelect);
    reverseComplementBtn.addEventListener('click', reverseComplement);
    exportFastaBtn.addEventListener('click', exportFasta);

    function handleFileSelect(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                sequenceInput.value = e.target.result;
            };
            reader.readAsText(file);
        }
    }

    function analyze() {
        const fastaInput = sequenceInput.value;
        const sequence = parseFasta(fastaInput);

        if (!validateSequence(sequence)) {
            alert('Invalid DNA sequence. It should only contain A, T, C, G.');
            return;
        }

        // DNA Sequence
        let highlightedSequence = highlightMotifs(sequence, PARAMS.motif);
        highlightedSequence = highlightRestrictionSites(highlightedSequence, PARAMS.enzyme);
        dnaSequenceCode.innerHTML = highlightedSequence;
        hljs.highlightElement(dnaSequenceCode);

        // Protein Sequence
        const proteinSequence = translateToProtein(sequence);
        proteinSequenceCode.textContent = proteinSequence;

        // GC Content
        const gcContentData = calculateGcContent(sequence, PARAMS.windowSize);
        renderGcChart(gcContentData);

        // Codon Usage
        const codonUsage = calculateCodonUsage(sequence);
        renderCodonUsageTable(codonUsage);
    }

    function parseFasta(fastaString) {
        if (fastaString.startsWith('>')) {
            return fastaString.split('\n').slice(1).join('').replace(/\s/g, '').toUpperCase();
        }
        return fastaString.replace(/\s/g, '').toUpperCase();
    }

    function validateSequence(sequence) {
        return /^[ATCG]+$/.test(sequence);
    }

    function translateToProtein(sequence) {
        let protein = '';
        for (let i = 0; i < sequence.length; i += 3) {
            const codon = sequence.substring(i, i + 3);
            if (codon.length === 3) {
                protein += codonTable[codon] || '';
            }
        }
        return protein;
    }

    function calculateGcContent(sequence, windowSize) {
        const gcContent = [];
        for (let i = 0; i <= sequence.length - windowSize; i++) {
            const window = sequence.substring(i, i + windowSize);
            const gcCount = (window.match(/[GC]/g) || []).length;
            gcContent.push((gcCount / windowSize) * 100);
        }
        return gcContent;
    }

    function renderGcChart(gcContentData) {
        if (gcChart) {
            gcChart.destroy();
        }
        gcChart = new Chart(gcChartCanvas, {
            type: 'line',
            data: {
                labels: gcContentData.map((_, i) => i + 1),
                datasets: [{
                    label: 'GC Content (%)',
                    data: gcContentData,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    fill: false,
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }

    function calculateCodonUsage(sequence) {
        const codonUsage = {};
        for (let i = 0; i < sequence.length; i += 3) {
            const codon = sequence.substring(i, i + 3);
            if (codon.length === 3) {
                codonUsage[codon] = (codonUsage[codon] || 0) + 1;
            }
        }
        return codonUsage;
    }

    function renderCodonUsageTable(codonUsage) {
        codonTableDiv.innerHTML = '';
        for (const codon in codonUsage) {
            const cell = document.createElement('div');
            cell.className = 'codon-cell';
            cell.textContent = `${codon}: ${codonUsage[codon]}`;
            codonTableDiv.appendChild(cell);
        }
    }

    function highlightMatches(sequence, pattern, className) {
        const regex = new RegExp(pattern, 'g');
        return sequence.replace(regex, `<span class="${className}">${pattern}</span>`);
    }

    function highlightRestrictionSites(sequence, site) {
        return highlightMatches(sequence, site, 'restriction-site');
    }

    function highlightMotifs(sequence, motif) {
        return highlightMatches(sequence, motif, 'motif');
    }


    function reverseComplement() {
        const fastaInput = sequenceInput.value;
        const sequence = parseFasta(fastaInput);
        const complement = { 'A': 'T', 'T': 'A', 'C': 'G', 'G': 'C' };
        const reversedSequence = sequence.split('').reverse().join('');
        const reverseComplementSequence = reversedSequence.split('').map(base => complement[base]).join('');
        sequenceInput.value = `>reverse_complement\n${reverseComplementSequence}`;
    }

    function exportFasta() {
        const sequence = dnaSequenceCode.textContent;
        const fastaContent = `>exported_sequence\n${sequence}`;
        const blob = new Blob([fastaContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sequence.fasta';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
});
