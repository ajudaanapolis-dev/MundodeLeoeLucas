import './styles/base.css';
import { Router } from '@/app/Router';
import { audio } from '@/audio/AudioEngine';
import { HomeScreen } from '@/screens/HomeScreen';
import { AlphabetScreen } from '@/lucas/alphabet/AlphabetScreen';
import { SceneScreen } from '@/lucas/alphabet/SceneScreen';
import { LeoHome } from '@/leo/LeoHome';
import { AquariumLab } from '@/leo/labs/AquariumLab';
import { investigationLab } from '@/leo/labs/InvestigationLab';
import { ParentDashboard } from '@/parent/ParentDashboard';

const host = document.getElementById('app');
if (!host) throw new Error('Elemento #app não encontrado');

// Desbloqueio de áudio no primeiro gesto (Safari/iOS).
const unlock = () => audio.unlock();
window.addEventListener('pointerdown', unlock, { once: true });
window.addEventListener('keydown', unlock, { once: true });

const router = new Router(host, HomeScreen);
router
  .add('/', HomeScreen)
  .add('/lucas', AlphabetScreen)
  .add('/lucas/:letter', SceneScreen)
  .add('/leo', LeoHome)
  .add('/leo/aquario', AquariumLab)
  .add('/leo/carnivoras', investigationLab('carnivoras'))
  .add('/leo/invertebrados', investigationLab('invertebrados'))
  .add('/leo/axolotes', investigationLab('axolotes'))
  .add('/leo/metodo', investigationLab('metodo'))
  .add('/pais', ParentDashboard)
  .start();

// Registro do service worker (PWA / offline).
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    const swUrl = `${import.meta.env.BASE_URL}sw.js`;
    navigator.serviceWorker.register(swUrl).catch((e) => console.warn('SW falhou', e));
  });
}
