import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';
import { format } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface WhaleWallet {
  address: string;
  balance: number;
  total_transactions: number;
  risk_score: number;
  tags: string[];
  last_active: string;
}

interface WhaleMovement {
  from: string;
  to: string;
  value: number;
  token: string;
  timestamp: string;
  risk_score: number;
}

const WhaleTracking: React.FC = () => {
  const [whaleWallets, setWhaleWallets] = useState<WhaleWallet[]>([]);
  const [whaleMovements, setWhaleMovements] = useState<WhaleMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [walletsRes, movementsRes] = await Promise.all([
          axios.get('/api/v1/whales'),
          axios.get(`/api/v1/whale-movements?timeframe=${selectedTimeframe}`),
        ]);

        setWhaleWallets(walletsRes.data.whales);
        setWhaleMovements(movementsRes.data.movements);
      } catch (error) {
        console.error('Error fetching whale data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // Refresh every minute

    return () => clearInterval(interval);
  }, [selectedTimeframe]);

  const chartData = {
    labels: whaleMovements.map(movement => 
      format(new Date(movement.timestamp), 'HH:mm')
    ),
    datasets: [
      {
        label: 'Movement Value (ETH)',
        data: whaleMovements.map(movement => movement.value),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
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
        text: 'Whale Movements',
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
        {/* Timeframe Selector */}
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex space-x-4">
            {['1h', '24h', '7d', '30d'].map((timeframe) => (
              <button
                key={timeframe}
                onClick={() => setSelectedTimeframe(timeframe)}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  selectedTimeframe === timeframe
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {timeframe}
              </button>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white shadow rounded-lg p-6">
          <Bar options={chartOptions} data={chartData} />
        </div>

        {/* Whale Wallets */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Whale Wallets</h3>
          </div>
          <div className="border-t border-gray-200">
            <ul className="divide-y divide-gray-200">
              {whaleWallets.map((wallet) => (
                <li key={wallet.address} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-primary-600 truncate">
                      {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        wallet.risk_score > 0.7
                          ? 'bg-red-100 text-red-800'
                          : wallet.risk_score > 0.4
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        Risk: {(wallet.risk_score * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        Balance: {wallet.balance.toFixed(4)} ETH
                      </p>
                      <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                        Transactions: {wallet.total_transactions}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>
                        Last Active: {format(new Date(wallet.last_active), 'MMM d, yyyy HH:mm:ss')}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="flex flex-wrap gap-2">
                      {wallet.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recent Movements */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Whale Movements</h3>
          </div>
          <div className="border-t border-gray-200">
            <ul className="divide-y divide-gray-200">
              {whaleMovements.slice(0, 5).map((movement, index) => (
                <li key={index} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-primary-600">
                      {movement.value.toFixed(4)} {movement.token}
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        movement.risk_score > 0.7
                          ? 'bg-red-100 text-red-800'
                          : movement.risk_score > 0.4
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        Risk: {(movement.risk_score * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        From: {movement.from.slice(0, 6)}...{movement.from.slice(-4)}
                      </p>
                      <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                        To: {movement.to.slice(0, 6)}...{movement.to.slice(-4)}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>
                        {format(new Date(movement.timestamp), 'MMM d, yyyy HH:mm:ss')}
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

export default WhaleTracking; 