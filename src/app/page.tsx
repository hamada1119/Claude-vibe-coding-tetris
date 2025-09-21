import TetrisGame from "@/components/TetrisGame";

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <TetrisGame />
    </div>
  );
}
