import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('💥 [Enterprise Error Boundary] Uncaught Component Error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-screen bg-[#0A0A0E] text-white flex justify-center items-center p-4">
          <div className="w-full max-w-[390px] p-6 rounded-3xl bg-[#13131A] border border-red-500/40 text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-red-950/60 border border-red-500/40 p-3 mx-auto flex items-center justify-center text-red-500 shadow-[0_0_25px_rgba(239,68,68,0.3)]">
              <ShieldAlert className="w-8 h-8 animate-pulse" />
            </div>

            <div className="space-y-1">
              <span className="text-[9px] uppercase font-mono font-bold text-red-400 bg-red-950/80 px-2.5 py-0.5 rounded border border-red-800">
                ENTERPRISE RECOVERY SYSTEM
              </span>
              <h2 className="text-base font-bold text-white mt-1">
                เกิดข้อผิดพลาดในการแสดงผล (UI Exception)
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                ระบบได้ป้องกันไม่ให้แอปพลิเคชันล่ม คุณสามารถกดรีโหลดเพื่อเข้าใช้งานต่อได้อย่างปลอดภัย
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 rounded-xl bg-black/60 border border-zinc-800 text-left font-mono text-[10px] text-red-300 break-all max-h-24 overflow-y-auto scrollbar-thin">
                {this.state.error.toString()}
              </div>
            )}

            <div className="space-y-2 pt-2">
              <button
                onClick={this.handleReset}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#B8860B] text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer active:scale-95 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                <span>รีโหลดแอปพลิเคชัน (Reload App)</span>
              </button>

              <button
                onClick={() => (window.location.href = '/')}
                className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold flex items-center justify-center gap-2 border border-zinc-800 cursor-pointer"
              >
                <Home className="w-3.5 h-3.5" />
                <span>กลับสู่หน้าหลัก</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
