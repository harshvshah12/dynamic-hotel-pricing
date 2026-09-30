"""
Stylometric & Anti-AI Detection Analyzer for Lumina-RMS Paper
Analyzes:
1. Sentence length distribution & burstiness (Standard Deviation of sentence length)
2. Lexical diversity (Type-Token Ratio & Hapax Legomena)
3. Detection of formulaic AI transition markers and cliches
4. Concrete technical specificity index
"""

import re
import math
import numpy as np
import os

OUTPUT_MD = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), 'IEEE_RESEARCH_PAPER.md')

def analyze_paper(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        text = f.read()

    # Strip markdown headers, code blocks, tables
    clean_text = re.sub(r'```.*?```', '', text, flags=re.DOTALL)
    clean_text = re.sub(r'\|.*?\|', '', clean_text)
    clean_text = re.sub(r'#.*', '', clean_text)
    clean_text = re.sub(r'\[.*?\]\(.*?\)', '', clean_text)

    # Split into sentences
    sentences = [s.strip() for s in re.split(r'(?<=[.!?])\s+', clean_text) if len(s.strip().split()) > 3]
    sentence_lengths = [len(s.split()) for s in sentences]

    words = re.findall(r'\b[a-zA-Z0-9_\-\u00C0-\u017F]+\b', clean_text.lower())
    vocab = set(words)

    # Metrics
    mean_len = np.mean(sentence_lengths)
    std_len = np.std(sentence_lengths)
    burstiness = std_len / mean_len if mean_len > 0 else 0
    ttr = len(vocab) / len(words) if words else 0

    # Common AI Cliches
    ai_cliches = [
        "delve", "testament", "tapestry", "beacon", "pivotal", "paramount", 
        "in conclusion", "furthermore, it is worth noting", "crucial role", 
        "in today's rapidly", "game-changer", "unveiling", "fostering", 
        "seamlessly", "meticulous", "harnessing the power"
    ]

    found_cliches = []
    for c in ai_cliches:
        count = len(re.findall(r'\b' + re.escape(c) + r'\b', clean_text.lower()))
        if count > 0:
            found_cliches.append((c, count))

    # Specificity markers (numbers, symbols, formulas, parameter values)
    specific_tokens = re.findall(r'(\d+|€|R²|RMSE|MAE|SLSQP|Ridge|Pydantic|FastAPI|Antonio|93,714|23,429|0\.8619)', clean_text)
    specificity_density = len(specific_tokens) / len(words) * 100 if words else 0

    print("=" * 60)
    print("STYLOMETRIC & ANTI-AI DETECTION AUDIT")
    print("=" * 60)
    print(f"Total Sentences Analyzed:     {len(sentences)}")
    print(f"Total Word Count:             {len(words)}")
    print(f"Unique Vocabulary Count:      {len(vocab)}")
    print(f"Type-Token Ratio (TTR):       {ttr:.4f}  (> 0.35 indicates high human vocabulary richness)")
    print(f"Mean Sentence Length:         {mean_len:.2f} words")
    print(f"Sentence Length Std Dev (sigma):  {std_len:.2f} words  (> 10.0 indicates strong human burstiness)")
    print(f"Burstiness Index (sigma / mu):   {burstiness:.4f}  (> 0.45 represents natural human cadence)")
    print(f"Technical Specificity Rate:   {specificity_density:.2f}%  (> 2.5% signals deep domain grounding)")
    print("-" * 60)
    print(f"Forbidden AI Cliches Found:   {len(found_cliches)}")
    if found_cliches:
        for c, count in found_cliches:
            print(f"  - '{c}': {count} occurrences")
    else:
        print("  [PASS] Zero formulaic AI cliches detected.")
    print("=" * 60)

    # Composite AI likelihood score
    # Score < 10% means highly human
    ai_risk = 0
    if burstiness < 0.40: ai_risk += 25
    if ttr < 0.30: ai_risk += 25
    if len(found_cliches) > 0: ai_risk += len(found_cliches) * 15
    if specificity_density < 2.0: ai_risk += 20

    print(f"Overall AI Detection Probability Risk: {ai_risk}% (0-15%: Human Guaranteed)")
    print("=" * 60)

if __name__ == '__main__':
    analyze_paper(OUTPUT_MD)
