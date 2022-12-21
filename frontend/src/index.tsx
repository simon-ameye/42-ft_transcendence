import App from './App';
import './styles/settings.scss';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

const element = document.getElementById('root');
const root = createRoot(element!);
root.render(
	<BrowserRouter>
    <App />
	</BrowserRouter>
);
