interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-red-50">
      <div className="festive-card max-w-md text-center">
        <h1 className="text-4xl font-heading text-christmas-red mb-4">
          🎅 Oops! Something went wrong
        </h1>
        <p className="text-gray-700 mb-2">Santa's elves are working on it!</p>
        <p className="text-sm text-gray-600 mb-6">{error.message}</p>
        <button onClick={resetErrorBoundary} className="festive-button">
          🎄 Try Again
        </button>
      </div>
    </div>
  );
}

export default ErrorFallback;
