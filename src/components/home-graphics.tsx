import type { ReactNode } from 'react';
import styles from './home-graphics.module.css';

type Scene = 'news' | 'press' | 'story' | 'core' | 'faculties' | 'learning' | 'discipline' | 'contact';

// Each flag is painted into its own scene, including its physical mounting.
const flagMotifs: Partial<Record<Scene, string>> = {
  news: 'classroom-bracket',
  faculties: 'academic-pedestal',
  contact: 'entrance-gatepost',
};

export function HomeGraphics({ children }: { children: ReactNode }) {
  return <div className={styles.surface}>{children}</div>;
}

export function HomeSectionGraphics({ scene }: { scene: Scene }) {
  return (
    <div className={`${styles.background} ${styles[scene]}`} data-section-background={scene} data-integrated-flag={flagMotifs[scene]} aria-hidden="true">
      <div className={styles.scene} />
    </div>
  );
}
