type MainContentProps = {
  children: React.ReactNode;
};

export function MainContent({ children }: MainContentProps) {
  return (
    <main className="flex-1 overflow-y-auto">
      <div className="mx-auto w-full max-w-content px-6 py-6">
        {children}
      </div>
    </main>
  );
}