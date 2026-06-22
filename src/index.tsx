import { createRoot } from 'react-dom/client';
import App from '@/app';

import './index.css';
import '@/lib/i18n';

const root = createRoot(document.getElementById('root')!);

root.render(<App />);
