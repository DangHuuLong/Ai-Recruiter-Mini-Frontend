type MainContentProps = {
  children: React.ReactNode;
};

export function MainContent({ children }: MainContentProps) {
  return <main className="flex-1 px-8 py-8">{children}</main>;
}