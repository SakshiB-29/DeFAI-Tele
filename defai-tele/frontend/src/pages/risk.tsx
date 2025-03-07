import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import axios from 'axios';
import { format } from 'date-fns';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale
);

interface RiskMetrics {
  total_risk_score: number;
  risk_distribution: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  risk_factors: {
    name: string;
    score: number;
    description: string;
  }[];
}

interface RiskAlert {
  id: string;
  type: string;
  severity: string;
  description: string;
  timestamp: string;
  wallet_address: string;
  risk_score: number;
}

const RiskAnalysis: React.FC = () => {
  const [riskMetrics, setRiskMetrics] = useState<RiskMetrics>({
    total_risk_score: 0,
    risk_distribution: {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0,
    },
    risk_factors: [],
  });
  const [riskAlerts, setRiskAlerts] = useState<RiskAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [metricsRes, alertsRes] = await Promise.all([
          axios.get('/api/v1/risk-metrics'),
          axios.get('/api/v1/risk-alerts'),
        ]);

        setRiskMetrics(metricsRes.data);
        setRiskAlerts(alertsRes.data.alerts);
      } catch (error) {
        console.error('Error fetching risk data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const distributionData = {
    labels: ['Low', 'Medium', 'High', 'Critical'],
    datasets: [
      {
        data: [
          riskMetrics.risk_distribution.low,
          riskMetrics.risk_distribution.medium,
          riskMetrics.risk_distribution.high,
          riskMetrics.risk_distribution.critical,
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.5)',
          'rgba(234, 179, 8, 0.5)',
          'rgba(239, 68, 68, 0.5)',
          'rgba(220, 38, 38, 0.5)',
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(234, 179, 8)',
          'rgb(239, 68, 68)',
          'rgb(220, 38, 38)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Risk Distribution',
      },
    },
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Overall Risk Score */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Overall Risk Score</h3>
              <p className="mt-1 text-sm text-gray-500">
                Current system-wide risk assessment
              </p>
            </div>
            <div className="text-4xl font-bold text-primary-600">
              {(riskMetrics.total_risk_score * 100).toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Risk Distribution Chart */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="h-64">
            <Doughnut options={chartOptions} data={distributionData} />
          </div>
        </div>

        {/* Risk Factors */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Risk Factors</h3>
          </div>
          <div className="border-t border-gray-200">
            <ul className="divide-y divide-gray-200">
              {riskMetrics.risk_factors.map((factor) => (
                <li key={factor.name} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{factor.name}</p>
                      <p className="text-sm text-gray-500">{factor.description}</p>
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <div className="w-32 h-2 bg-gray-200 rounded-full">
                          <div
                            className="h-2 rounded-full bg-primary-600"
                            style={{ width: `${factor.score * 100}%` }}
                          />
                        </div>
                        <span className="ml-2 text-sm text-gray-500">
                          {(factor.score * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Risk Alerts */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Risk Alerts</h3>
          </div>
          <div className="border-t border-gray-200">
            <ul className="divide-y divide-gray-200">
              {riskAlerts.map((alert) => (
                <li key={alert.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{alert.type}</p>
                      <p className="text-sm text-gray-500">{alert.description}</p>
                    </div>
                    <div className="ml-4">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        alert.severity === 'critical'
                          ? 'bg-red-100 text-red-800'
                          : alert.severity === 'high'
                          ? 'bg-orange-100 text-orange-800'
                          : alert.severity === 'medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {alert.severity.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        Wallet: {alert.wallet_address.slice(0, 6)}...{alert.wallet_address.slice(-4)}
                      </p>
                      <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                        Risk Score: {(alert.risk_score * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>
                        {format(new Date(alert.timestamp), 'MMM d, yyyy HH:mm:ss')}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RiskAnalysis; 