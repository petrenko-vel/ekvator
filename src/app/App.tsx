// ============================================================
// APP.TSX — корень React-приложения
//
// Здесь минимум логики: только сборка провайдеров.
// Все фичи — в слоях FSD, не здесь.
// Провайдеры оборачиваем снаружи внутрь по зависимостям:
// RouterProvider зависит от store → store инициализируется раньше.
// ============================================================

import { RouterProvider } from './providers/RouterProvider';
import '@/styles/main.scss'

const App = () => {
  return <RouterProvider />;
};

export default App;