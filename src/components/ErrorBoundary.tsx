import { Component, type ErrorInfo, type ReactNode } from "react";

const FALLBACK_TITLE = "⚠ Algo salió mal";
const FALLBACK_MESSAGE = "La aplicación encontró un error inesperado. Recargá la página para continuar.";
const RELOAD_LABEL = "Recargar";
const FALLBACK_MESSAGE_CLASS = "font-mono text-sm mt-2";
const FALLBACK_BOX_CLASS = "p-6 m-4 border-3 border-ink shadow-hard2 bg-paper text-ink";
const RELOAD_BUTTON_CLASS = "mt-4 border-3 border-ink shadow-hard bg-brand-orange font-black uppercase px-4 py-2";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/**
 * Catches render errors in the component tree below it and shows a brutalist
 * fallback instead of a blank white screen.
 *
 * This has to be a class component: React only supports error boundaries via
 * `getDerivedStateFromError`/`componentDidCatch`, which have no hook equivalent.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Unhandled render error", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div role="alert" className={FALLBACK_BOX_CLASS}>
          <h1 className="font-black uppercase text-lg">{FALLBACK_TITLE}</h1>
          <p className={FALLBACK_MESSAGE_CLASS}>{FALLBACK_MESSAGE}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className={RELOAD_BUTTON_CLASS}
          >
            {RELOAD_LABEL}
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
