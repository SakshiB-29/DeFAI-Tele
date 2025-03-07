# DeFi Smart Money Tracker Frontend

A modern web dashboard for tracking DeFi whale movements and analyzing wallet risks.

## Features

- Real-time whale movement tracking
- AI-powered risk analysis
- Interactive data visualization
- Web3 wallet integration
- Customizable alert settings
- Responsive design

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Web3 (wagmi, viem)
- Chart.js
- Headless UI

## Prerequisites

- Node.js 16.x or later
- npm or yarn
- MetaMask or other Web3 wallet

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/defai-tele.git
cd defai-tele/frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Update the environment variables in `.env.local` with your values.

5. Start the development server:
```bash
npm run dev
# or
yarn dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Next.js pages
│   ├── styles/        # Global styles
│   ├── utils/         # Utility functions
│   ├── hooks/         # Custom React hooks
│   └── contexts/      # React contexts
├── public/            # Static assets
└── package.json       # Dependencies and scripts
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [wagmi](https://wagmi.sh/)
- [Chart.js](https://www.chartjs.org/) 