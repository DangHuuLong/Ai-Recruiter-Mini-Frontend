type MainContentProps = {
  children: React.ReactNode;
};

export function MainContent({ children }: MainContentProps) {
  return (
    <main className="no-scrollbar min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1540px]">{children}</div>
    </main>
  );
}