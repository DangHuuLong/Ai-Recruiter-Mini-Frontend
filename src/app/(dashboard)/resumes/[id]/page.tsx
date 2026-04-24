type PageProps = {
  params: {
    id: string;
  };
};

export default function Page({ params }: PageProps) {
  return (
    <main>
      <h1>Resume Detail</h1>
      <p>ID: {params.id}</p>
    </main>
  );
}