# Higgs Boson Discovery & Statistical Significance Simulator 🔬

An interactive full-stack simulator of the 2012 Higgs Boson discovery at the LHC. This project bridges particle physics research with modern software engineering.

## 🌟 Key Features
* **Monte Carlo Data Synthesis:** Simulating 180,000+ stochastic event records (Signal vs. Background).
* **Kinematic Filtering:** Interactive $p_T$ (Transverse Momentum) selection to extract the 125 GeV resonance.
* **Statistical Engine:** Real-time calculation of Local Significance ($\sigma$) toward the 5-sigma discovery threshold.

## 🛠️ Technical Stack
* **Backend:** Python (FastAPI, NumPy)
* **Frontend:** React.js (Recharts for data visualization)
* **Database:** SQLite / CSV processing

## 📖 Scientific Framework
The simulator follows the official CERN methodology:
1. **Data Acquisition:** Handling high-volume proton collision noise.
2. **Filtering:** Applying kinematic cuts to reduce Standard Model background.
3. **Validation:** Reaching the 5-Sigma significance—the gold standard for particle physics discovery.