import App from './App';
import './styles/settings.scss';
import { createRoot } from 'react-dom/client'

const element = document.getElementById('root');
const root = createRoot(element!);
root.render(
    <App />
);
