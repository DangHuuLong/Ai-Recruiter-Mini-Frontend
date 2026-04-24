type PageProps = {
  params: {
    id: string;
  };
};

export default function Page({ params }: PageProps) {
  return (
    <main>
      <h1>Candidate Detail</h1>
      <p>ID: {params.id}</p>
    </main>
  );
}