'use client';

export function ShareButton({ title, slug }: { title: string; slug: string }) {
  const handleShare = () => {
    const shareUrl = window.location.href;

    if (navigator.share) {
      navigator.share({
        title: title,
        url: shareUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('Enlace copiado al portapapeles');
    }
  };

  const handleCopyLink = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl);
    alert('Enlace copiado al portapapeles');
  };

  return (
    <>
      <button
        onClick={handleShare}
        className="flex w-10 h-10 items-center justify-center rounded-full bg-slate-100 hover:bg-green-100 text-slate-800 transition-colors"
        title="Compartir"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
      </button>
      <button
        onClick={handleCopyLink}
        className="flex w-10 h-10 items-center justify-center rounded-full bg-slate-100 hover:bg-green-100 text-slate-800 transition-colors"
        title="Copiar enlace"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      </button>
    </>
  );
}
