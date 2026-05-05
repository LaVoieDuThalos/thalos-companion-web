// hooks/useCopyToClipboard.ts
import { useCallback, useState } from 'react';

export const useCopyToClipboard = () => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      // Méthode moderne (Clipboard API)
      await navigator.clipboard.writeText(text);
      setIsCopied(true);

      // Réinitialiser après 2 secondes
      setTimeout(() => setIsCopied(false), 2000);
      return true;
    } catch (error) {
      console.error('Erreur lors de la copie :', error);
      // Fallback pour les anciens navigateurs
      return fallbackCopy(text);
    }
  }, []);

  const fallbackCopy = (text: string): boolean => {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      return true;
    } catch (error) {
      console.error('Erreur fallback :', error);
      return false;
    }
  };

  return { copyToClipboard, isCopied };
};
