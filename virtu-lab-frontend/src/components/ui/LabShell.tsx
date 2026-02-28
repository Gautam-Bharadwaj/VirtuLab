import React, { ReactNode } from 'react';

interface LabShellProps {
  children: ReactNode;
  sidebar: ReactNode;
  tutor: ReactNode;
}

export const LabShell: React.FC<LabShellProps> = ({ children, sidebar, tutor }) => {
  return (
    <div>
      {/* Basic LabShell stub */}
      <header>Header</header>
      <main>
        <aside>{sidebar}</aside>
        <section>{children}</section>
        <aside>{tutor}</aside>
      </main>
      <footer>Footer</footer>
    </div>
  );
};
