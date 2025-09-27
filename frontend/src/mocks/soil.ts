// Demo soil mock data for when backend is unavailable
export const soilMock = {
  testResults: {
    ph: { value: 6.8, status: 'good', optimal: '6.0-7.5', recommendation: 'Ideal for most crops' },
    nitrogen: { value: 75, status: 'good', optimal: '70-85%', recommendation: 'Maintain with regular organic matter' },
    phosphorus: { value: 45, status: 'needs-attention', optimal: '60-80%', recommendation: 'Apply DAP or SSP fertilizer' },
    potassium: { value: 60, status: 'good', optimal: '55-70%', recommendation: 'Supplement with MOP during flowering' },
    organicMatter: { value: 3.2, status: 'good', optimal: '2.5-4.0%', recommendation: 'Add compost annually' },
    moisture: { value: 55, status: 'good', optimal: '50-60%', recommendation: 'Adequate for current season' },
    calcium: { value: 65, status: 'good', optimal: '60-75%', recommendation: 'Sufficient for crop growth' },
    magnesium: { value: 42, status: 'needs-attention', optimal: '50-65%', recommendation: 'Apply Epsom salt if deficiency symptoms appear' },
    sulfur: { value: 38, status: 'needs-attention', optimal: '45-60%', recommendation: 'Use sulfur-containing fertilizers' },
    iron: { value: 28, status: 'critical', optimal: '40-60%', recommendation: 'Apply iron chelate or FeSO4 immediately' },
    zinc: { value: 52, status: 'good', optimal: '45-65%', recommendation: 'Monitor, may need supplementation in sandy soils' },
    boron: { value: 35, status: 'needs-attention', optimal: '40-55%', recommendation: 'Apply borax before flowering crops' }
  }
};
