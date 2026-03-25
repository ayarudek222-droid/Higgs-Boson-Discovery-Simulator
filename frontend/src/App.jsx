import { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts'
import confetti from 'canvas-confetti'

function App() {
  const [rawData, setRawData] = useState([]);
  const [threshold, setThreshold] = useState(15);
  const [loading, setLoading] = useState(true);
  const [discoveryMode, setDiscoveryMode] = useState(false);
  const [showAcademicGuide, setShowAcademicGuide] = useState(false);
  const [hasCelebrated, setHasCelebrated] = useState(false);

  useEffect(() => {
    // משיכת נתונים מהסימולציה
    axios.get('http://localhost:8000/all-data?limit=180000')
      .then(res => {
        setRawData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Data retrieval failed", err);
        setLoading(false);
      });
  }, []);

  const chartData = useMemo(() => {
    const bins = Array.from({ length: 31 }, (_, i) => ({ 
      mass: 110 + i, signal: 0, background: 0, total: 0 
    }));

    rawData.forEach(ev => {
      if (Number(ev.pt) < Number(threshold)) return;
      const idx = Math.round(ev.mass - 110);
      if (idx >= 0 && idx < bins.length) {
        if (ev.is_signal) bins[idx].signal += 1;
        else bins[idx].background += 1;
        bins[idx].total = bins[idx].signal + bins[idx].background;
      }
    });
    return bins;
  }, [rawData, threshold]);

  const stats = useMemo(() => {
    const higgsBin = chartData.find(b => b.mass === 125);
    if (!higgsBin || higgsBin.background < 1) return { sb: "0.000", sigma: "0.00" };
    
    const S = higgsBin.signal;
    const B = higgsBin.background;
    const sigmaVal = S > 0 ? Math.sqrt(2 * ((S + B) * Math.log(1 + S/B) - S)) : 0;
    
    // הפעלת קונפטי בחציית קו ה-5 סיגמא
    if (sigmaVal >= 5 && !hasCelebrated) {
      confetti({
        particleCount: 200,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#38bdf8', '#fbbf24', '#10b981', '#ffffff']
      });
      setHasCelebrated(true);
    } else if (sigmaVal < 5) {
      setHasCelebrated(false);
    }

    return { sb: (S / B).toFixed(3), sigma: sigmaVal.toFixed(2) };
  }, [chartData, hasCelebrated]);

  const totalEventsRemaining = chartData.reduce((sum, b) => sum + b.total, 0);
  const isReliable = totalEventsRemaining > 3000;

  if (loading) return (
    <div style={{color:'white', textAlign:'center', marginTop:'100px', fontSize: '1.5rem', fontFamily: 'Arial'}}>
      Retrieving High Luminosity Monte Carlo Data...
    </div>
  );

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', width: '100vw', backgroundColor: '#020617', margin: 0, color: 'white', fontFamily: 'Arial, sans-serif' }}>
      
      {/* הוספת CSS מותאם אישית לפס הגלילה בתוך ה-Guide */}
      <style>{`
        .academic-text-container::-webkit-scrollbar {
          width: 10px;
        }
        .academic-text-container::-webkit-scrollbar-track {
          background: #0f172a; 
          border-radius: 5px;
        }
        .academic-text-container::-webkit-scrollbar-thumb {
          background: #38bdf8; 
          border-radius: 5px;
        }
        .academic-text-container::-webkit-scrollbar-thumb:hover {
          background: #fbbf24; 
        }
        /* עבור פיירפוקס */
        .academic-text-container {
          scrollbar-width: thin;
          scrollbar-color: #38bdf8 #0f172a;
        }
      `}</style>

      {/* כפתור הדרכה */}
      <button onClick={() => setShowAcademicGuide(true)} style={{ position: 'absolute', top: '30px', right: '30px', width: '50px', height: '50px', borderRadius: '50%', border: '2px solid #38bdf8', backgroundColor: 'transparent', color: '#38bdf8', fontSize: '24px', cursor: 'pointer', fontWeight: 'bold', zIndex: 100 }}>?</button>

      {/* חלון ההסבר המדעי המלא */}
      {showAcademicGuide && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(2, 6, 23, 0.98)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#0f172a', padding: '50px', borderRadius: '35px', maxWidth: '850px', border: '1px solid #38bdf8', textAlign: 'left', direction: 'ltr', boxShadow: '0 0 60px rgba(56, 189, 248, 0.2)' }}>
            <h2 style={{ color: '#38bdf8', fontSize: '1.8rem', marginBottom: '20px', borderBottom: '1px solid #1e293b', paddingBottom: '10px' }}>The Road to Discovery: A Chronological Framework</h2>
            
            {/* תיבת הטקסט עם הגלילה והעיצוב המותאם */}
            <div className="academic-text-container" style={{ 
                lineHeight: '1.8', 
                fontSize: '1.05rem', 
                color: '#cbd5e1', 
                maxHeight: '60vh',    // מגביל את הגובה
                overflowY: 'auto',    // מאפשר גלילה אנכית
                paddingRight: '15px'  // נותן מרווח לפס הגלילה
            }}>
              <p><strong>Step 1: Proton Collisions and Data Acquisition</strong><br />The scientific journey begins with trillions of high energy proton collisions occurring within the Large Hadron Collider. The vast majority of these interactions result in well understood Standard Model processes which create an overwhelming baseline of Background noise. For every single Higgs boson produced, billions of background events clutter the raw data stream, making direct observation impossible.</p>
              
              <p><strong>Step 2: Monte Carlo Simulation and Theoretical Predictions</strong><br />To identify a new particle, researchers must first establish exactly what the data would look like if that particle did not exist. We utilize Monte Carlo methods to simulate billions of virtual collisions based on current theoretical physics. These simulated datasets, stored in our backend, represent our Null Hypothesis. By comparing real experimental outcomes to these theoretical simulations, we can isolate statistical excesses that deviate from the expected noise.</p>
              
              <p><strong>Step 3: Kinematic Filtering and Signal Extraction</strong><br />Because the Higgs boson is exceptionally massive, its decay products possess significantly higher Transverse Momentum (pT) compared to Standard Model noise. We apply a Kinematic Cut to the data, effectively acting as a sieve that removes low energy background particles. As you increase the pT threshold, the signal to background ratio improves drastically, allowing the hidden 125 GeV resonance to finally emerge clearly from the surrounding noise floor.</p>
              
              <p><strong>Step 4: Statistical Validation and the 5 Sigma Threshold</strong><br />After isolating an excess, we calculate its Statistical Significance using the Likelihood Ratio. In particle physics, a discovery is only formally recognized once it reaches the 5 Sigma threshold. This rigorous standard indicates that the probability of the observed result being a statistical fluke is less than 1 in 3.5 million. When this limit is crossed, as indicated by the celebratory dashboard state, a new fundamental particle is officially declared as observed.</p>
            </div>
            
            <button onClick={() => setShowAcademicGuide(false)} style={{ marginTop: '30px', padding: '15px 40px', backgroundColor: '#38bdf8', color: '#020617', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', width: '100%' }}>Return to Data Analysis</button>
          </div>
        </div>
      )}

      {/* מיכל התוכן הראשי */}
      <div style={{ width: '90%', maxWidth: '1000px', height: '90vh', backgroundColor: '#0f172a', borderRadius: '30px', border: '2px solid #1e293b', padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', overflowY: 'auto' }}>
        <h1 style={{ color: '#38bdf8', marginTop: 0 }}>Higgs Discovery Dashboard 🔬</h1>
        
        <div style={{ display: 'flex', gap: '25px', marginBottom: '25px' }}>
          <div style={{ padding: '12px 25px', backgroundColor: '#1e293b', borderRadius: '18px', border: '1px solid #38bdf8', textAlign: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block' }}>Signal to Background Ratio</span>
            <span style={{ fontSize: '1.3rem', color: '#fbbf24', fontWeight: 'bold' }}>{stats.sb}</span>
          </div>
          <div style={{ padding: '12px 25px', backgroundColor: '#1e293b', borderRadius: '18px', border: `1px solid ${Number(stats.sigma) >= 5 ? '#10b981' : '#38bdf8'}`, textAlign: 'center', boxShadow: Number(stats.sigma) >= 5 ? '0 0 25px rgba(16, 185, 129, 0.5)' : 'none' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block' }}>Statistical Significance</span>
            <span style={{ fontSize: '1.3rem', color: Number(stats.sigma) >= 5 ? '#10b981' : '#fbbf24', fontWeight: 'bold' }}>{stats.sigma}σ</span>
          </div>
        </div>

        <div style={{ margin: '0 0 30px 0', width: '100%', maxWidth: '800px', padding: '25px', backgroundColor: '#1e293b', borderRadius: '20px', border: '1px solid #334155' }}>
          <h3 style={{marginTop:0}}>pT Selection Cut: <span style={{ color: '#fbbf24' }}>{threshold} GeV</span></h3>
          <input type="range" min="15" max="75" value={threshold} onChange={(e) => setThreshold(Number(e.target.value))} style={{ width: '100%', cursor: 'pointer' }} />
          <button onClick={() => setDiscoveryMode(!discoveryMode)} style={{ marginTop: '20px', padding: '12px 30px', backgroundColor: discoveryMode ? '#10b981' : '#334155', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', width: '100%' }}>
            {discoveryMode ? "Viewing: Higgs Signal" : "Viewing: Full Event Stream"}
          </button>
        </div>
  
        {/* מיכל הגרף עם הגנה מפני נתונים נמוכים (צבע אדום) */}
        <div style={{ width: '100%', flex: 1, minHeight: '350px', backgroundColor: '#1e293b', padding: '40px 20px 20px 20px', borderRadius: '25px', border: isReliable ? '1px solid #334155' : '3px solid #ef4444', transition: 'border 0.3s ease' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="mass" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{backgroundColor: '#0f172a', border: '1px solid #334155'}} />
              <Legend verticalAlign="top" height={50}/>
              {!discoveryMode && <Bar dataKey="background" name="Background Noise" fill="#475569" isAnimationActive={false} />}
              <Bar dataKey="signal" name="Higgs Candidates" fill="#fbbf24" isAnimationActive={false} />
              <ReferenceLine x={125} stroke="#10b981" strokeWidth={4} label={{value:'Target Resonance', fill:'#10b981', position:'top', fontWeight:'bold'}} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p style={{marginTop: '20px', color: '#94a3b8'}}>Selected Events: {totalEventsRemaining.toLocaleString()}</p>
      </div>
    </div>
  );
}

export default App;