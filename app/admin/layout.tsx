export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div >
      <h1>Panel de Administrador</h1>
      {children}
    </div>
  );
}
