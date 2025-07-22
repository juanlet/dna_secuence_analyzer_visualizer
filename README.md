# DNA Sequence Analyzer and Visualizer

This is a web-based biotechnology app that allows users to analyze and visualize DNA sequences.

## Features

*   **Paste or upload a DNA sequence in FASTA format:** Users can either paste a raw DNA sequence or a sequence in FASTA format into the text area, or upload a `.fasta`, `.fa`, or `.txt` file.
*   **Automatic validation:** The app automatically validates the sequence to ensure it only contains the characters A, T, C, and G.
*   **DNA to Protein Translation:** The DNA sequence is translated into a protein sequence using the standard codon table.
*   **GC Content Visualization:** The GC content of the sequence is calculated over a sliding window and visualized as a line chart. The window size can be adjusted in the settings panel.
*   **Restriction Enzyme Site Highlighting:** The app highlights common restriction enzyme sites (EcoRI, HindIII, BamHI). The enzyme to highlight can be selected from the settings panel.
*   **Motif Search:** Users can search for a specific motif in the sequence. The motif to search for can be changed in the settings panel.
*   **Codon Usage Table:** A table showing the frequency of each codon in the sequence is displayed.
*   **Reverse Complement:** A button is provided to generate the reverse complement of the sequence.
*   **Export to FASTA:** The analyzed sequence can be exported as a FASTA file.
*   **Dark Mode:** The app has a dark mode with a bioinformatics lab vibe.

## How to Use

1.  Open the `index.html` file in a web browser.
2.  Paste a DNA sequence into the text area or upload a file using the "Choose File" button.
3.  Click the "Analyze" button to perform the analysis.
4.  The results will be displayed in the output area.
5.  Use the settings panel to adjust the analysis parameters.

## Technologies Used

*   HTML
*   CSS
*   JavaScript
*   [Chart.js](https://www.chartjs.org/)
*   [Tweakpane](https://tweakpane.github.io/tweakpane/)
*   [highlight.js](https://highlightjs.org/)
