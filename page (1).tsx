import RegisterForm from "./register-form";

export default function RegisterPage() {
  return (
    <main className="form-page">
      <div className="form-header"><a className="brand" href="/"><span className="brand-mark">APC</span><span>YOUTH FOR<br />PROGRESSIVE NIGERIA</span></a><a className="back-link" href="/">← Back to home</a></div>
      <section className="form-shell">
        <span className="eyebrow">MEMBERSHIP APPLICATION · 18+</span>
        <h1>Create your account</h1>
        <p className="form-intro">Enter your details to submit an application for review. Submission does not mean membership has been approved.</p>
        <RegisterForm />
      </section>
    </main>
  );
}
