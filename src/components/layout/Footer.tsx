export default function Footer() {
  return (
    <footer className="mt-12 border-t py-6 text-center text-sm text-muted-foreground">
      <div className="mx-auto max-w-6xl px-4">
        © {new Date().getFullYear()} Yousef Coaching — كل الحقوق محفوظة
      </div>
    </footer>
  );
}
