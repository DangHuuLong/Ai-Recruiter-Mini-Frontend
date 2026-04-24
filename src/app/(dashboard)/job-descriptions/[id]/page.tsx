type PageProps = {
  params: {
    id: string;
  };
};

export default function Page({ params }: PageProps) {
  return (
    <main>
      <h1>Job Description Detail</h1>
      <p>ID: {params.id}</p>
    </main>
  );
}