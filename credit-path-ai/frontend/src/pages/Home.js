// import React, { useState, useCallback } from 'react';
// import './Home.css';

// const API_BASE_URL = 'http://localhost:8000';

// const defaultFormData = {
//   loan_amount: '200000',
//   term: '360',
//   property_value: '450000',
//   income: '120000',
//   credit_score: '780',
//   ltv: '45',
//   dtir1: '28',
//   gender: 'Male',
//   loan_type: 'type1',
//   loan_purpose: 'p1',
//   credit_worthiness: 'l1',
//   open_credit: 'nopc',
//   business_or_commercial: 'nob/c',
//   neg_ammortization: 'not_neg',
//   interest_only: 'not_int',
//   lump_sum_payment: 'not_lpsm',
//   construction_type: 'sb',
//   occupancy_type: 'pr',
//   total_units: '1U',
//   credit_type: 'EXP',
//   'co-applicant_credit_type': 'CIB',
//   age: '35-44',
//   region: 'south'
// };

// const BorrowerForm = React.memo(({ borrower, index, onInputChange, onRemove, canRemove }) => {
//   return (
//     <div className="borrower-row">
//       <div className="borrower-header">
//         <span className="borrower-number">Borrower #{index + 1}</span>
//         {canRemove && (
//           <button type="button" className="btn btn-remove" onClick={onRemove}>
//             Remove
//           </button>
//         )}
//       </div>

//       <div className="input-sections">
//         {/* Financial Information */}
//         <div className="section">
//           <h4 className="section-title">Financial Information</h4>
//           <div className="input-row">
//             <div className="input-group">
//               <label>Loan Amount</label>
//               <input
//                 type="number"
//                 value={borrower.data.loan_amount}
//                 onChange={(e) => onInputChange('loan_amount', e.target.value)}
//                 placeholder="200000"
//               />
//             </div>
//             <div className="input-group">
//               <label>Term (months)</label>
//               <input
//                 type="number"
//                 value={borrower.data.term}
//                 onChange={(e) => onInputChange('term', e.target.value)}
//                 placeholder="360"
//               />
//             </div>
//             <div className="input-group">
//               <label>Property Value</label>
//               <input
//                 type="number"
//                 value={borrower.data.property_value}
//                 onChange={(e) => onInputChange('property_value', e.target.value)}
//                 placeholder="450000"
//               />
//             </div>
//             <div className="input-group">
//               <label>Annual Income</label>
//               <input
//                 type="number"
//                 value={borrower.data.income}
//                 onChange={(e) => onInputChange('income', e.target.value)}
//                 placeholder="120000"
//               />
//             </div>
//             <div className="input-group">
//               <label>Credit Score</label>
//               <input
//                 type="number"
//                 value={borrower.data.credit_score}
//                 onChange={(e) => onInputChange('credit_score', e.target.value)}
//                 placeholder="780"
//               />
//             </div>
//             <div className="input-group">
//               <label>LTV (%)</label>
//               <input
//                 type="number"
//                 value={borrower.data.ltv}
//                 onChange={(e) => onInputChange('ltv', e.target.value)}
//                 placeholder="45"
//               />
//             </div>
//             <div className="input-group">
//               <label>DTI (%)</label>
//               <input
//                 type="number"
//                 value={borrower.data.dtir1}
//                 onChange={(e) => onInputChange('dtir1', e.target.value)}
//                 placeholder="28"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Borrower Details */}
//         <div className="section">
//           <h4 className="section-title">Borrower Details</h4>
//           <div className="input-row">
//             <div className="input-group">
//               <label>Gender</label>
//               <select
//                 value={borrower.data.gender}
//                 onChange={(e) => onInputChange('gender', e.target.value)}
//               >
//                 <option value="Male">Male</option>
//                 <option value="Female">Female</option>
//                 <option value="Joint">Joint</option>
//               </select>
//             </div>
//             <div className="input-group">
//               <label>Age Group</label>
//               <select
//                 value={borrower.data.age}
//                 onChange={(e) => onInputChange('age', e.target.value)}
//               >
//                 <option value="<25">&lt;25</option>
//                 <option value="25-34">25-34</option>
//                 <option value="35-44">35-44</option>
//                 <option value="45-54">45-54</option>
//                 <option value="55-64">55-64</option>
//                 <option value="65-74">65-74</option>
//                 <option value=">74">&gt;74</option>
//               </select>
//             </div>
//             <div className="input-group">
//               <label>Region</label>
//               <select
//                 value={borrower.data.region}
//                 onChange={(e) => onInputChange('region', e.target.value)}
//               >
//                 <option value="south">South</option>
//                 <option value="North">North</option>
//                 <option value="central">Central</option>
//                 <option value="North-East">North-East</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Loan Details */}
//         <div className="section">
//           <h4 className="section-title">Loan Details</h4>
//           <div className="input-row">
//             <div className="input-group">
//               <label>Loan Type</label>
//               <select
//                 value={borrower.data.loan_type}
//                 onChange={(e) => onInputChange('loan_type', e.target.value)}
//               >
//                 <option value="type1">Type 1</option>
//                 <option value="type2">Type 2</option>
//                 <option value="type3">Type 3</option>
//               </select>
//             </div>
//             <div className="input-group">
//               <label>Loan Purpose</label>
//               <select
//                 value={borrower.data.loan_purpose}
//                 onChange={(e) => onInputChange('loan_purpose', e.target.value)}
//               >
//                 <option value="p1">Purchase</option>
//                 <option value="p2">Refinance</option>
//                 <option value="p3">Cash Out</option>
//                 <option value="p4">Other</option>
//               </select>
//             </div>
//             <div className="input-group">
//               <label>Credit Worthiness</label>
//               <select
//                 value={borrower.data.credit_worthiness}
//                 onChange={(e) => onInputChange('credit_worthiness', e.target.value)}
//               >
//                 <option value="l1">Level 1</option>
//                 <option value="l2">Level 2</option>
//               </select>
//             </div>
//             <div className="input-group">
//               <label>Open Credit</label>
//               <select
//                 value={borrower.data.open_credit}
//                 onChange={(e) => onInputChange('open_credit', e.target.value)}
//               >
//                 <option value="nopc">No Open Credit</option>
//                 <option value="opc">Open Credit</option>
//               </select>
//             </div>
//             <div className="input-group">
//               <label>Business/Commercial</label>
//               <select
//                 value={borrower.data.business_or_commercial}
//                 onChange={(e) => onInputChange('business_or_commercial', e.target.value)}
//               >
//                 <option value="nob/c">Not Business/Commercial</option>
//                 <option value="b/c">Business/Commercial</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Loan Features */}
//         <div className="section">
//           <h4 className="section-title">Loan Features</h4>
//           <div className="input-row">
//             <div className="input-group">
//               <label>Negative Amortization</label>
//               <select
//                 value={borrower.data.neg_ammortization}
//                 onChange={(e) => onInputChange('neg_ammortization', e.target.value)}
//               >
//                 <option value="not_neg">Not Negative</option>
//                 <option value="neg_amm">Negative Amortization</option>
//               </select>
//             </div>
//             <div className="input-group">
//               <label>Interest Only</label>
//               <select
//                 value={borrower.data.interest_only}
//                 onChange={(e) => onInputChange('interest_only', e.target.value)}
//               >
//                 <option value="not_int">Not Interest Only</option>
//                 <option value="int_only">Interest Only</option>
//               </select>
//             </div>
//             <div className="input-group">
//               <label>Lump Sum Payment</label>
//               <select
//                 value={borrower.data.lump_sum_payment}
//                 onChange={(e) => onInputChange('lump_sum_payment', e.target.value)}
//               >
//                 <option value="not_lpsm">No Lump Sum</option>
//                 <option value="lpsm">Lump Sum Payment</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Property Information */}
//         <div className="section">
//           <h4 className="section-title">Property Information</h4>
//           <div className="input-row">
//             <div className="input-group">
//               <label>Construction Type</label>
//               <select
//                 value={borrower.data.construction_type}
//                 onChange={(e) => onInputChange('construction_type', e.target.value)}
//               >
//                 <option value="sb">Site Built</option>
//                 <option value="mh">Manufactured Home</option>
//               </select>
//             </div>
//             <div className="input-group">
//               <label>Occupancy Type</label>
//               <select
//                 value={borrower.data.occupancy_type}
//                 onChange={(e) => onInputChange('occupancy_type', e.target.value)}
//               >
//                 <option value="pr">Primary</option>
//                 <option value="sr">Secondary</option>
//                 <option value="ir">Investment</option>
//               </select>
//             </div>
//             <div className="input-group">
//               <label>Total Units</label>
//               <select
//                 value={borrower.data.total_units}
//                 onChange={(e) => onInputChange('total_units', e.target.value)}
//               >
//                 <option value="1U">1 Unit</option>
//                 <option value="2U">2 Units</option>
//                 <option value="3U">3 Units</option>
//                 <option value="4U">4 Units</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Credit Bureau Information */}
//         <div className="section">
//           <h4 className="section-title">Credit Bureau Information</h4>
//           <div className="input-row">
//             <div className="input-group">
//               <label>Credit Type</label>
//               <select
//                 value={borrower.data.credit_type}
//                 onChange={(e) => onInputChange('credit_type', e.target.value)}
//               >
//                 <option value="EXP">Experian</option>
//                 <option value="CIB">CIBIL</option>
//                 <option value="EQUI">Equifax</option>
//                 <option value="CRIF">CRIF</option>
//               </select>
//             </div>
//             <div className="input-group">
//               <label>Co-Applicant Credit Type</label>
//               <select
//                 value={borrower.data['co-applicant_credit_type']}
//                 onChange={(e) => onInputChange('co-applicant_credit_type', e.target.value)}
//               >
//                 <option value="CIB">CIBIL</option>
//                 <option value="EXP">Experian</option>
//               </select>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// });

// const ComparisonTable = ({ borrowers, onViewDetails }) => {
//   const getRiskClass = (risk) => {
//     const riskLevel = risk?.toLowerCase() || '';
//     if (riskLevel.includes('low')) return 'low';
//     if (riskLevel.includes('medium')) return 'medium';
//     if (riskLevel.includes('high')) return 'high';
//     return 'low';
//   };

//   return (
//     <div className="comparison-container">
//       <h3 className="comparison-title">Batch Analysis Results</h3>
//       <div className="comparison-table-wrapper">
//         <table className="comparison-table">
//           <thead>
//             <tr>
//               <th>Borrower</th>
//               <th>Risk Level</th>
//               <th>Default Probability</th>
//               <th>Loan Amount</th>
//               <th>Credit Score</th>
//               <th>Income</th>
//               <th>LTV</th>
//               <th>DTI</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {borrowers.map((borrower, index) => {
//               const prediction = borrower.prediction;
//               if (!prediction) return null;
              
//               const riskClass = getRiskClass(prediction.risk_category || prediction.risk_band);
//               const riskPercent = (prediction.default_probability * 100).toFixed(1);
              
//               return (
//                 <tr key={borrower.id}>
//                   <td>
//                     <strong>Borrower #{index + 1}</strong>
//                   </td>
//                   <td>
//                     <span className={`risk-badge-small ${riskClass}`}>
//                       {prediction.risk_category || prediction.risk_band}
//                     </span>
//                   </td>
//                   <td>
//                     <div className="probability-cell">
//                       <div className="probability-bar-container">
//                         <div className={`probability-bar ${riskClass}`} style={{ width: `${riskPercent}%` }}></div>
//                       </div>
//                       <span className="probability-text">{riskPercent}%</span>
//                     </div>
//                   </td>
//                   <td>${parseFloat(borrower.data.loan_amount).toLocaleString()}</td>
//                   <td>{borrower.data.credit_score}</td>
//                   <td>${parseFloat(borrower.data.income).toLocaleString()}</td>
//                   <td>{borrower.data.ltv}%</td>
//                   <td>{borrower.data.dtir1}%</td>
//                   <td>
//                     <button 
//                       className="btn-view-details"
//                       onClick={() => onViewDetails(borrower.id)}
//                     >
//                       Details
//                     </button>
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// const DetailedResultModal = ({ borrower, index, onClose, isModal = true }) => {
//   if (!borrower || !borrower.prediction) return null;

//   const getRiskClass = (risk) => {
//     const riskLevel = risk?.toLowerCase() || '';
//     if (riskLevel.includes('low')) return 'low';
//     if (riskLevel.includes('medium')) return 'medium';
//     if (riskLevel.includes('high')) return 'high';
//     return 'low';
//   };

//   const prediction = borrower.prediction;
//   const riskClass = getRiskClass(prediction.risk_category || prediction.risk_band);
//   const riskPercent = (prediction.default_probability * 100).toFixed(0);

//   const content = (
//     <div className={`result-card ${riskClass}`}>
//       {isModal && <button className="result-close-btn" onClick={onClose}>×</button>}
//       <div className="result-header">
//         <div className="borrower-title">Borrower #{index + 1} - Detailed Analysis</div>
//         <div className={`risk-badge ${riskClass}`}>
//           {prediction.risk_category || prediction.risk_band}
//         </div>
//       </div>

//       <div className="result-grid">
//         <div className="result-item">
//           <div className="result-label">Loan Amount</div>
//           <div className="result-value">${parseFloat(borrower.data.loan_amount).toLocaleString()}</div>
//         </div>
//         <div className="result-item">
//           <div className="result-label">Annual Income</div>
//           <div className="result-value">${parseFloat(borrower.data.income).toLocaleString()}</div>
//         </div>
//         <div className="result-item">
//           <div className="result-label">Credit Score</div>
//           <div className="result-value">{borrower.data.credit_score}</div>
//         </div>
//         <div className="result-item">
//           <div className="result-label">LTV Ratio</div>
//           <div className="result-value">{borrower.data.ltv}%</div>
//         </div>
//         <div className="result-item">
//           <div className="result-label">DTI Ratio</div>
//           <div className="result-value">{borrower.data.dtir1}%</div>
//         </div>
//         <div className="result-item">
//           <div className="result-label">Property Value</div>
//           <div className="result-value">${parseFloat(borrower.data.property_value).toLocaleString()}</div>
//         </div>
//       </div>

//       <div className="risk-bar">
//         <div className={`risk-bar-fill ${riskClass}`} style={{ width: `${riskPercent}%` }}></div>
//       </div>

//       <div style={{ textAlign: 'center', marginBottom: '12px', fontWeight: 600, color: '#4a5568' }}>
//         Default Probability: {prediction.default_probability.toFixed(3)} ({riskPercent}%)
//       </div>

//       <div className="recommendation">
//         <strong>Recommendation:</strong> {prediction.recommendation}
//       </div>

//       <div className="additional-details">
//         <h4>Application Details</h4>
//         <div className="details-grid">
//           <div><strong>Loan Purpose:</strong> {borrower.data.loan_purpose}</div>
//           <div><strong>Loan Type:</strong> {borrower.data.loan_type}</div>
//           <div><strong>Term:</strong> {borrower.data.term} months</div>
//           <div><strong>Occupancy:</strong> {borrower.data.occupancy_type}</div>
//           <div><strong>Age Group:</strong> {borrower.data.age}</div>
//           <div><strong>Region:</strong> {borrower.data.region}</div>
//         </div>
//       </div>
//     </div>
//   );

//   if (isModal) {
//     return (
//       <div className="modal-overlay" onClick={onClose}>
//         <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//           {content}
//         </div>
//       </div>
//     );
//   }

//   return content;
// };

// function Home() {
//   const [loading, setLoading] = useState(false);
//   const [borrowers, setBorrowers] = useState([{ id: 1, data: { ...defaultFormData }, prediction: null }]);
//   const [viewMode, setViewMode] = useState('input');
//   const [selectedBorrower, setSelectedBorrower] = useState(null);

//   const handleInputChange = useCallback((borrowerId, field, value) => {
//     setBorrowers(prev => prev.map(b => {
//       if (b.id === borrowerId) {
//         return { ...b, data: { ...b.data, [field]: value } };
//       }
//       return b;
//     }));
//   }, []);

//   const addBorrower = () => {
//     const newId = Math.max(...borrowers.map(b => b.id)) + 1;
//     setBorrowers([...borrowers, { id: newId, data: { ...defaultFormData }, prediction: null }]);
//   };

//   const removeBorrower = useCallback((borrowerId) => {
//     setBorrowers(prev => {
//       if (prev.length > 1) {
//         return prev.filter(b => b.id !== borrowerId);
//       } else {
//         alert("You must have at least one borrower!");
//         return prev;
//       }
//     });
//   }, []);

//   const clearAll = () => {
//     if (window.confirm("Clear all data?")) {
//       setBorrowers([{ id: 1, data: { ...defaultFormData }, prediction: null }]);
//       setViewMode('input');
//     }
//   };

//   const predictRisk = async () => {
//     setLoading(true);

//     try {
//       const applications = borrowers.map(b => ({
//         ...b.data,
//         loan_amount: parseFloat(b.data.loan_amount),
//         term: parseFloat(b.data.term),
//         property_value: parseFloat(b.data.property_value),
//         income: parseFloat(b.data.income),
//         credit_score: parseInt(b.data.credit_score),
//         ltv: parseFloat(b.data.ltv),
//         dtir1: parseFloat(b.data.dtir1)
//       }));

//       if (borrowers.length === 1) {
//         const response = await fetch(`${API_BASE_URL}/predict`, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(applications[0])
//         });
//         const data = await response.json();
//         setBorrowers(prev => prev.map(b => 
//           b.id === borrowers[0].id 
//             ? { ...b, prediction: data }
//             : b
//         ));
//       } else {
//         const response = await fetch(`${API_BASE_URL}/predict/batch`, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(applications)
//         });
//         const data = await response.json();
        
//         setBorrowers(prev => prev.map((b, index) => ({
//           ...b,
//           prediction: data.predictions[index]
//         })));
//       }
      
//       setViewMode('results');
//     } catch (error) {
//       alert('Prediction failed: ' + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const hasResults = borrowers.some(b => b.prediction !== null);
//   const avgRisk = hasResults 
//     ? (borrowers.reduce((sum, b) => sum + (b.prediction?.default_probability || 0), 0) / borrowers.length)
//     : 0;

//   return (
//     <div style={{ minHeight: '100vh', background: '#f5f7fa', padding: '20px' }}>
//       <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
//         {/* Header */}
//         <div className="header">
//           <h1>Credit Path AI</h1>
//           <p className="subtitle">Predict loan default risk with AI-powered analysis</p>
//         </div>

//         {/* View Toggle */}
//         {hasResults && (
//           <div className="view-toggle">
//             <button 
//               className={`toggle-btn ${viewMode === 'input' ? 'active' : ''}`}
//               onClick={() => setViewMode('input')}
//             >
//               📝 Input Forms
//             </button>
//             <button 
//               className={`toggle-btn ${viewMode === 'results' ? 'active' : ''}`}
//               onClick={() => setViewMode('results')}
//             >
//               📊 Results {borrowers.length > 1 ? 'Comparison' : ''}
//             </button>
//           </div>
//         )}

//         {/* Input View */}
//         {viewMode === 'input' && (
//           <div className="card">
//             <div className="input-grid">
//               {borrowers.map((borrower, index) => (
//                 <BorrowerForm 
//                   key={borrower.id} 
//                   borrower={borrower} 
//                   index={index}
//                   onInputChange={(field, value) => handleInputChange(borrower.id, field, value)}
//                   onRemove={() => removeBorrower(borrower.id)}
//                   canRemove={borrowers.length > 1}
//                 />
//               ))}
//             </div>

//             <div className="button-group">
//               <button type="button" className="btn btn-secondary" onClick={addBorrower}>
//                 + Add Borrower
//               </button>
//               <button type="button" className="btn btn-primary" onClick={predictRisk} disabled={loading}>
//                 {loading ? 'Analyzing...' : 'Analyze Risk'}
//               </button>
//               <button type="button" className="btn btn-tertiary" onClick={clearAll}>
//                 Clear All
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Results View */}
//         {viewMode === 'results' && hasResults && (
//           <>
//             {/* Summary Card */}
//             <div className="summary">
//               <div>Portfolio Risk Analysis</div>
//               <div className="summary-value">
//                 {(avgRisk * 100).toFixed(1)}%
//               </div>
//               <div className="summary-label">
//                 Average Default Probability: {avgRisk.toFixed(3)}
//               </div>
//               <div style={{ marginTop: '12px', opacity: 0.9 }}>
//                 {borrowers.length} borrower{borrowers.length > 1 ? 's' : ''} analyzed
//               </div>
//             </div>

//             {/* Comparison Table for Multiple Borrowers */}
//             {borrowers.length > 1 ? (
//               <div className="card">
//                 <ComparisonTable 
//                   borrowers={borrowers}
//                   onViewDetails={(id) => setSelectedBorrower(borrowers.find(b => b.id === id))}
//                 />
//               </div>
//             ) : (
//               // Single borrower detailed view
//               <div className="card">
//                 <DetailedResultModal 
//                   borrower={borrowers[0]}
//                   index={0}
//                   onClose={() => {}}
//                   isModal={false}
//                 />
//               </div>
//             )}
//           </>
//         )}

//         {/* Detail Modal */}
//         {selectedBorrower && (
//           <DetailedResultModal 
//             borrower={selectedBorrower}
//             index={borrowers.findIndex(b => b.id === selectedBorrower.id)}
//             onClose={() => setSelectedBorrower(null)}
//           />
//         )}
//       </div>
//     </div>
//   );
// }

// export default Home;

import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const API_BASE_URL = 'http://localhost:8000';

const defaultFormData = {
  loan_amount: '200000',
  term: '360',
  property_value: '450000',
  income: '120000',
  credit_score: '780',
  ltv: '45',
  dtir1: '28',
  gender: 'Male',
  loan_type: 'type1',
  loan_purpose: 'p1',
  credit_worthiness: 'l1',
  open_credit: 'nopc',
  business_or_commercial: 'nob/c',
  neg_ammortization: 'not_neg',
  interest_only: 'not_int',
  lump_sum_payment: 'not_lpsm',
  construction_type: 'sb',
  occupancy_type: 'pr',
  total_units: '1U',
  credit_type: 'EXP',
  'co-applicant_credit_type': 'CIB',
  age: '35-44',
  region: 'south'
};

const BorrowerForm = React.memo(({ borrower, index, onInputChange, onRemove, canRemove }) => {
  return (
    <div className="borrower-row">
      <div className="borrower-header">
        <span className="borrower-number">Borrower #{index + 1}</span>
        {canRemove && (
          <button type="button" className="btn btn-remove" onClick={onRemove}>
            Remove
          </button>
        )}
      </div>

      <div className="input-sections">
        {/* Financial Information */}
        <div className="section">
          <h4 className="section-title">Financial Information</h4>
          <div className="input-row">
            <div className="input-group">
              <label>Loan Amount</label>
              <input
                type="number"
                value={borrower.data.loan_amount}
                onChange={(e) => onInputChange('loan_amount', e.target.value)}
                placeholder="200000"
              />
            </div>
            <div className="input-group">
              <label>Term (months)</label>
              <input
                type="number"
                value={borrower.data.term}
                onChange={(e) => onInputChange('term', e.target.value)}
                placeholder="360"
              />
            </div>
            <div className="input-group">
              <label>Property Value</label>
              <input
                type="number"
                value={borrower.data.property_value}
                onChange={(e) => onInputChange('property_value', e.target.value)}
                placeholder="450000"
              />
            </div>
            <div className="input-group">
              <label>Annual Income</label>
              <input
                type="number"
                value={borrower.data.income}
                onChange={(e) => onInputChange('income', e.target.value)}
                placeholder="120000"
              />
            </div>
            <div className="input-group">
              <label>Credit Score</label>
              <input
                type="number"
                value={borrower.data.credit_score}
                onChange={(e) => onInputChange('credit_score', e.target.value)}
                placeholder="780"
              />
            </div>
            <div className="input-group">
              <label>LTV (%)</label>
              <input
                type="number"
                value={borrower.data.ltv}
                onChange={(e) => onInputChange('ltv', e.target.value)}
                placeholder="45"
              />
            </div>
            <div className="input-group">
              <label>DTI (%)</label>
              <input
                type="number"
                value={borrower.data.dtir1}
                onChange={(e) => onInputChange('dtir1', e.target.value)}
                placeholder="28"
              />
            </div>
          </div>
        </div>

        {/* Borrower Details */}
        <div className="section">
          <h4 className="section-title">Borrower Details</h4>
          <div className="input-row">
            <div className="input-group">
              <label>Gender</label>
              <select
                value={borrower.data.gender}
                onChange={(e) => onInputChange('gender', e.target.value)}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Joint">Joint</option>
              </select>
            </div>
            <div className="input-group">
              <label>Age Group</label>
              <select
                value={borrower.data.age}
                onChange={(e) => onInputChange('age', e.target.value)}
              >
                <option value="<25">&lt;25</option>
                <option value="25-34">25-34</option>
                <option value="35-44">35-44</option>
                <option value="45-54">45-54</option>
                <option value="55-64">55-64</option>
                <option value="65-74">65-74</option>
                <option value=">74">&gt;74</option>
              </select>
            </div>
            <div className="input-group">
              <label>Region</label>
              <select
                value={borrower.data.region}
                onChange={(e) => onInputChange('region', e.target.value)}
              >
                <option value="south">South</option>
                <option value="North">North</option>
                <option value="central">Central</option>
                <option value="North-East">North-East</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loan Details */}
        <div className="section">
          <h4 className="section-title">Loan Details</h4>
          <div className="input-row">
            <div className="input-group">
              <label>Loan Type</label>
              <select
                value={borrower.data.loan_type}
                onChange={(e) => onInputChange('loan_type', e.target.value)}
              >
                <option value="type1">Type 1</option>
                <option value="type2">Type 2</option>
                <option value="type3">Type 3</option>
              </select>
            </div>
            <div className="input-group">
              <label>Loan Purpose</label>
              <select
                value={borrower.data.loan_purpose}
                onChange={(e) => onInputChange('loan_purpose', e.target.value)}
              >
                <option value="p1">Purchase</option>
                <option value="p2">Refinance</option>
                <option value="p3">Cash Out</option>
                <option value="p4">Other</option>
              </select>
            </div>
            <div className="input-group">
              <label>Credit Worthiness</label>
              <select
                value={borrower.data.credit_worthiness}
                onChange={(e) => onInputChange('credit_worthiness', e.target.value)}
              >
                <option value="l1">Level 1</option>
                <option value="l2">Level 2</option>
              </select>
            </div>
            <div className="input-group">
              <label>Open Credit</label>
              <select
                value={borrower.data.open_credit}
                onChange={(e) => onInputChange('open_credit', e.target.value)}
              >
                <option value="nopc">No Open Credit</option>
                <option value="opc">Open Credit</option>
              </select>
            </div>
            <div className="input-group">
              <label>Business/Commercial</label>
              <select
                value={borrower.data.business_or_commercial}
                onChange={(e) => onInputChange('business_or_commercial', e.target.value)}
              >
                <option value="nob/c">Not Business/Commercial</option>
                <option value="b/c">Business/Commercial</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loan Features */}
        <div className="section">
          <h4 className="section-title">Loan Features</h4>
          <div className="input-row">
            <div className="input-group">
              <label>Negative Amortization</label>
              <select
                value={borrower.data.neg_ammortization}
                onChange={(e) => onInputChange('neg_ammortization', e.target.value)}
              >
                <option value="not_neg">Not Negative</option>
                <option value="neg_amm">Negative Amortization</option>
              </select>
            </div>
            <div className="input-group">
              <label>Interest Only</label>
              <select
                value={borrower.data.interest_only}
                onChange={(e) => onInputChange('interest_only', e.target.value)}
              >
                <option value="not_int">Not Interest Only</option>
                <option value="int_only">Interest Only</option>
              </select>
            </div>
            <div className="input-group">
              <label>Lump Sum Payment</label>
              <select
                value={borrower.data.lump_sum_payment}
                onChange={(e) => onInputChange('lump_sum_payment', e.target.value)}
              >
                <option value="not_lpsm">No Lump Sum</option>
                <option value="lpsm">Lump Sum Payment</option>
              </select>
            </div>
          </div>
        </div>

        {/* Property Information */}
        <div className="section">
          <h4 className="section-title">Property Information</h4>
          <div className="input-row">
            <div className="input-group">
              <label>Construction Type</label>
              <select
                value={borrower.data.construction_type}
                onChange={(e) => onInputChange('construction_type', e.target.value)}
              >
                <option value="sb">Site Built</option>
                <option value="mh">Manufactured Home</option>
              </select>
            </div>
            <div className="input-group">
              <label>Occupancy Type</label>
              <select
                value={borrower.data.occupancy_type}
                onChange={(e) => onInputChange('occupancy_type', e.target.value)}
              >
                <option value="pr">Primary</option>
                <option value="sr">Secondary</option>
                <option value="ir">Investment</option>
              </select>
            </div>
            <div className="input-group">
              <label>Total Units</label>
              <select
                value={borrower.data.total_units}
                onChange={(e) => onInputChange('total_units', e.target.value)}
              >
                <option value="1U">1 Unit</option>
                <option value="2U">2 Units</option>
                <option value="3U">3 Units</option>
                <option value="4U">4 Units</option>
              </select>
            </div>
          </div>
        </div>

        {/* Credit Bureau Information */}
        <div className="section">
          <h4 className="section-title">Credit Bureau Information</h4>
          <div className="input-row">
            <div className="input-group">
              <label>Credit Type</label>
              <select
                value={borrower.data.credit_type}
                onChange={(e) => onInputChange('credit_type', e.target.value)}
              >
                <option value="EXP">Experian</option>
                <option value="CIB">CIBIL</option>
                <option value="EQUI">Equifax</option>
                <option value="CRIF">CRIF</option>
              </select>
            </div>
            <div className="input-group">
              <label>Co-Applicant Credit Type</label>
              <select
                value={borrower.data['co-applicant_credit_type']}
                onChange={(e) => onInputChange('co-applicant_credit_type', e.target.value)}
              >
                <option value="CIB">CIBIL</option>
                <option value="EXP">Experian</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

const ComparisonTable = ({ borrowers, onViewDetails }) => {
  const getRiskClass = (risk) => {
    const riskLevel = risk?.toLowerCase() || '';
    if (riskLevel.includes('low')) return 'low';
    if (riskLevel.includes('medium')) return 'medium';
    if (riskLevel.includes('high')) return 'high';
    return 'low';
  };

  return (
    <div className="comparison-container">
      <h3 className="comparison-title">Batch Analysis Results</h3>
      <div className="comparison-table-wrapper">
        <table className="comparison-table">
          <thead>
            <tr>
              <th>Borrower</th>
              <th>Risk Level</th>
              <th>Default Probability</th>
              <th>Loan Amount</th>
              <th>Credit Score</th>
              <th>Income</th>
              <th>LTV</th>
              <th>DTI</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {borrowers.map((borrower, index) => {
              const prediction = borrower.prediction;
              if (!prediction) return null;
              
              const riskClass = getRiskClass(prediction.risk_category || prediction.risk_band);
              const riskPercent = (prediction.default_probability * 100).toFixed(1);
              
              return (
                <tr key={borrower.id}>
                  <td>
                    <strong>Borrower #{index + 1}</strong>
                  </td>
                  <td>
                    <span className={`risk-badge-small ${riskClass}`}>
                      {prediction.risk_category || prediction.risk_band}
                    </span>
                  </td>
                  <td>
                    <div className="probability-cell">
                      <div className="probability-bar-container">
                        <div className={`probability-bar ${riskClass}`} style={{ width: `${riskPercent}%` }}></div>
                      </div>
                      <span className="probability-text">{riskPercent}%</span>
                    </div>
                  </td>
                  <td>${parseFloat(borrower.data.loan_amount).toLocaleString()}</td>
                  <td>{borrower.data.credit_score}</td>
                  <td>${parseFloat(borrower.data.income).toLocaleString()}</td>
                  <td>{borrower.data.ltv}%</td>
                  <td>{borrower.data.dtir1}%</td>
                  <td>
                    <button 
                      className="btn-view-details"
                      onClick={() => onViewDetails(borrower.id)}
                    >
                      Details
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const DetailedResultModal = ({ borrower, index, onClose, isModal = true }) => {
  if (!borrower || !borrower.prediction) return null;

  const getRiskClass = (risk) => {
    const riskLevel = risk?.toLowerCase() || '';
    if (riskLevel.includes('low')) return 'low';
    if (riskLevel.includes('medium')) return 'medium';
    if (riskLevel.includes('high')) return 'high';
    return 'low';
  };

  const prediction = borrower.prediction;
  const riskClass = getRiskClass(prediction.risk_category || prediction.risk_band);
  const riskPercent = (prediction.default_probability * 100).toFixed(0);

  const content = (
    <div className={`result-card ${riskClass}`}>
      {isModal && <button className="result-close-btn" onClick={onClose}>×</button>}
      <div className="result-header">
        <div className="borrower-title">Borrower #{index + 1} - Detailed Analysis</div>
        <div className={`risk-badge ${riskClass}`}>
          {prediction.risk_category || prediction.risk_band}
        </div>
      </div>

      <div className="result-grid">
        <div className="result-item">
          <div className="result-label">Loan Amount</div>
          <div className="result-value">${parseFloat(borrower.data.loan_amount).toLocaleString()}</div>
        </div>
        <div className="result-item">
          <div className="result-label">Annual Income</div>
          <div className="result-value">${parseFloat(borrower.data.income).toLocaleString()}</div>
        </div>
        <div className="result-item">
          <div className="result-label">Credit Score</div>
          <div className="result-value">{borrower.data.credit_score}</div>
        </div>
        <div className="result-item">
          <div className="result-label">LTV Ratio</div>
          <div className="result-value">{borrower.data.ltv}%</div>
        </div>
        <div className="result-item">
          <div className="result-label">DTI Ratio</div>
          <div className="result-value">{borrower.data.dtir1}%</div>
        </div>
        <div className="result-item">
          <div className="result-label">Property Value</div>
          <div className="result-value">${parseFloat(borrower.data.property_value).toLocaleString()}</div>
        </div>
      </div>

      <div className="risk-bar">
        <div className={`risk-bar-fill ${riskClass}`} style={{ width: `${riskPercent}%` }}></div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '12px', fontWeight: 600, color: '#4a5568' }}>
        Default Probability: {prediction.default_probability.toFixed(3)} ({riskPercent}%)
      </div>

      <div className="recommendation">
        <strong>Recommendation:</strong> {prediction.recommendation}
      </div>

      <div className="additional-details">
        <h4>Application Details</h4>
        <div className="details-grid">
          <div><strong>Loan Purpose:</strong> {borrower.data.loan_purpose}</div>
          <div><strong>Loan Type:</strong> {borrower.data.loan_type}</div>
          <div><strong>Term:</strong> {borrower.data.term} months</div>
          <div><strong>Occupancy:</strong> {borrower.data.occupancy_type}</div>
          <div><strong>Age Group:</strong> {borrower.data.age}</div>
          <div><strong>Region:</strong> {borrower.data.region}</div>
        </div>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          {content}
        </div>
      </div>
    );
  }

  return content;
};

function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [borrowers, setBorrowers] = useState([{ id: 1, data: { ...defaultFormData }, prediction: null }]);
  const [viewMode, setViewMode] = useState('input');
  const [selectedBorrower, setSelectedBorrower] = useState(null);
  
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      navigate('/signin');
    }
  };

  const handleInputChange = useCallback((borrowerId, field, value) => {
    setBorrowers(prev => prev.map(b => {
      if (b.id === borrowerId) {
        return { ...b, data: { ...b.data, [field]: value } };
      }
      return b;
    }));
  }, []);

  const addBorrower = () => {
    const newId = Math.max(...borrowers.map(b => b.id)) + 1;
    setBorrowers([...borrowers, { id: newId, data: { ...defaultFormData }, prediction: null }]);
  };

  const removeBorrower = useCallback((borrowerId) => {
    setBorrowers(prev => {
      if (prev.length > 1) {
        return prev.filter(b => b.id !== borrowerId);
      } else {
        alert("You must have at least one borrower!");
        return prev;
      }
    });
  }, []);

  const clearAll = () => {
    if (window.confirm("Clear all data?")) {
      setBorrowers([{ id: 1, data: { ...defaultFormData }, prediction: null }]);
      setViewMode('input');
    }
  };

  const predictRisk = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const applications = borrowers.map(b => ({
        ...b.data,
        loan_amount: parseFloat(b.data.loan_amount),
        term: parseFloat(b.data.term),
        property_value: parseFloat(b.data.property_value),
        income: parseFloat(b.data.income),
        credit_score: parseInt(b.data.credit_score),
        ltv: parseFloat(b.data.ltv),
        dtir1: parseFloat(b.data.dtir1)
      }));

      if (borrowers.length === 1) {
        const response = await fetch(`${API_BASE_URL}/predict`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(applications[0])
        });
        
        if (response.status === 401) {
          alert('Session expired. Please login again.');
          localStorage.removeItem('token');
          navigate('/signin');
          return;
        }
        
        const data = await response.json();
        setBorrowers(prev => prev.map(b => 
          b.id === borrowers[0].id 
            ? { ...b, prediction: data }
            : b
        ));
      } else {
        const response = await fetch(`${API_BASE_URL}/predict/batch`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(applications)
        });
        
        if (response.status === 401) {
          alert('Session expired. Please login again.');
          localStorage.removeItem('token');
          navigate('/signin');
          return;
        }
        
        const data = await response.json();
        
        setBorrowers(prev => prev.map((b, index) => ({
          ...b,
          prediction: data.predictions[index]
        })));
      }
      
      setViewMode('results');
    } catch (error) {
      alert('Prediction failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const hasResults = borrowers.some(b => b.prediction !== null);
  const avgRisk = hasResults 
    ? (borrowers.reduce((sum, b) => sum + (b.prediction?.default_probability || 0), 0) / borrowers.length)
    : 0;

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa', padding: '20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header with Logout */}
        <div className="header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div>
              <h1>Credit Path AI</h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ color: '#4a5568', fontWeight: 600 }}>Welcome, {username}!</span>
              <button onClick={handleLogout} className="btn btn-logout">
                Logout
              </button>
            </div>
          </div>
          <p className="subtitle">Predict loan default risk with AI-powered analysis</p>
        </div>

        {/* View Toggle */}
        {hasResults && (
          <div className="view-toggle">
            <button 
              className={`toggle-btn ${viewMode === 'input' ? 'active' : ''}`}
              onClick={() => setViewMode('input')}
            >
              📝 Input Forms
            </button>
            <button 
              className={`toggle-btn ${viewMode === 'results' ? 'active' : ''}`}
              onClick={() => setViewMode('results')}
            >
              📊 Results {borrowers.length > 1 ? 'Comparison' : ''}
            </button>
          </div>
        )}

        {/* Input View */}
        {viewMode === 'input' && (
          <div className="card">
            <div className="input-grid">
              {borrowers.map((borrower, index) => (
                <BorrowerForm 
                  key={borrower.id} 
                  borrower={borrower} 
                  index={index}
                  onInputChange={(field, value) => handleInputChange(borrower.id, field, value)}
                  onRemove={() => removeBorrower(borrower.id)}
                  canRemove={borrowers.length > 1}
                />
              ))}
            </div>

            <div className="button-group">
              <button type="button" className="btn btn-secondary" onClick={addBorrower}>
                + Add Borrower
              </button>
              <button type="button" className="btn btn-primary" onClick={predictRisk} disabled={loading}>
                {loading ? 'Analyzing...' : 'Analyze Risk'}
              </button>
              <button type="button" className="btn btn-tertiary" onClick={clearAll}>
                Clear All
              </button>
            </div>
          </div>
        )}

        {/* Results View */}
        {viewMode === 'results' && hasResults && (
          <>
            {/* Summary Card */}
            <div className="summary">
              <div>Portfolio Risk Analysis</div>
              <div className="summary-value">
                {(avgRisk * 100).toFixed(1)}%
              </div>
              <div className="summary-label">
                Average Default Probability: {avgRisk.toFixed(3)}
              </div>
              <div style={{ marginTop: '12px', opacity: 0.9 }}>
                {borrowers.length} borrower{borrowers.length > 1 ? 's' : ''} analyzed
              </div>
            </div>

            {/* Comparison Table for Multiple Borrowers */}
            {borrowers.length > 1 ? (
              <div className="card">
                <ComparisonTable 
                  borrowers={borrowers}
                  onViewDetails={(id) => setSelectedBorrower(borrowers.find(b => b.id === id))}
                />
              </div>
            ) : (
              // Single borrower detailed view
              <div className="card">
                <DetailedResultModal 
                  borrower={borrowers[0]}
                  index={0}
                  onClose={() => {}}
                  isModal={false}
                />
              </div>
            )}
          </>
        )}

        {/* Detail
         Modal */}
        {selectedBorrower && (
          <DetailedResultModal 
            borrower={selectedBorrower}
            index={borrowers.findIndex(b => b.id === selectedBorrower.id)}
            onClose={() => setSelectedBorrower(null)}
          />
        )}
      </div>
    </div>
  );
}

export default Home;